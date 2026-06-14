
-- 1) Loan applications: enforce server-controlled financial fields
CREATE OR REPLACE FUNCTION public.enforce_loan_application_user_safety()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.status := 'submitted'::public.loan_status;
    NEW.approved_amount := NULL;
    NEW.interest_rate := NULL;
    NEW.repayment_months := NULL;
    NEW.monthly_repayment := NULL;
    NEW.outstanding_balance := NULL;
    NEW.disbursed_at := NULL;
    NEW.next_due_date := NULL;
    NEW.rejection_reason := NULL;
    NEW.reviewed_by := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.status := OLD.status;
    NEW.approved_amount := OLD.approved_amount;
    NEW.interest_rate := OLD.interest_rate;
    NEW.repayment_months := OLD.repayment_months;
    NEW.monthly_repayment := OLD.monthly_repayment;
    NEW.outstanding_balance := OLD.outstanding_balance;
    NEW.disbursed_at := OLD.disbursed_at;
    NEW.next_due_date := OLD.next_due_date;
    NEW.rejection_reason := OLD.rejection_reason;
    NEW.reviewed_by := OLD.reviewed_by;
    NEW.user_id := OLD.user_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_loan_app_safety ON public.loan_applications;
CREATE TRIGGER enforce_loan_app_safety
BEFORE INSERT OR UPDATE ON public.loan_applications
FOR EACH ROW EXECUTE FUNCTION public.enforce_loan_application_user_safety();

-- 2) Attach existing safety functions as triggers (they were defined but not attached)
DROP TRIGGER IF EXISTS enforce_savings_plan_safety ON public.savings_plans;
CREATE TRIGGER enforce_savings_plan_safety
BEFORE INSERT OR UPDATE ON public.savings_plans
FOR EACH ROW EXECUTE FUNCTION public.enforce_savings_plan_user_safety();

DROP TRIGGER IF EXISTS enforce_profile_safety ON public.profiles;
CREATE TRIGGER enforce_profile_safety
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.enforce_profile_user_safety();

-- 3) Lock down SECURITY DEFINER functions that should not be callable via the API
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_profile_user_safety() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_savings_plan_user_safety() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_loan_application_user_safety() FROM PUBLIC, anon, authenticated;

-- has_role and set_my_crm_tags remain callable by authenticated (needed for RLS / app)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.set_my_crm_tags(text[]) FROM anon;

-- 4) Stop public listing of the avatars bucket. Individual files remain accessible
--    via getPublicUrl (public buckets bypass RLS for direct object reads).
DROP POLICY IF EXISTS "Avatars are publicly readable" ON storage.objects;

CREATE POLICY "Users list own avatar folder"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'avatars' AND (auth.uid())::text = (storage.foldername(name))[1]);
