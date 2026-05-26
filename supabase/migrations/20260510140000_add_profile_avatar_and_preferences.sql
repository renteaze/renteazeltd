-- ============ ADD AVATAR_URL TO PROFILES ============
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT;

-- ============ USER_PREFERENCES TABLE ============
-- Stores notification preferences, email settings, etc.
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- Email notifications
  email_notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  email_marketing BOOLEAN NOT NULL DEFAULT false,
  email_updates BOOLEAN NOT NULL DEFAULT true,
  email_transaction_alerts BOOLEAN NOT NULL DEFAULT true,
  -- In-app notifications
  in_app_notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  in_app_offers BOOLEAN NOT NULL DEFAULT true,
  in_app_system_alerts BOOLEAN NOT NULL DEFAULT true,
  -- SMS notifications
  sms_notifications_enabled BOOLEAN NOT NULL DEFAULT false,
  sms_transaction_alerts BOOLEAN NOT NULL DEFAULT false,
  sms_marketing BOOLEAN NOT NULL DEFAULT false,
  -- WhatsApp notifications
  whatsapp_notifications_enabled BOOLEAN NOT NULL DEFAULT false,
  whatsapp_transaction_alerts BOOLEAN NOT NULL DEFAULT false,
  -- Push notifications (for mobile)
  push_notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  push_offers BOOLEAN NOT NULL DEFAULT false,
  -- General preferences
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'Africa/Lagos',
  two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own preferences
CREATE POLICY "Users read own preferences"
ON public.user_preferences
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users update own preferences"
ON public.user_preferences
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own preferences"
ON public.user_preferences
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admins can read all preferences
CREATE POLICY "Admins read all preferences"
ON public.user_preferences
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER trg_user_preferences_updated
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============ AUTO-CREATE PREFERENCES FOR NEW USERS ============
-- When a user is created, auto-insert a preferences row with defaults
CREATE OR REPLACE FUNCTION public.create_user_preferences()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger on profiles insert
DROP TRIGGER IF EXISTS trg_create_user_preferences ON public.profiles;
CREATE TRIGGER trg_create_user_preferences
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.create_user_preferences();
