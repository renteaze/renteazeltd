import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthShell from "@/components/auth/AuthShell";
import AddressAutocomplete from "@/components/auth/AddressAutocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, dashboardPathForRole } from "@/hooks/useAuth";
import { COUNTRIES, NIGERIAN_STATES } from "@/data/nigeria";
import { OtherInput } from "@/components/survey/OtherInput";
import { TenancyDatePicker } from "@/components/survey/TenancyDatePicker";
import { ContactWindowsPicker } from "@/components/survey/ContactWindowsPicker";

const NON_WORKING = ["student", "retired", "unemployed"];
const RESIDENTIAL_TYPES = ["tenement", "flat", "bungalow", "duplex"];

type Coords = { lat: number; lon: number };
type Opt = { v: string; l: string };
type ContactWindow = { day: string; time_of_day: "morning" | "afternoon" | "evening" };

const Survey = () => {
  const { user, profile, roles, refreshProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [a, setA] = useState<Record<string, string>>({ country: "NG" });
  const [residenceCoords, setResidenceCoords] = useState<Coords | null>(null);
  const [officeCoords, setOfficeCoords] = useState<Coords | null>(null);
  const [tenancyStartDate, setTenancyStartDate] = useState<Date | null>(null);
  const [tenancyEndDate, setTenancyEndDate] = useState<Date | null>(null);
  const [contactWindows, setContactWindows] = useState<ContactWindow[]>([]);

  const editMode = !!profile?.survey_completed;

  // Prefill from existing profile data
  useEffect(() => {
    if (!profile) return;
    const p = profile as Record<string, unknown>;
    const get = (k: string) => (p[k] == null ? "" : String(p[k]));
    setA({
      country: get("country") || "NG",
      q1: get("gender"),
      q2: get("marital_status"),
      q2_other: get("marital_status_other"),
      q3: get("age_range"),
      q4: get("state_of_residence"),
      q5: get("address_of_residence"),
      q6: get("occupation"),
      q7: get("office_address"),
      q8: get("accommodation_type"),
      q8_other: get("accommodation_type_other"),
      bedrooms: get("bedrooms"),
      bathrooms: get("bathrooms"),
      toilets: get("toilets"),
      q9: p.is_current_tenant === true ? "yes" : p.is_current_tenant === false ? "no" : "",
      q10: get("tenancy_property_type"),
      q10_other: get("tenancy_property_type_other"),
      q11: get("annual_rent_amount"),
      q13: get("tenancy_duration"),
      q14: get("pays_rent_to"),
      q14_other: get("pays_rent_to_other"),
      q15: get("rent_payment_ease"),
      q16: get("pays_on_time"),
      q17: get("rent_payment_method"),
      q17_other: get("rent_payment_method_other"),
      q18: p.sought_rent_help_before === true ? "yes" : p.sought_rent_help_before === false ? "no" : "",
      q19: get("interested_in_platform"),
      q20: get("acquisition_source"),
      q20_other: get("acquisition_source_other"),
      q21: get("preferred_contact_method"),
      q22: p.marketing_consent === true ? "yes" : p.marketing_consent === false ? "no" : "",
    });
    if (p.address_lat && p.address_lon) setResidenceCoords({ lat: Number(p.address_lat), lon: Number(p.address_lon) });
    if (p.office_lat && p.office_lon) setOfficeCoords({ lat: Number(p.office_lat), lon: Number(p.office_lon) });
    if (p.tenancy_start_date) setTenancyStartDate(new Date(String(p.tenancy_start_date)));
    if (p.tenancy_end_date) setTenancyEndDate(new Date(String(p.tenancy_end_date)));
    if (p.preferred_contact_windows) {
      try {
        const windows = JSON.parse(String(p.preferred_contact_windows));
        setContactWindows(Array.isArray(windows) ? windows : []);
      } catch {
        setContactWindows([]);
      }
    }
  }, [profile]);

  // Resume at first incomplete group (only on initial load, and only if survey not yet completed)
  const [resumed, setResumed] = useState(false);
  useEffect(() => {
    if (resumed || !profile) return;
    const p = profile as Record<string, unknown>;
    if (p.survey_completed) { setResumed(true); return; }
    // Determine first incomplete group from saved profile fields
    const has = (k: string) => p[k] != null && p[k] !== "";
    const g1Done = has("gender") && has("marital_status") && has("age_range") && has("state_of_residence") && has("address_of_residence");
    const g2Done = has("occupation") && has("accommodation_type");
    const tenant = p.is_current_tenant === true;
    const tenantAnswered = p.is_current_tenant != null;
    const g3Done = tenantAnswered && (!tenant || (has("tenancy_property_type") && has("annual_rent_amount") && has("tenancy_duration") && has("pays_rent_to") && p.tenancy_start_date != null));
    const g4Done = !tenant || (has("rent_payment_ease") && has("pays_on_time") && has("rent_payment_method") && p.sought_rent_help_before != null);
    const g5Done = has("interested_in_platform") && has("acquisition_source") && has("preferred_contact_method") && (p.preferred_contact_method !== "call" || (Array.isArray(p.preferred_contact_windows) && (p.preferred_contact_windows as ContactWindow[]).length > 0));
    let start = 1;
    if (g1Done) start = 2;
    if (g1Done && g2Done) start = 3;
    if (g1Done && g2Done && g3Done) start = tenant ? 4 : 5;
    if (g1Done && g2Done && g3Done && g4Done) start = 5;
    if (g1Done && g2Done && g3Done && g4Done && g5Done) start = 5;
    setGroup(start);
    setResumed(true);
  }, [profile, resumed]);

  const set = (k: string, v: string) => setA((prev) => ({ ...prev, [k]: v }));
  const isTenant = a.q9 === "yes";
  const occupationLower = (a.q6 || "").toLowerCase().trim();
  const showOffice = a.q6 && !NON_WORKING.includes(occupationLower);
  const isResidential = RESIDENTIAL_TYPES.includes(a.q8 || "");

  if (loading) return <AuthShell><p>Loading…</p></AuthShell>;
  if (!user) { navigate("/signin"); return null; }

  const exit = () => navigate(dashboardPathForRole(roles[0]));

  const validateGroup = (g: number): boolean => {
    if (g === 1) {
      if (!a.country || !a.q1 || !a.q3 || !a.q4 || !a.q5) return false;
      if (a.q2 === "other" && !a.q2_other) return false;
      return !!a.q2;
    }
    if (g === 2) {
      if (!a.q6 || !a.q8) return false;
      if (a.q8 === "other" && !a.q8_other) return false;
      if (showOffice && !a.q7) return false;
      if (isResidential && !(a.bedrooms && a.bathrooms && a.toilets)) return false;
      return true;
    }
    if (g === 3) {
      if (!a.q9) return false;
      if (a.q9 === "yes") {
        if (!a.q10 || !a.q11 || !a.q13 || !a.q14) return false;
        if (a.q10 === "other" && !a.q10_other) return false;
        if (a.q14 === "other" && !a.q14_other) return false;
        if (!tenancyStartDate) return false;
      }
      return true;
    }
    if (g === 4) {
      if (!isTenant) return true;
      if (!a.q15 || !a.q16 || !a.q17 || a.q18 === "") return false;
      if (a.q17 === "other" && !a.q17_other) return false;
      return true;
    }
    if (g === 5) {
      if (!a.q19 || !a.q20 || !a.q21 || a.q22 === "") return false;
      if (a.q20 === "other" && !a.q20_other) return false;
      if (a.q21 === "call" && contactWindows.length === 0) return false;
      return true;
    }
    return true;
  };

  const buildPartialPayload = () => {
    const payload: Record<string, unknown> = {};
    if (a.country) payload.country = a.country;
    if (a.q1) payload.gender = a.q1;
    if (a.q2) payload.marital_status = a.q2;
    if (a.q2 === "other") payload.marital_status_other = a.q2_other || null;
    if (a.q3) payload.age_range = a.q3;
    if (a.q4) payload.state_of_residence = a.q4;
    if (a.q5) payload.address_of_residence = a.q5;
    if (residenceCoords) { payload.address_lat = residenceCoords.lat; payload.address_lon = residenceCoords.lon; }
    if (a.q6) payload.occupation = a.q6;
    if (a.q7) payload.office_address = a.q7;
    if (officeCoords) { payload.office_lat = officeCoords.lat; payload.office_lon = officeCoords.lon; }
    if (a.q8) payload.accommodation_type = a.q8;
    if (a.q8 === "other") payload.accommodation_type_other = a.q8_other || null;
    if (isResidential && a.bedrooms) payload.bedrooms = parseInt(a.bedrooms);
    if (isResidential && a.bathrooms) payload.bathrooms = parseInt(a.bathrooms);
    if (isResidential && a.toilets) payload.toilets = parseInt(a.toilets);
    if (a.q9) payload.is_current_tenant = a.q9 === "yes";
    if (a.q10) payload.tenancy_property_type = a.q10;
    if (a.q10 === "other") payload.tenancy_property_type_other = a.q10_other || null;
    if (a.q11) payload.annual_rent_amount = parseFloat(a.q11);
    if (a.q13) payload.tenancy_duration = a.q13;
    if (a.q14) payload.pays_rent_to = a.q14;
    if (a.q14 === "other") payload.pays_rent_to_other = a.q14_other || null;
    if (tenancyStartDate) payload.tenancy_start_date = tenancyStartDate.toISOString().split("T")[0];
    if (tenancyEndDate) payload.tenancy_end_date = tenancyEndDate.toISOString().split("T")[0];
    if (a.q15) payload.rent_payment_ease = parseInt(a.q15);
    if (a.q16) payload.pays_on_time = a.q16;
    if (a.q17) payload.rent_payment_method = a.q17;
    if (a.q17 === "other") payload.rent_payment_method_other = a.q17_other || null;
    if (a.q18) payload.sought_rent_help_before = a.q18 === "yes";
    if (a.q19) payload.interested_in_platform = a.q19;
    if (a.q20) payload.acquisition_source = a.q20;
    if (a.q20 === "other") payload.acquisition_source_other = a.q20_other || null;
    if (a.q21) payload.preferred_contact_method = a.q21;
    if (a.q21 === "call" && contactWindows.length > 0) payload.preferred_contact_windows = JSON.stringify(contactWindows);
    if (a.q22) payload.marketing_consent = a.q22 === "yes";
    return payload;
  };

  const saveProgress = async () => {
    if (!user) return;
    const payload = buildPartialPayload();
    if (Object.keys(payload).length === 0) return;
    const { error } = await supabase.from("profiles").update(payload as never).eq("id", user.id);
    if (error) { console.error("Survey progress save failed", error); return; }
    await refreshProfile();
  };

  const handleSkip = async () => {
    await saveProgress();
    navigate(dashboardPathForRole(roles[0]));
  };

  const next = async () => {
    if (!validateGroup(group)) {
      toast.error("Please answer all questions in this group");
      return;
    }
    await saveProgress();
    let n = group + 1;
    if (n === 4 && !isTenant) n = 5;
    setGroup(Math.min(n, 5));
  };
  const back = () => {
    let n = group - 1;
    if (n === 4 && !isTenant) n = 3;
    setGroup(Math.max(n, 1));
  };

  const submit = async () => {
    if (!validateGroup(5)) {
      toast.error("Please answer all questions");
      return;
    }
    setSubmitting(true);
    try {
      const tags: string[] = [];
      const rentAmount = a.q11 ? parseFloat(a.q11) : 0;
      const ease = parseInt(a.q15 || "0");

      // Updated lead scoring using numeric rent amount
      if (rentAmount >= 1000000 && ease >= 4) tags.push("HIGH_PRIORITY_LOAN_PROSPECT");
      if (a.q17 === "save_up") tags.push("SAVE_FOR_RENT_PROSPECT");
      if (a.q17 === "loan") tags.push("EXISTING_LOAN_BEHAVIOUR");
      if (a.q18 === "yes") tags.push("STRUGGLED_TO_PAY");
      if (a.q9 === "no") tags.push("NON_TENANT");
      if (a.q19 === "yes") tags.push("HIGH_INTENT");

      const { data: updated, error } = await supabase.from("profiles").update({
        survey_completed: true,
        survey_completed_at: new Date().toISOString(),
        country: a.country,
        gender: a.q1,
        marital_status: a.q2,
        marital_status_other: a.q2 === "other" ? a.q2_other || null : null,
        age_range: a.q3,
        state_of_residence: a.q4,
        address_of_residence: a.q5,
        address_lat: residenceCoords?.lat ?? null,
        address_lon: residenceCoords?.lon ?? null,
        occupation: a.q6,
        office_address: a.q7 || null,
        office_lat: officeCoords?.lat ?? null,
        office_lon: officeCoords?.lon ?? null,
        accommodation_type: a.q8,
        accommodation_type_other: a.q8 === "other" ? a.q8_other || null : null,
        bedrooms: isResidential && a.bedrooms ? parseInt(a.bedrooms) : null,
        bathrooms: isResidential && a.bathrooms ? parseInt(a.bathrooms) : null,
        toilets: isResidential && a.toilets ? parseInt(a.toilets) : null,
        is_current_tenant: a.q9 === "yes",
        tenancy_property_type: a.q10 || null,
        tenancy_property_type_other: a.q10 === "other" ? a.q10_other || null : null,
        annual_rent_amount: a.q11 ? parseFloat(a.q11) : null,
        tenancy_duration: a.q13 || null,
        tenancy_start_date: tenancyStartDate ? tenancyStartDate.toISOString().split("T")[0] : null,
        tenancy_end_date: tenancyEndDate ? tenancyEndDate.toISOString().split("T")[0] : null,
        pays_rent_to: a.q14 || null,
        pays_rent_to_other: a.q14 === "other" ? a.q14_other || null : null,
        rent_payment_ease: a.q15 ? parseInt(a.q15) : null,
        pays_on_time: a.q16 || null,
        rent_payment_method: a.q17 || null,
        rent_payment_method_other: a.q17 === "other" ? a.q17_other || null : null,
        sought_rent_help_before: a.q18 ? a.q18 === "yes" : null,
        interested_in_platform: a.q19,
        acquisition_source: a.q20 || null,
        acquisition_source_other: a.q20 === "other" ? a.q20_other || null : null,
        preferred_contact_method: a.q21 || null,
        preferred_contact_windows: a.q21 === "call" && contactWindows.length > 0 ? JSON.stringify(contactWindows) : null,
        marketing_consent: a.q22 === "yes",
      }).eq("id", user.id).select("id");
      if (error) throw error;
      await supabase.rpc("set_my_crm_tags", { _tags: tags });
      if (!updated || updated.length === 0) {
        throw new Error("Could not save your profile. Please sign out and sign in again, then retry.");
      }

      await refreshProfile();
      toast.success(editMode ? "Profile updated" : "Profile complete!", {
        description: editMode ? "Your changes have been saved." : "We have personalised your experience.",
      });
      navigate(dashboardPathForRole(roles[0]));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  // Dropdown helper (replaces radio groups)
  const SEL = (name: string, opts: Opt[], placeholder = "Select an option") => (
    <Select value={a[name] || ""} onValueChange={(v) => set(name, v)}>
      <SelectTrigger className="mt-1"><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>
        {opts.map((o) => <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>)}
      </SelectContent>
    </Select>
  );

  const numberSelect = (name: string, max: number, label: string) => (
    <div>
      <Label>{label}</Label>
      <Select value={a[name] || ""} onValueChange={(v) => set(name, v)}>
        <SelectTrigger className="mt-1"><SelectValue placeholder={`Select ${label.toLowerCase()}`} /></SelectTrigger>
        <SelectContent>
          {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
            <SelectItem key={n} value={String(n)}>
              {n === max ? `${n}+` : n}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <AuthShell step={{ current: group, total: 5 }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {editMode ? "Update your profile" : (
              <>
                {group === 1 && "Personal Background"}
                {group === 2 && "Occupation & Living"}
                {group === 3 && "Tenancy Details"}
                {group === 4 && "Rent Payment Behaviour"}
                {group === 5 && "Interest & Consent"}
              </>
            )}
          </h1>
          {editMode && (
            <p className="text-xs text-muted-foreground mt-1">
              {group === 1 && "Personal Background"}
              {group === 2 && "Occupation & Living"}
              {group === 3 && "Tenancy Details"}
              {group === 4 && "Rent Payment Behaviour"}
              {group === 5 && "Interest & Consent"}
            </p>
          )}
        </div>
        <button onClick={editMode ? exit : handleSkip} className="text-xs text-muted-foreground hover:text-foreground whitespace-nowrap">
          {editMode ? "Cancel" : "Skip for now"}
        </button>
      </div>

      <div className="mt-5 bg-card border rounded-xl p-6 space-y-5">
        {group === 1 && (
          <>
            <div><Label>Gender</Label>{SEL("q1", [{v:"female",l:"Female"},{v:"male",l:"Male"}], "Select gender")}</div>
            <div><Label>Marital Status</Label>{SEL("q2", [{v:"married",l:"Married"},{v:"single",l:"Single"},{v:"divorced",l:"Divorced"},{v:"widowed",l:"Widowed"},{v:"other",l:"Other"}], "Select marital status")}
            {a.q2 === "other" && <OtherInput name="q2" value={a.q2_other||""} onChange={(v)=>set("q2_other",v)} />}
            </div>
            <div><Label>Age</Label>{SEL("q3", [
              {v:"18-30",l:"18–30"},{v:"31-45",l:"31–45"},{v:"46-55",l:"46–55"},
              {v:"56-65",l:"56–65"},{v:"65+",l:"65 and above"},
            ], "Select age range")}</div>
            <div>
              <Label>Country</Label>
              <Select value={a.country || "NG"} onValueChange={(v) => set("country", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code} disabled={!c.live}>
                      {c.name}{!c.live && " — Coming soon"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>State of Residence</Label>
              <Select value={a.q4 || ""} onValueChange={(v) => set("q4", v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>
                  {NIGERIAN_STATES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="q5">Address of Residence</Label>
              <AddressAutocomplete
                id="q5"
                value={a.q5 || ""}
                onChange={(v, coords) => { set("q5", v); if (coords) setResidenceCoords(coords); }}
                placeholder="e.g. 12 Adeola Odeku Street, Victoria Island, Lagos"
              />
            </div>
          </>
        )}
        {group === 2 && (
          <>
            <div><Label htmlFor="q6">Occupation</Label><Input id="q6" value={a.q6||""} onChange={(e)=>set("q6",e.target.value)} className="mt-1" /></div>
            {showOffice && (
              <div>
                <Label htmlFor="q7">Office Address</Label>
                <AddressAutocomplete
                  id="q7"
                  value={a.q7 || ""}
                  onChange={(v, coords) => { set("q7", v); if (coords) setOfficeCoords(coords); }}
                  placeholder="Start typing your office address…"
                />
              </div>
            )}
            <div>
              <Label>Accommodation Type</Label>
              {SEL("q8", [
                {v:"tenement",l:"Tenement (Face-Me-I-Face-You)"},{v:"flat",l:"Flat"},{v:"bungalow",l:"Bungalow"},
                {v:"duplex",l:"Duplex"},{v:"office",l:"Office Space"},{v:"shop",l:"Shop or Store"},
                {v:"warehouse",l:"Warehouse"},{v:"other",l:"Other"},
              ], "Select accommodation type")}
              {a.q8 === "other" && <OtherInput name="q8" value={a.q8_other||""} onChange={(v)=>set("q8_other",v)} />}
            </div>
            {isResidential && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {numberSelect("bedrooms", 7, "Bedrooms")}
                {numberSelect("bathrooms", 6, "Bathrooms")}
                {numberSelect("toilets", 6, "Toilets")}
              </div>
            )}
          </>
        )}
        {group === 3 && (
          <>
            <div><Label>Are you currently a tenant?</Label>{SEL("q9",[{v:"yes",l:"Yes"},{v:"no",l:"No"}], "Select an option")}</div>
            {isTenant && <>
              <div><Label>Property type rented</Label>{SEL("q10",[
                {v:"residential",l:"Residential"},{v:"commercial",l:"Commercial"},
                {v:"warehousing",l:"Warehousing"},{v:"industrial",l:"Industrial"},{v:"multi",l:"More than one"},{v:"other",l:"Other"},
              ], "Select property type")}
              {a.q10 === "other" && <OtherInput name="q10" value={a.q10_other||""} onChange={(v)=>set("q10_other",v)} />}
              </div>
              <div><Label>Annual Rent (NGN)</Label>
              <Input type="number" id="q11" value={a.q11||""} onChange={(e)=>set("q11",e.target.value)} placeholder="e.g. 1500000" className="mt-1" min="1" />
              {a.q11 && <p className="text-xs text-muted-foreground mt-1">₦{parseInt(a.q11).toLocaleString("en-NG")}</p>}
              </div>
              <div><Label>Tenancy Agreement Duration</Label>{SEL("q13",[
                {v:"monthly",l:"Monthly"},{v:"quarterly",l:"Quarterly (3 months)"},{v:"biannually",l:"Bi-annually (6 months)"},{v:"annually",l:"Annually (12 months)"},{v:"other",l:"Other duration"},
              ], "Select duration")}</div>
              {a.q13 && <TenancyDatePicker 
                startDate={tenancyStartDate} 
                endDate={tenancyEndDate}
                onStartDateChange={setTenancyStartDate}
                onEndDateChange={setTenancyEndDate}
                duration={a.q13 as any}
              />}
              <div><Label>Who do you pay rent to?</Label>{SEL("q14",[
                {v:"landlord",l:"Landlord directly"},{v:"agent",l:"Estate Agent"},{v:"other",l:"Other"},
              ], "Select recipient")}
              {a.q14 === "other" && <OtherInput name="q14" value={a.q14_other||""} onChange={(v)=>set("q14_other",v)} />}
              </div>
            </>}
          </>
        )}
        {group === 4 && isTenant && (
          <>
            <div><Label>Rent payment ease</Label>{SEL("q15",[
              {v:"1",l:"1 — Very Easy"},{v:"2",l:"2 — Easy"},{v:"3",l:"3 — Neutral"},{v:"4",l:"4 — Difficult"},{v:"5",l:"5 — Not Easy"},
            ], "Rate from 1 to 5")}</div>
            <div><Label>Pay on/before due date?</Label>{SEL("q16",[{v:"always",l:"Always"},{v:"sometimes",l:"Sometimes"},{v:"never",l:"Never"}], "Select an option")}</div>
            <div><Label>How do you currently pay rent?</Label>{SEL("q17",[
              {v:"save_up",l:"I save up gradually"},{v:"loan",l:"I take a loan"},
              {v:"advance",l:"Advance from work"},{v:"lump",l:"Wait for a lump sum"},{v:"other",l:"Other"},
            ], "Select payment method")}
            {a.q17 === "other" && <OtherInput name="q17" value={a.q17_other||""} onChange={(v)=>set("q17_other",v)} />}
            </div>
            <div><Label>Sought help to pay rent before?</Label>{SEL("q18",[{v:"yes",l:"Yes"},{v:"no",l:"No"}], "Select an option")}</div>
          </>
        )}
        {group === 5 && (
          <>
            <div><Label>Would you explore an online rent solution?</Label>{SEL("q19",[{v:"yes",l:"Yes"},{v:"no",l:"No"},{v:"maybe",l:"Maybe"}], "Select an option")}</div>
            <div><Label>How did you hear about Renteaze?</Label>
              {SEL("q20",[
                {v:"social",l:"Social Media"},{v:"friend",l:"Referred by a friend"},{v:"agent",l:"Referred by an agent/professional"},
                {v:"search",l:"Search engine"},{v:"event",l:"Event or seminar"},{v:"ad",l:"Advertisement"},{v:"other",l:"Other"},
              ], "Choose source")}
              {a.q20 === "other" && <OtherInput name="q20" value={a.q20_other||""} onChange={(v)=>set("q20_other",v)} />}
            </div>
            <div><Label>Preferred Contact Method</Label>{SEL("q21",[{v:"whatsapp",l:"WhatsApp"},{v:"call",l:"Call"}], "Select contact method")}</div>
            {a.q21 === "call" && (
              <ContactWindowsPicker windows={contactWindows} onChange={setContactWindows} />
            )}
            <div><Label>Happy to be contacted about relevant products?</Label>{SEL("q22",[{v:"yes",l:"Yes"},{v:"no",l:"No"}], "Select an option")}</div>
          </>
        )}

        <div className="flex justify-between pt-2">
          <Button variant="outline" onClick={back} disabled={group === 1}>Back</Button>
          {group < 5
            ? <Button onClick={next} className="bg-primary text-primary-foreground">Next</Button>
            : <Button onClick={submit} disabled={submitting} className="bg-accent text-accent-foreground">
                {submitting ? "Saving..." : editMode ? "Save Changes" : "Complete My Profile"}
              </Button>}
        </div>
      </div>
    </AuthShell>
  );
};

export default Survey;
