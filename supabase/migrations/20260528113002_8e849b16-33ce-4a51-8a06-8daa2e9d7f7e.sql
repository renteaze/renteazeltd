ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS survey_acknowledged_at timestamptz,
ADD COLUMN IF NOT EXISTS survey_acknowledged_by uuid;