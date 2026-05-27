import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, Mail, Phone, MessageCircle } from "lucide-react";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const profileSchema = z.object({
  first_name: z.string().trim().max(80).optional().or(z.literal("")),
  last_name: z.string().trim().max(80).optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  avatar_url: z.string().optional().or(z.literal("")),
  preferred_contact_method: z.enum(["email", "whatsapp", "call"]).optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileEditForm = () => {
  const { profile, refreshProfile } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      first_name: (profile?.first_name as string) || "",
      last_name: (profile?.last_name as string) || "",
      email: (profile?.email as string) || "",
      phone: (profile?.phone as string) || "",
      avatar_url: (profile?.avatar_url as string) || "",
      preferred_contact_method:
        ((profile?.preferred_contact_method as "email" | "whatsapp" | "call" | null) || "") as
          | ""
          | "email"
          | "whatsapp"
          | "call",
    },
  });

  useEffect(() => {
    if (profile?.avatar_url) {
      setAvatarPreview(profile.avatar_url as string);
    }
  }, [profile?.avatar_url]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5MB or smaller");
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!profile) return;

    setSubmitting(true);
    try {
      let avatar_url = values.avatar_url || null;

      // Upload avatar to public `avatars` bucket — RLS expects path `${user.id}/...`
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop() || "jpg";
        const filePath = `${profile.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, { upsert: true, cacheControl: "3600" });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
        avatar_url = data.publicUrl;
      }

      const first = (values.first_name || "").trim();
      const last = (values.last_name || "").trim();
      const full_name = `${first} ${last}`.trim() || null;

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: first || null,
          last_name: last || null,
          full_name,
          phone: values.phone?.trim() || null,
          avatar_url,
          preferred_contact_method: values.preferred_contact_method || null,
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
      setAvatarFile(null);
      await refreshProfile();
    } catch (error) {
      console.error("Failed to update profile:", error);
      const msg = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarPreview || undefined} />
            <AvatarFallback className="text-xl">
              {(profile?.first_name?.[0] || "U").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              id="avatar-input"
            />
            <label
              htmlFor="avatar-input"
              className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 cursor-pointer transition-opacity text-sm font-medium"
            >
              Choose Photo
            </label>
            <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF (max. 5MB)</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email Address
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} disabled />
                  </FormControl>
                  <FormDescription>Email cannot be changed. Contact support for changes.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="+234 701 000 0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferred_contact_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" /> Preferred contact method
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select how you'd like to be contacted" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="call">Call</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>How we should reach out about updates and offers.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={submitting} className="w-full md:w-auto">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ProfileEditForm;
