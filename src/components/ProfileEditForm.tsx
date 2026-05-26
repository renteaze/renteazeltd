import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save, Mail, Phone, User, MessageCircle } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required").optional().or(z.literal("")),
  last_name: z.string().optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  avatar_url: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
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
      bio: ((profile as any)?.bio as string) || "",
      preferred_contact_method: (((profile as any)?.preferred_contact_method as "email" | "whatsapp" | "call" | null) || "") as "" | "email" | "whatsapp" | "call",
    },
  });

  useEffect(() => {
    if (profile?.avatar_url) {
      setAvatarPreview(profile.avatar_url as string);
    }
  }, [profile?.avatar_url]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!profile) return;

    setSubmitting(true);
    try {
      let avatar_url = values.avatar_url;

      // Upload avatar if changed
      if (avatarFile) {
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("tenant-documents") // Using tenant-documents bucket; ideally should be a separate avatars bucket
          .upload(filePath, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("tenant-documents")
          .getPublicUrl(filePath);
        avatar_url = data.publicUrl;
      }

      // Update profile
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: values.first_name || null,
          last_name: values.last_name || null,
          phone: values.phone || null,
          avatar_url: avatar_url || null,
          ...({ bio: values.bio || null } as any),
          ...({ preferred_contact_method: values.preferred_contact_method || null } as any),
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
      await refreshProfile();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar section */}
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

      {/* Form section */}
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

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Bio
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little about yourself..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Max 500 characters</FormDescription>
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
