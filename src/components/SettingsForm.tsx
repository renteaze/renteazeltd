import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, Lock, Bell, Globe } from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const passwordSchema = z.object({
  current_password: z.string().min(6, "Password must be at least 6 characters"),
  new_password: z.string().min(6, "Password must be at least 6 characters"),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
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
  two_factor_enabled: z.boolean(),
  language: z.string(),
  timezone: z.string(),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;
type PreferencesFormValues = z.infer<typeof preferencesSchema>;

interface UserPreferences {
  [key: string]: unknown;
}

const SettingsForm = () => {
  const { user } = useAuth();
  const [loadingPrefs, setLoadingPrefs] = useState(true);
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [submittingPrefs, setSubmittingPrefs] = useState(false);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const preferencesForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
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
      two_factor_enabled: false,
      language: "en",
      timezone: "Africa/Lagos",
    },
  });

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      try {
        const { data, error } = await (supabase as any)
          .from("user_preferences")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setPrefs(data);
          preferencesForm.reset(data as PreferencesFormValues);
        }
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
    if (!user) return;

    setSubmittingPassword(true);
    try {
      // Update password via Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: values.new_password,
      });

      if (error) throw error;

      toast.success("Password updated successfully");
      passwordForm.reset();
    } catch (error) {
      console.error("Failed to update password:", error);
      toast.error("Failed to update password");
    } finally {
      setSubmittingPassword(false);
    }
  };

  const onPreferencesSubmit = async (values: PreferencesFormValues) => {
    if (!user) return;

    setSubmittingPrefs(true);
    try {
      const { error } = await (supabase as any)
        .from("user_preferences")
        .update(values)
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Settings saved successfully");
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

  return (
    <div className="space-y-6">
      {/* Password Section */}
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
                    <Input type="password" placeholder="Enter your current password" {...field} />
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
                    <Input type="password" placeholder="Enter a new password" {...field} />
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
                    <Input type="password" placeholder="Confirm your new password" {...field} />
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
            {/* Email */}
            <div>
              <h4 className="font-medium mb-3">Email Notifications</h4>
              <div className="space-y-3 ml-4">
                <FormField
                  control={preferencesForm.control}
                  name="email_notifications_enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel className="font-normal">Enable all email notifications</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {preferencesForm.watch("email_notifications_enabled") && (
                  <>
                    <FormField
                      control={preferencesForm.control}
                      name="email_transaction_alerts"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel className="font-normal">Transaction alerts</FormLabel>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={preferencesForm.control}
                      name="email_updates"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel className="font-normal">Updates & announcements</FormLabel>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={preferencesForm.control}
                      name="email_marketing"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel className="font-normal">Marketing & promotions</FormLabel>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
            </div>

            {/* In-App */}
            <div>
              <h4 className="font-medium mb-3">In-App Notifications</h4>
              <div className="space-y-3 ml-4">
                <FormField
                  control={preferencesForm.control}
                  name="in_app_notifications_enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel className="font-normal">Enable all in-app notifications</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {preferencesForm.watch("in_app_notifications_enabled") && (
                  <>
                    <FormField
                      control={preferencesForm.control}
                      name="in_app_system_alerts"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel className="font-normal">System alerts</FormLabel>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={preferencesForm.control}
                      name="in_app_offers"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel className="font-normal">Offers & recommendations</FormLabel>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
            </div>

            {/* SMS */}
            <div>
              <h4 className="font-medium mb-3">SMS Notifications</h4>
              <div className="space-y-3 ml-4">
                <FormField
                  control={preferencesForm.control}
                  name="sms_notifications_enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel className="font-normal">Enable SMS notifications</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {preferencesForm.watch("sms_notifications_enabled") && (
                  <>
                    <FormField
                      control={preferencesForm.control}
                      name="sms_transaction_alerts"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel className="font-normal">Transaction alerts</FormLabel>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={preferencesForm.control}
                      name="sms_marketing"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <FormLabel className="font-normal">Marketing & promotions</FormLabel>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <h4 className="font-medium mb-3">WhatsApp Notifications</h4>
              <div className="space-y-3 ml-4">
                <FormField
                  control={preferencesForm.control}
                  name="whatsapp_notifications_enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel className="font-normal">Enable WhatsApp notifications</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {preferencesForm.watch("whatsapp_notifications_enabled") && (
                  <FormField
                    control={preferencesForm.control}
                    name="whatsapp_transaction_alerts"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel className="font-normal">Transaction alerts</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            {/* Push */}
            <div>
              <h4 className="font-medium mb-3">Push Notifications</h4>
              <div className="space-y-3 ml-4">
                <FormField
                  control={preferencesForm.control}
                  name="push_notifications_enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <FormLabel className="font-normal">Enable push notifications</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {preferencesForm.watch("push_notifications_enabled") && (
                  <FormField
                    control={preferencesForm.control}
                    name="push_offers"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <FormLabel className="font-normal">Offers & promotions</FormLabel>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            {/* General Preferences */}
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4" /> General Preferences
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={preferencesForm.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="yo">Yoruba</SelectItem>
                          <SelectItem value="ha">Hausa</SelectItem>
                          <SelectItem value="ig">Igbo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={preferencesForm.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Africa/Lagos">Africa/Lagos (WAT)</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                          <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Security */}
            <div className="pt-4 border-t">
              <FormField
                control={preferencesForm.control}
                name="two_factor_enabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel className="font-normal">Two-Factor Authentication</FormLabel>
                      <FormDescription>Enhance your account security</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} disabled />
                    </FormControl>
                  </FormItem>
                )}
              />
              <p className="text-xs text-muted-foreground mt-2">Coming soon</p>
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
