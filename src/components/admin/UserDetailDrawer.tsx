import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  userId: string | null;
  onClose: () => void;
}

type FullProfile = Record<string, unknown> & {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  phone: string | null;
  survey_completed: boolean;
  survey_completed_at: string | null;
  created_at: string;
};

const UserDetailDrawer = ({ userId, onClose }: Props) => {
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      setLoading(true);
      setProfile(null);
      const [{ data: p }, { data: r }, { data: t }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId),
        supabase.from("profile_crm_tags").select("tags").eq("user_id", userId).maybeSingle(),
      ]);
      if (!active) return;
      setProfile(p as FullProfile | null);
      setRoles((r ?? []).map((x: { role: string }) => x.role));
      setTags(((t as { tags?: string[] } | null)?.tags) ?? []);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [userId]);

  return (
    <Sheet open={!!userId} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        {loading || !profile ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <SheetHeader className="text-left">
              <SheetTitle className="text-2xl">
                {profile.full_name || `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || profile.email || "User"}
              </SheetTitle>
              <SheetDescription className="flex flex-wrap items-center gap-2">
                <span>{profile.email}</span>
                {roles.map((r) => (
                  <Badge key={r} variant="secondary" className="text-[10px]">{r}</Badge>
                ))}
                {profile.survey_completed ? (
                  <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20">
                    Survey completed {profile.survey_completed_at ? `· ${new Date(profile.survey_completed_at).toLocaleDateString()}` : ""}
                  </Badge>
                ) : (
                  <Badge variant="outline">Survey incomplete</Badge>
                )}
              </SheetDescription>
            </SheetHeader>

            <Tabs defaultValue="basic" className="mt-6">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="tenancy">Tenancy</TabsTrigger>
                <TabsTrigger value="crm">Acquisition</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="mt-4 space-y-1">
                <Field label="First name" value={profile.first_name as string} />
                <Field label="Last name" value={profile.last_name as string} />
                <Field label="Phone" value={profile.phone as string} />
                <Field label="Phone verified" value={profile.phone_verified ? "Yes" : "No"} />
                <Field label="Gender" value={profile.gender as string} />
                <Field label="Age range" value={profile.age_range as string} />
                <Field label="Marital status" value={profile.marital_status as string} />
                <Field label="State of residence" value={profile.state_of_residence as string} />
                <Field label="Address of residence" value={profile.address_of_residence as string} />
                <Field
                  label="Residence coords"
                  value={profile.address_lat && profile.address_lon ? `${profile.address_lat}, ${profile.address_lon}` : null}
                />
                <Field label="Bedrooms" value={fmtNum(profile.bedrooms)} />
                <Field label="Bathrooms" value={fmtNum(profile.bathrooms)} />
                <Field label="Toilets" value={fmtNum(profile.toilets)} />
                <Field label="Occupation" value={profile.occupation as string} />
                <Field label="Office address" value={profile.office_address as string} />
                <Field
                  label="Office coords"
                  value={profile.office_lat && profile.office_lon ? `${profile.office_lat}, ${profile.office_lon}` : null}
                />
              </TabsContent>

              <TabsContent value="tenancy" className="mt-4 space-y-1">
                <Field label="Accommodation type" value={profile.accommodation_type as string} />
                <Field label="Accommodation type (other)" value={profile.accommodation_type_other as string} />
                <Field label="Currently a tenant" value={fmtBool(profile.is_current_tenant)} />
                <Field label="Property type" value={profile.tenancy_property_type as string} />
                <Field label="Property type (other)" value={profile.tenancy_property_type_other as string} />
                <Field label="Annual rent amount" value={profile.annual_rent_amount ? `₦${(profile.annual_rent_amount as number).toLocaleString("en-NG")}` : null} />
                <Field label="Tenancy duration" value={profile.tenancy_duration as string} />
                <Field label="Tenancy start date" value={profile.tenancy_start_date ? new Date(String(profile.tenancy_start_date)).toLocaleDateString() : null} />
                <Field label="Tenancy end date" value={profile.tenancy_end_date ? new Date(String(profile.tenancy_end_date)).toLocaleDateString() : null} />
                <Field label="Pays rent to" value={profile.pays_rent_to as string} />
                <Field label="Pays rent to (other)" value={profile.pays_rent_to_other as string} />
                <Field label="Rent payment ease (1–5)" value={fmtNum(profile.rent_payment_ease)} />
                <Field label="Pays on time" value={profile.pays_on_time as string} />
                <Field label="Payment method" value={profile.rent_payment_method as string} />
                <Field label="Payment method (other)" value={profile.rent_payment_method_other as string} />
                <Field label="Sought rent help before" value={fmtBool(profile.sought_rent_help_before)} />
                <Field label="Interested in platform" value={profile.interested_in_platform as string} />
              </TabsContent>

              <TabsContent value="crm" className="mt-4 space-y-1">
                <Field label="Acquisition source" value={profile.acquisition_source as string} />
                <Field label="Acquisition source (other)" value={profile.acquisition_source_other as string} />
                <Field label="Marital status (other)" value={profile.marital_status_other as string} />
                <Field label="Referral code" value={profile.referral_code as string} />
                <Field label="Referred by" value={profile.referred_by as string} />
                <Field label="Marketing consent" value={fmtBool(profile.marketing_consent)} />
                <Field label="Preferred contact method" value={profile.preferred_contact_method as string} />
                <div className="py-2 border-b">
                  <div className="text-xs text-muted-foreground mb-1">Preferred contact windows (for calls)</div>
                  {profile.preferred_contact_windows ? (
                    <div className="text-sm space-y-1">
                      {(Array.isArray(profile.preferred_contact_windows) 
                        ? profile.preferred_contact_windows 
                        : JSON.parse(String(profile.preferred_contact_windows))
                      ).map((w: any, i: number) => (
                        <div key={i} className="text-muted-foreground">
                          {w.day} — {w.time_of_day}
                        </div>
                      ))}
                    </div>
                  ) : <span className="text-sm text-muted-foreground">—</span>}
                </div>
                <div className="py-2 border-b">
                  <div className="text-xs text-muted-foreground mb-1">CRM tags</div>
                  <div className="flex flex-wrap gap-1">
                    {tags.length ? tags.map((t) => (
                      <Badge key={t} variant="outline" className="text-[11px]">{t}</Badge>
                    )) : <span className="text-sm text-muted-foreground">—</span>}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="account" className="mt-4 space-y-1">
                <Field label="Status" value={(profile.status as string)?.replace("_", " ")} />
                <Field label="KYC status" value={profile.kyc_status as string} />
                <Field label="KYC completed" value={fmtBool(profile.kyc_completed)} />
                <Field label="NIN verified" value={fmtBool(profile.nin_verified)} />
                <Field label="Bank" value={profile.bank_name as string} />
                <Field label="Bank account" value={profile.bank_account_number as string} />
                <Field label="Country" value={profile.country as string} />
                <Field label="Joined" value={new Date(profile.created_at).toLocaleString()} />
                {profile.profession_type ? (
                  <>
                    <Field label="Profession type" value={profile.profession_type as string} />
                    <Field label="Association" value={profile.professional_association as string} />
                    <Field label="Years experience" value={profile.years_experience as string} />
                  </>
                ) : null}
              </TabsContent>
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

const Field = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div className="flex justify-between gap-4 py-2 border-b last:border-0 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className={value ? "font-medium text-right" : "text-muted-foreground/60 text-right"}>
      {value || "—"}
    </span>
  </div>
);

const fmtBool = (v: unknown) => v === true ? "Yes" : v === false ? "No" : null;
const fmtNum = (v: unknown) => typeof v === "number" ? String(v) : null;

export default UserDetailDrawer;
