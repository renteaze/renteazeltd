import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, Lock, Bell } from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  })
  .refine((data) => data.new_password !== data.current_password, {
    message: "New password must differ from current password",
    path: ["new_password"],
  });

const preferencesSchema = z.object({
  email_notifications_enabled: z.boolean(),
  email_marketing: z.boolean(),
  email_updates: z.boolean(),
  email_transaction_alerts: z.boolean(),
  in_app_notifications_enabled: z.boolean(),
  in_app_offers: z.boolean(),
  in_app_system_alerts: z.boolean(),
  sms_notifications_enabled: z.boolean(),
  sms_transaction_alerts: z.boolean(),
  sms_marketing: z.boolean(),
  whatsapp_notifications_enabled: z.boolean(),
  whatsapp_transaction_alerts: z.boolean(),
  push_notifications_enabled: z.boolean(),
  push_offers: z.boolean(),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;
type PreferencesFormValues = z.infer<typeof preferencesSchema>;

const DEFAULT_PREFS: PreferencesFormValues = {
  email_notifications_enabled: true,
  email_marketing: false,
  email_updates: true,
  email_transaction_alerts: true,
  in_app_notifications_enabled: true,
  in_app_offers: true,
  in_app_system_alerts: true,
  sms_notifications_enabled: false,
  sms_transaction_alerts: false,
  sms_marketing: false,
  whatsapp_notifications_enabled: false,
  whatsapp_transaction_alerts: false,
  push_notifications_enabled: true,
  push_offers: false,
};

const SettingsForm = () => {
  const { user } = useAuth();
  const [loadingPrefs, setLoadingPrefs] = useState(true);
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [submittingPrefs, setSubmittingPrefs] = useState(false);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current_password: "", new_password: "", confirm_password: "" },
  });

  const preferencesForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: DEFAULT_PREFS,
  });

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("notification_preferences")
          .eq("id", user.id)
          .maybeSingle();
        if (error) throw error;
        const stored = (data?.notification_preferences as Partial<PreferencesFormValues> | null) || {};
        preferencesForm.reset({ ...DEFAULT_PREFS, ...stored });
      } catch (error) {
        console.error("Failed to load preferences:", error);
        toast.error("Failed to load notification settings");
      } finally {
        setLoadingPrefs(false);
      }
    };
    loadPreferences();
  }, [user, preferencesForm]);

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    if (!user?.email) return;
    setSubmittingPassword(true);
    try {
      // Re-authenticate with the current password before allowing the change.
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: values.current_password,
      });
      if (verifyError) {
        toast.error("Current password is incorrect");
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: values.new_password });
      if (error) throw error;

      toast.success("Password updated successfully");
      passwordForm.reset();
    } catch (error) {
      console.error("Failed to update password:", error);
      const msg = error instanceof Error ? error.message : "Failed to update password";
      toast.error(msg);
    } finally {
      setSubmittingPassword(false);
    }
  };

  const onPreferencesSubmit = async (values: PreferencesFormValues) => {
    if (!user) return;
    setSubmittingPrefs(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ notification_preferences: values })
        .eq("id", user.id);
      if (error) throw error;
      toast.success("Notification settings saved");
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast.error("Failed to save settings");
    } finally {
      setSubmittingPrefs(false);
    }
  };

  if (loadingPrefs) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const toggle = (name: keyof PreferencesFormValues, label: string) => (
    <FormField
      control={preferencesForm.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center justify-between">
          <FormLabel className="font-normal">{label}</FormLabel>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );

  return (
    <div className="space-y-6">
      {/* Security */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Lock className="h-5 w-5" /> Security
        </h3>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <FormField
              control={passwordForm.control}
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" placeholder="Enter your current password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" placeholder="At least 8 characters" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" placeholder="Confirm your new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={submittingPassword}>
              {submittingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </form>
        </Form>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Bell className="h-5 w-5" /> Notification Preferences
        </h3>
        <Form {...preferencesForm}>
          <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Email</h4>
              <div className="space-y-3 ml-4">
                {toggle("email_notifications_enabled", "Enable all email notifications")}
                {preferencesForm.watch("email_notifications_enabled") && (
                  <>
                    {toggle("email_transaction_alerts", "Transaction alerts")}
                    {toggle("email_updates", "Updates & announcements")}
                    {toggle("email_marketing", "Marketing & promotions")}
                  </>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">In-App</h4>
              <div className="space-y-3 ml-4">
                {toggle("in_app_notifications_enabled", "Enable all in-app notifications")}
                {preferencesForm.watch("in_app_notifications_enabled") && (
                  <>
                    {toggle("in_app_system_alerts", "System alerts")}
                    {toggle("in_app_offers", "Offers & recommendations")}
                  </>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">SMS</h4>
              <div className="space-y-3 ml-4">
                {toggle("sms_notifications_enabled", "Enable SMS notifications")}
                {preferencesForm.watch("sms_notifications_enabled") && (
                  <>
                    {toggle("sms_transaction_alerts", "Transaction alerts")}
                    {toggle("sms_marketing", "Marketing & promotions")}
                  </>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">WhatsApp</h4>
              <div className="space-y-3 ml-4">
                {toggle("whatsapp_notifications_enabled", "Enable WhatsApp notifications")}
                {preferencesForm.watch("whatsapp_notifications_enabled") &&
                  toggle("whatsapp_transaction_alerts", "Transaction alerts")}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Push</h4>
              <div className="space-y-3 ml-4">
                {toggle("push_notifications_enabled", "Enable push notifications")}
                {preferencesForm.watch("push_notifications_enabled") &&
                  toggle("push_offers", "Offers & promotions")}
              </div>
            </div>

            <Button type="submit" disabled={submittingPrefs} className="w-full md:w-auto">
              {submittingPrefs ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsForm;
