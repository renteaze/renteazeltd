-- Survey Schema Overhaul: Add new columns for enhanced profile data collection
-- Migration: 20260516_survey_schema_overhaul

-- 1. Add numeric annual rent amount (replaces annual_rent_range for scoring)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS annual_rent_amount numeric DEFAULT NULL;

-- 2. Add tenancy start and end dates (auto-computed based on agreement length)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS tenancy_start_date date DEFAULT NULL,
ADD COLUMN IF NOT EXISTS tenancy_end_date date DEFAULT NULL;

-- 3. Add "Other" free-text columns for when user selects "Other" option
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS accommodation_type_other text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS tenancy_property_type_other text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS pays_rent_to_other text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS rent_payment_method_other text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS acquisition_source_other text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS marital_status_other text DEFAULT NULL;

-- 4. Add preferred contact windows (JSONB array for callback time slots when contact method = call)
-- Format: [{ "day": "Monday", "time_of_day": "morning"|"afternoon"|"evening" }, ...]
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferred_contact_windows jsonb DEFAULT NULL;

-- Note: existing annual_rent_range column is retained for backward compatibility
-- but surveys should write to annual_rent_amount instead, and lead-scoring
-- logic should use the new numeric amount for more precise targeting.

-- No RLS changes required — existing policies remain in effect
-- No trigger changes required — enforce_profile_user_safety covers all columns equally
