ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS country text DEFAULT 'NG',
  ADD COLUMN IF NOT EXISTS bedrooms integer,
  ADD COLUMN IF NOT EXISTS bathrooms integer,
  ADD COLUMN IF NOT EXISTS toilets integer,
  ADD COLUMN IF NOT EXISTS address_lat numeric,
  ADD COLUMN IF NOT EXISTS address_lon numeric,
  ADD COLUMN IF NOT EXISTS office_lat numeric,
  ADD COLUMN IF NOT EXISTS office_lon numeric;