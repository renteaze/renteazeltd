-- Explicit deny: OTP table is internal only
CREATE POLICY "No public access to OTP" ON public.otp_verifications
  FOR ALL USING (false) WITH CHECK (false);

-- Revoke direct execute on SECURITY DEFINER functions.
-- RLS policies still work because policies run with table owner privileges.
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;