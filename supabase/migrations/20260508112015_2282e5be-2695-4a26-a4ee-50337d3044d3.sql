-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('tenant', 'landlord', 'investor', 'professional', 'staff', 'admin');
CREATE TYPE public.account_status AS ENUM ('active', 'suspended', 'pending_approval');
CREATE TYPE public.kyc_status AS ENUM ('pending', 'verified', 'rejected');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  phone_verified BOOLEAN NOT NULL DEFAULT false,
  -- KYC
  nin TEXT,
  bvn TEXT,
  bank_account_number TEXT,
  bank_name TEXT,
  dob DATE,
  address TEXT,
  nin_verified BOOLEAN NOT NULL DEFAULT false,
  kyc_completed BOOLEAN NOT NULL DEFAULT false,
  kyc_status public.kyc_status NOT NULL DEFAULT 'pending',
  -- Status & referral
  status public.account_status NOT NULL DEFAULT 'active',
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  account_manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  -- Professional only
  profession_type TEXT,
  professional_association TEXT,
  years_experience TEXT,
  -- Survey
  survey_completed BOOLEAN NOT NULL DEFAULT false,
  survey_completed_at TIMESTAMPTZ,
  gender TEXT,
  marital_status TEXT,
  age_range TEXT,
  state_of_residence TEXT,
  address_of_residence TEXT,
  occupation TEXT,
  office_address TEXT,
  accommodation_type TEXT,
  is_current_tenant BOOLEAN,
  tenancy_property_type TEXT,
  annual_rent_range TEXT,
  tenancy_period TEXT,
  tenancy_duration TEXT,
  pays_rent_to TEXT,
  rent_payment_ease INTEGER,
  pays_on_time TEXT,
  rent_payment_method TEXT,
  sought_rent_help_before BOOLEAN,
  interested_in_platform TEXT,
  acquisition_source TEXT,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  -- CRM tags (auto-applied)
  crm_tags TEXT[] NOT NULL DEFAULT '{}'
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role security definer (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============ OTP VERIFICATIONS ============
CREATE TABLE public.otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
-- No public policies; only edge functions (service role) access this table.

-- ============ NOTIFICATIONS ============
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT NOT NULL DEFAULT 'system',
  is_read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============ POLICIES ============
-- profiles
CREATE POLICY "Users read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins read all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Admins update all profiles" ON public.profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- user_roles
CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins read all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- notifications
CREATE POLICY "Users read own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ============ TRIGGERS ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile + role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role public.app_role;
  _first TEXT;
  _last TEXT;
  _phone TEXT;
  _ref TEXT;
  _initial_status public.account_status;
  _ref_code TEXT;
BEGIN
  _role := COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'tenant');
  _first := NEW.raw_user_meta_data->>'first_name';
  _last := NEW.raw_user_meta_data->>'last_name';
  _phone := NEW.raw_user_meta_data->>'phone';
  _ref := NEW.raw_user_meta_data->>'referred_by';

  -- Professionals start pending approval
  _initial_status := CASE WHEN _role = 'professional' THEN 'pending_approval'::public.account_status
                          ELSE 'active'::public.account_status END;

  -- Generate referral code for professionals
  IF _role = 'professional' AND _last IS NOT NULL THEN
    _ref_code := 'PRO-' || UPPER(SUBSTRING(regexp_replace(_last, '[^a-zA-Z]', '', 'g'), 1, 6))
                 || '-' || LPAD((floor(random() * 100))::text, 2, '0');
  END IF;

  INSERT INTO public.profiles (id, first_name, last_name, full_name, email, phone, status, referred_by, referral_code)
  VALUES (
    NEW.id,
    _first,
    _last,
    NULLIF(TRIM(COALESCE(_first, '') || ' ' || COALESCE(_last, '')), ''),
    NEW.email,
    _phone,
    _initial_status,
    _ref,
    _ref_code
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Indexes
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id, is_read);
CREATE INDEX idx_otp_phone ON public.otp_verifications(phone);