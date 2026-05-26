-- ============ FIX: SYNC PROFILE DATA WITH AUTH.USERS ============
-- This migration ensures that all profiles are properly synced with auth.users
-- It handles cases where profiles might be missing or have empty fields

-- 1. Create profile rows for any auth users that don't have profiles
INSERT INTO public.profiles (id, email)
SELECT 
  u.id,
  u.email
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
AND u.created_at > now() - interval '90 days'  -- Only recent users
ON CONFLICT (id) DO NOTHING;

-- 2. Update profile email from auth.users if profile.email is NULL
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id
AND (p.email IS NULL OR p.email = '');

-- 3. Update profile names from auth metadata if empty
UPDATE public.profiles p
SET 
  first_name = COALESCE(p.first_name, u.raw_user_meta_data->>'first_name'),
  last_name = COALESCE(p.last_name, u.raw_user_meta_data->>'last_name'),
  full_name = COALESCE(
    NULLIF(TRIM(CONCAT(
      COALESCE(p.first_name, u.raw_user_meta_data->>'first_name', ''),
      ' ',
      COALESCE(p.last_name, u.raw_user_meta_data->>'last_name', '')
    )), ''),
    p.full_name
  )
FROM auth.users u
WHERE p.id = u.id
AND (p.first_name IS NULL OR p.first_name = '' OR p.last_name IS NULL OR p.last_name = '');

-- 4. Update phone from auth metadata if empty
UPDATE public.profiles p
SET phone = COALESCE(p.phone, u.raw_user_meta_data->>'phone')
FROM auth.users u
WHERE p.id = u.id
AND (p.phone IS NULL OR p.phone = '');

-- 5. Enhance handle_new_user trigger to ensure email is always synced
-- (This will apply to new signups going forward)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

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
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(profiles.email, EXCLUDED.email),
    first_name = COALESCE(profiles.first_name, EXCLUDED.first_name),
    last_name = COALESCE(profiles.last_name, EXCLUDED.last_name),
    full_name = COALESCE(profiles.full_name, EXCLUDED.full_name),
    phone = COALESCE(profiles.phone, EXCLUDED.phone);

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============ CREATE FUNCTION TO SYNC PROFILE FROM AUTH ============
-- This function can be called to refresh a user's profile data from auth.users
CREATE OR REPLACE FUNCTION public.sync_profile_from_auth(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles p
  SET 
    email = COALESCE(p.email, u.email),
    first_name = COALESCE(p.first_name, u.raw_user_meta_data->>'first_name'),
    last_name = COALESCE(p.last_name, u.raw_user_meta_data->>'last_name'),
    full_name = COALESCE(
      NULLIF(TRIM(CONCAT(
        COALESCE(p.first_name, u.raw_user_meta_data->>'first_name', ''),
        ' ',
        COALESCE(p.last_name, u.raw_user_meta_data->>'last_name', '')
      )), ''),
      p.full_name
    ),
    phone = COALESCE(p.phone, u.raw_user_meta_data->>'phone')
  FROM auth.users u
  WHERE p.id = u.id
  AND p.id = user_id;
END;
$$;
