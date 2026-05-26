
DROP POLICY IF EXISTS "Users insert own transactions" ON public.transactions;

CREATE POLICY "Users update own tenant documents"
ON storage.objects AS PERMISSIVE FOR UPDATE TO authenticated
USING (bucket_id = 'tenant-documents' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'tenant-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;

CREATE POLICY "Admins insert roles"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins update roles"
ON public.user_roles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins delete roles"
ON public.user_roles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Block anon role inserts" ON public.user_roles;
CREATE POLICY "Block anon role inserts"
ON public.user_roles AS RESTRICTIVE FOR INSERT TO anon
WITH CHECK (false);

DROP POLICY IF EXISTS "Block anon role updates" ON public.user_roles;
CREATE POLICY "Block anon role updates"
ON public.user_roles AS RESTRICTIVE FOR UPDATE TO anon
USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "Block anon role deletes" ON public.user_roles;
CREATE POLICY "Block anon role deletes"
ON public.user_roles AS RESTRICTIVE FOR DELETE TO anon
USING (false);
