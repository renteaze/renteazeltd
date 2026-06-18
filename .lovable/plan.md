# Investigate Missing Signup Confirmation Email

A user signed up but never received the confirmation email. Before changing anything, I need to identify *why* — there are several possible causes and the fix depends on which one applies.

## Diagnostic steps

1. **Check Supabase Auth settings**
   - Confirm "Confirm email" is enabled for the Email provider.
   - Check the Auth rate limits (Supabase's default SMTP is capped at ~2 emails/hour and is for testing only — this is the most common cause).

2. **Check whether a custom auth email hook is configured**
   - The project has no `auth-email-hook` edge function and no email domain set up in Lovable Emails. That means auth emails are currently sent via Supabase's built-in default SMTP, which is rate-limited and not for production.
   - Look at recent Auth logs for the user's signup to see if the email send was attempted, throttled, or bounced.

3. **Check the user's row in `auth.users`**
   - Look at `email_confirmed_at` (null = still pending), `confirmation_sent_at`, and `email` to make sure the address is correct.

4. **Check spam/typo**
   - Confirm with the user the exact email address used and ask them to check spam/promotions.

## Likely fix (pending diagnosis)

If the cause is Supabase's default SMTP being rate-limited/unreliable (very likely), the proper fix is to set up **Lovable Emails** with a verified sender domain and scaffold the auth email templates so confirmation emails are sent reliably from your own domain.

That involves:
- Setting up an email sender domain (DNS delegation to Lovable).
- Scaffolding the `auth-email-hook` edge function + branded React Email templates (signup, recovery, magic link, etc.).
- Deploying the hook so Supabase routes auth emails through it.

No default templates change is needed if you only want delivery to work — but custom branded templates are recommended.

## Manual recovery for the affected user

While we fix delivery, I can either:
- Resend the confirmation from the Supabase Users dashboard, or
- Manually mark the user as confirmed (admin action) so they can sign in immediately.

## Questions before I proceed

1. Can you share the email address used (so I can check `auth.users` + auth logs)?
2. Do you want me to set up **Lovable Emails with your own sender domain** now (recommended, fixes deliverability permanently)?
3. For the stuck user, should I resend the confirmation or manually confirm their account?
