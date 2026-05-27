ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS annual_rent_amount numeric,
  ADD COLUMN IF NOT EXISTS tenancy_start_date date,
  ADD COLUMN IF NOT EXISTS tenancy_end_date date,
  ADD COLUMN IF NOT EXISTS marital_status_other text,
  ADD COLUMN IF NOT EXISTS accommodation_type_other text,
  ADD COLUMN IF NOT EXISTS tenancy_property_type_other text,
  ADD COLUMN IF NOT EXISTS pays_rent_to_other text,
  ADD COLUMN IF NOT EXISTS rent_payment_method_other text,
  ADD COLUMN IF NOT EXISTS preferred_contact_windows jsonb;