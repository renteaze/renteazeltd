
-- 1) Savings plans safety trigger: prevent non-admins from manipulating sensitive financial fields
CREATE OR REPLACE FUNCTION public.enforce_savings_plan_user_safety()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_savings_plans_user_safety ON public.savings_plans;
CREATE TRIGGER trg_savings_plans_user_safety
BEFORE INSERT OR UPDATE ON public.savings_plans
FOR EACH ROW EXECUTE FUNCTION public.enforce_savings_plan_user_safety();

-- 2) Move staff_notes off loan_applications into admin-only table
CREATE TABLE IF NOT EXISTS public.loan_application_staff_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_application_id uuid NOT NULL REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  notes text,
  author_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_loan_app_staff_notes_loan ON public.loan_application_staff_notes(loan_application_id);
ALTER TABLE public.loan_application_staff_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage loan staff notes" ON public.loan_application_staff_notes;
CREATE POLICY "Admins manage loan staff notes" ON public.loan_application_staff_notes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

INSERT INTO public.loan_application_staff_notes (loan_application_id, notes, author_id)
SELECT id, staff_notes, reviewed_by
FROM public.loan_applications
WHERE staff_notes IS NOT NULL;

ALTER TABLE public.loan_applications DROP COLUMN IF EXISTS staff_notes;

CREATE TRIGGER update_loan_app_staff_notes_updated_at
BEFORE UPDATE ON public.loan_application_staff_notes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Move crm_tags off profiles into admin-only table
CREATE TABLE IF NOT EXISTS public.profile_crm_tags (
  user_id uuid PRIMARY KEY,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profile_crm_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage CRM tags" ON public.profile_crm_tags;
CREATE POLICY "Admins manage CRM tags" ON public.profile_crm_tags
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

INSERT INTO public.profile_crm_tags (user_id, tags)
SELECT id, crm_tags FROM public.profiles
WHERE crm_tags IS NOT NULL AND array_length(crm_tags, 1) > 0
ON CONFLICT (user_id) DO NOTHING;

-- Server-side helper so survey writes can still record CRM tags without the column on profiles
CREATE OR REPLACE FUNCTION public.set_my_crm_tags(_tags text[])
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'auth required';
  END IF;
  INSERT INTO public.profile_crm_tags (user_id, tags)
  VALUES (auth.uid(), COALESCE(_tags, '{}'::text[]))
  ON CONFLICT (user_id) DO UPDATE SET tags = EXCLUDED.tags, updated_at = now();
END;
$$;
REVOKE EXECUTE ON FUNCTION public.set_my_crm_tags(text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_my_crm_tags(text[]) TO authenticated;

ALTER TABLE public.profiles DROP COLUMN IF EXISTS crm_tags;

CREATE TRIGGER update_profile_crm_tags_updated_at
BEFORE UPDATE ON public.profile_crm_tags
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) Lock down trigger-only SECURITY DEFINER functions from API exposure
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
