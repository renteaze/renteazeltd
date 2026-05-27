-- Backfill legacy survey values so they match the current dropdown options
-- so prefill works when users reopen the survey.

UPDATE public.profiles SET age_range = CASE age_range
  WHEN '35-44' THEN '31-45'
  WHEN '25-34' THEN '18-30'
  WHEN '45-54' THEN '46-55'
  WHEN '55-64' THEN '56-65'
  ELSE age_range
END
WHERE age_range IN ('25-34','35-44','45-54','55-64');

UPDATE public.profiles SET tenancy_property_type = CASE tenancy_property_type
  WHEN 'flat' THEN 'residential'
  WHEN 'bungalow' THEN 'residential'
  WHEN 'duplex' THEN 'residential'
  WHEN 'tenement' THEN 'residential'
  WHEN 'office' THEN 'commercial'
  WHEN 'shop' THEN 'commercial'
  WHEN 'warehouse' THEN 'warehousing'
  ELSE tenancy_property_type
END
WHERE tenancy_property_type IN ('flat','bungalow','duplex','tenement','office','shop','warehouse');