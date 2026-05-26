
-- Enums
CREATE TYPE public.savings_product_type AS ENUM ('save_for_rent','save_to_own','save_for_house');
CREATE TYPE public.savings_plan_status AS ENUM ('active','completed','disbursement_requested','disbursed','paused','cancelled');
CREATE TYPE public.transaction_type AS ENUM ('savings_credit','savings_debit','loan_disbursement','loan_repayment','payout','commission_payment','manual_adjustment');
CREATE TYPE public.transaction_direction AS ENUM ('credit','debit');
CREATE TYPE public.transaction_status AS ENUM ('pending','confirmed','failed','reversed');
CREATE TYPE public.loan_product_type AS ENUM ('loan_for_rent','add_on_funds','upgrade','construction','renovation','repair');
CREATE TYPE public.loan_status AS ENUM ('submitted','under_review','approved','disbursed','active_repayment','closed','rejected');
CREATE TYPE public.document_type AS ENUM ('government_id','proof_of_income','tenancy_agreement','utility_bill','title_deed','loan_agreement','passport','proof_of_address','tax_id','other');
CREATE TYPE public.document_status AS ENUM ('pending','verified','rejected');

-- savings_plans
CREATE TABLE public.savings_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_type public.savings_product_type NOT NULL DEFAULT 'save_for_rent',
  annual_rent_target NUMERIC(14,2) NOT NULL CHECK (annual_rent_target > 0),
  monthly_contribution NUMERIC(14,2) NOT NULL,
  current_balance NUMERIC(14,2) NOT NULL DEFAULT 0,
  months_completed INTEGER NOT NULL DEFAULT 0,
  target_months INTEGER NOT NULL DEFAULT 10,
  status public.savings_plan_status NOT NULL DEFAULT 'active',
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  virtual_account_number TEXT,
  virtual_bank_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_savings_plans_user ON public.savings_plans(user_id);
ALTER TABLE public.savings_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own savings plans" ON public.savings_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own savings plans" ON public.savings_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own savings plans" ON public.savings_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins read all savings plans" ON public.savings_plans FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update all savings plans" ON public.savings_plans FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_savings_plans_updated BEFORE UPDATE ON public.savings_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- loan_applications
CREATE TABLE public.loan_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_type public.loan_product_type NOT NULL,
  landlord_name TEXT,
  property_address TEXT,
  annual_rent NUMERIC(14,2),
  loan_amount_requested NUMERIC(14,2) NOT NULL CHECK (loan_amount_requested > 0),
  employment_type TEXT,
  monthly_income NUMERIC(14,2),
  employer_name TEXT,
  job_tenure TEXT,
  status public.loan_status NOT NULL DEFAULT 'submitted',
  approved_amount NUMERIC(14,2),
  interest_rate NUMERIC(5,2),
  repayment_months INTEGER,
  monthly_repayment NUMERIC(14,2),
  outstanding_balance NUMERIC(14,2),
  disbursed_at TIMESTAMPTZ,
  next_due_date DATE,
  rejection_reason TEXT,
  staff_notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_loan_applications_user ON public.loan_applications(user_id);
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own loans" ON public.loan_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own loans" ON public.loan_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read all loans" ON public.loan_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update all loans" ON public.loan_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_loan_applications_updated BEFORE UPDATE ON public.loan_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- transactions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.savings_plans(id) ON DELETE SET NULL,
  loan_id UUID REFERENCES public.loan_applications(id) ON DELETE SET NULL,
  type public.transaction_type NOT NULL,
  direction public.transaction_direction NOT NULL,
  amount NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  reference TEXT,
  description TEXT,
  status public.transaction_status NOT NULL DEFAULT 'confirmed',
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_transactions_user ON public.transactions(user_id);
CREATE INDEX idx_transactions_plan ON public.transactions(plan_id);
CREATE INDEX idx_transactions_loan ON public.transactions(loan_id);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read all transactions" ON public.transactions FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins insert transactions" ON public.transactions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update transactions" ON public.transactions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- documents
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type public.document_type NOT NULL,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  status public.document_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_documents_owner ON public.documents(owner_id);
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own documents" ON public.documents FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users insert own documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users delete own pending documents" ON public.documents FOR DELETE USING (auth.uid() = owner_id AND status = 'pending');
CREATE POLICY "Admins read all documents" ON public.documents FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update documents" ON public.documents FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_documents_updated BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket: tenant-documents (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('tenant-documents','tenant-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: users can read/write own folder ([user_id]/...)
CREATE POLICY "Users read own tenant docs" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'tenant-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users upload own tenant docs" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'tenant-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own tenant docs" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'tenant-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Admins read all tenant docs" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'tenant-documents' AND public.has_role(auth.uid(),'admin'));
