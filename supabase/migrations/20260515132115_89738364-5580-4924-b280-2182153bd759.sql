
-- 1. Profiles: block non-admin writes to privileged columns
CREATE OR REPLACE FUNCTION public.enforce_profile_user_safety()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN NEW;
  END IF;

  -- Preserve privileged columns from OLD on user-driven updates
  NEW.nin := OLD.nin;
  NEW.bvn := OLD.bvn;
  NEW.bank_account_number := OLD.bank_account_number;
  NEW.bank_name := OLD.bank_name;
  NEW.dob := OLD.dob;
  NEW.nin_verified := OLD.nin_verified;
  NEW.phone_verified := OLD.phone_verified;
  NEW.kyc_completed := OLD.kyc_completed;
  NEW.kyc_status := OLD.kyc_status;
  NEW.account_manager_id := OLD.account_manager_id;
  NEW.status := OLD.status;
  NEW.referral_code := OLD.referral_code;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_profile_user_safety_trg ON public.profiles;
CREATE TRIGGER enforce_profile_user_safety_trg
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.enforce_profile_user_safety();

-- 2. Savings plans: extend safety trigger to also lock notes from non-admins
CREATE OR REPLACE FUNCTION public.enforce_savings_plan_user_safety()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.current_balance := 0;
    NEW.months_completed := 0;
    NEW.virtual_account_number := NULL;
    NEW.virtual_bank_name := NULL;
    NEW.status := 'active'::public.savings_plan_status;
    NEW.notes := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.current_balance := OLD.current_balance;
    NEW.months_completed := OLD.months_completed;
    NEW.virtual_account_number := OLD.virtual_account_number;
    NEW.virtual_bank_name := OLD.virtual_bank_name;
    NEW.status := OLD.status;
    NEW.annual_rent_target := OLD.annual_rent_target;
    NEW.monthly_contribution := OLD.monthly_contribution;
    NEW.start_date := OLD.start_date;
    NEW.product_type := OLD.product_type;
    NEW.notes := OLD.notes;
  END IF;

  RETURN NEW;
END;
$$;

-- 3. Lock down set_my_crm_tags so it cannot be invoked anonymously
REVOKE EXECUTE ON FUNCTION public.set_my_crm_tags(text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_my_crm_tags(text[]) TO authenticated;
