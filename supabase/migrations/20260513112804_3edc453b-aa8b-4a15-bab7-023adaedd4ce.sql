
-- Seed demo admin user
DO $$
DECLARE
  _admin_id uuid;
  _existing uuid;
BEGIN
  SELECT id INTO _existing FROM auth.users WHERE email = 'admin@renteaze.demo';

  IF _existing IS NULL THEN
    _admin_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change,
      email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      _admin_id,
      'authenticated',
      'authenticated',
      'admin@renteaze.demo',
      crypt('RenteazeAdmin!2026', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"first_name":"Demo","last_name":"Admin","role":"admin"}'::jsonb,
      now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      _admin_id,
      jsonb_build_object('sub', _admin_id::text, 'email', 'admin@renteaze.demo', 'email_verified', true),
      'email',
      _admin_id::text,
      now(), now(), now()
    );

    -- Ensure profile + role (handle_new_user trigger should fire, but make sure role is admin)
    INSERT INTO public.profiles (id, first_name, last_name, full_name, email, status)
    VALUES (_admin_id, 'Demo', 'Admin', 'Demo Admin', 'admin@renteaze.demo', 'active')
    ON CONFLICT (id) DO NOTHING;

    DELETE FROM public.user_roles WHERE user_id = _admin_id;
    INSERT INTO public.user_roles (user_id, role) VALUES (_admin_id, 'admin');
  END IF;
END $$;
