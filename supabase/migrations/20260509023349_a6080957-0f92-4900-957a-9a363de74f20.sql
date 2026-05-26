-- 1. Add INSERT policy on profiles so users can only create their own row
CREATE POLICY "Users insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 2. Restrict full-profile SELECT to admins only (was admin OR staff)
DROP POLICY IF EXISTS "Admins read all profiles" ON public.profiles;

CREATE POLICY "Admins read all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Block non-admin authenticated users from mutating user_roles
CREATE POLICY "Block non-admin role inserts"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Block non-admin role updates"
ON public.user_roles
AS RESTRICTIVE
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Block non-admin role deletes"
ON public.user_roles
AS RESTRICTIVE
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));