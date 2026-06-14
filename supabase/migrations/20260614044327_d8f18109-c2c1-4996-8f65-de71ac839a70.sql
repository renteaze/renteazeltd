
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _role public.app_role;
  _raw_role TEXT;
  _first TEXT;
  _last TEXT;
  _phone TEXT;
  _ref TEXT;
  _initial_status public.account_status;
  _ref_code TEXT;
BEGIN
  _raw_role := NEW.raw_user_meta_data->>'role';
  -- Whitelist: only allow non-privileged self-service roles.
  -- Any other value (including 'admin' or 'staff') falls back to 'tenant'.
  IF _raw_role IN ('tenant','landlord','investor','professional') THEN
    _role := _raw_role::public.app_role;
  ELSE
    _role := 'tenant'::public.app_role;
  END IF;

  _first := NEW.raw_user_meta_data->>'first_name';
  _last := NEW.raw_user_meta_data->>'last_name';
  _phone := NEW.raw_user_meta_data->>'phone';
  _ref := NEW.raw_user_meta_data->>'referred_by';

  _initial_status := CASE WHEN _role = 'professional' THEN 'pending_approval'::public.account_status
                          ELSE 'active'::public.account_status END;

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
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);

  RETURN NEW;
END;
$function$;
