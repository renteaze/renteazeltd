// send-survey-email
// Sends a one-time "we've received your survey" email via Brevo with a
// branded PDF of the user's survey answers attached. Idempotent: once
// profiles.survey_email_sent_at is set, further invocations are no-ops.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BREVO_SENDER_EMAIL = "admin@renteaze.com";
const BREVO_SENDER_NAME = "Renteaze";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

type Row = { label: string; value: string };

const yesNo = (v: unknown) =>
  v === true ? "Yes" : v === false ? "No" : "—";
const txt = (v: unknown) =>
  v === null || v === undefined || v === "" ? "—" : String(v);
const money = (v: unknown) => {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  if (!isFinite(n) || n <= 0) return "—";
  return "₦" + n.toLocaleString("en-NG");
};

function withOther(value: unknown, other: unknown) {
  const v = txt(value);
  if (v !== "—" && String(value).toLowerCase() === "other" && txt(other) !== "—") {
    return `Other — ${other}`;
  }
  return v;
}

function buildSections(p: Record<string, unknown>) {
  return [
    {
      title: "Personal Information",
      rows: [
        { label: "Full name", value: txt(p.full_name) },
        { label: "Email", value: txt(p.email) },
        { label: "Phone", value: txt(p.phone) },
        { label: "Gender", value: txt(p.gender) },
        { label: "Marital status", value: withOther(p.marital_status, p.marital_status_other) },
        { label: "Age range", value: txt(p.age_range) },
        { label: "State of residence", value: txt(p.state_of_residence) },
        { label: "Residence address", value: txt(p.address_of_residence) },
        { label: "Occupation", value: txt(p.occupation) },
        { label: "Office address", value: txt(p.office_address) },
      ] as Row[],
    },
    {
      title: "Housing",
      rows: [
        { label: "Accommodation type", value: withOther(p.accommodation_type, p.accommodation_type_other) },
        { label: "Bedrooms", value: txt(p.bedrooms) },
        { label: "Bathrooms", value: txt(p.bathrooms) },
        { label: "Toilets", value: txt(p.toilets) },
        { label: "Currently a tenant?", value: yesNo(p.is_current_tenant) },
        { label: "Tenancy property type", value: withOther(p.tenancy_property_type, p.tenancy_property_type_other) },
        { label: "Annual rent", value: money(p.annual_rent_amount) },
        { label: "Tenancy duration", value: txt(p.tenancy_duration) },
        { label: "Tenancy start", value: txt(p.tenancy_start_date) },
        { label: "Tenancy end", value: txt(p.tenancy_end_date) },
        { label: "Pays rent to", value: withOther(p.pays_rent_to, p.pays_rent_to_other) },
        { label: "Rent payment ease (1–5)", value: txt(p.rent_payment_ease) },
        { label: "Pays on/before due date", value: txt(p.pays_on_time) },
        { label: "Rent payment method", value: withOther(p.rent_payment_method, p.rent_payment_method_other) },
      ] as Row[],
    },
    {
      title: "Goals & Interest",
      rows: [
        { label: "Sought rent help before", value: yesNo(p.sought_rent_help_before) },
        { label: "Would explore online rent solution", value: txt(p.interested_in_platform) },
      ] as Row[],
    },
    {
      title: "Referral",
      rows: [
        { label: "How they heard about us", value: withOther(p.acquisition_source, p.acquisition_source_other) },
      ] as Row[],
    },
    {
      title: "Contact Preference",
      rows: [
        { label: "Preferred contact method", value: txt(p.preferred_contact_method) },
        { label: "Preferred contact windows", value: txt(p.preferred_contact_windows) },
        { label: "Marketing consent", value: yesNo(p.marketing_consent) },
      ] as Row[],
    },
  ];
}

async function buildPdf(profile: Record<string, unknown>): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const brand = rgb(0.83, 0.69, 0.10); // Renteaze gold
  const ink = rgb(0.1, 0.1, 0.12);
  const muted = rgb(0.4, 0.4, 0.45);
  const rule = rgb(0.85, 0.85, 0.88);

  const pageWidth = 595.28; // A4
  const pageHeight = 841.89;
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;

  let page = pdf.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  const newPage = () => {
    page = pdf.addPage([pageWidth, pageHeight]);
    y = pageHeight - margin;
    drawHeader();
  };

  const drawHeader = () => {
    page.drawRectangle({ x: 0, y: pageHeight - 8, width: pageWidth, height: 8, color: brand });
    page.drawText("RENTEAZE", { x: margin, y: y - 4, size: 16, font: bold, color: brand });
    page.drawText("Survey Submission", { x: margin, y: y - 22, size: 10, font, color: muted });
    y -= 50;
  };

  const ensure = (needed: number) => { if (y - needed < margin) newPage(); };

  drawHeader();

  // Title
  page.drawText("Survey Response Summary", { x: margin, y, size: 18, font: bold, color: ink });
  y -= 22;
  page.drawText(
    `Generated ${new Date().toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}`,
    { x: margin, y, size: 9, font, color: muted },
  );
  y -= 18;
  page.drawLine({ start: { x: margin, y }, end: { x: margin + contentWidth, y }, thickness: 0.5, color: rule });
  y -= 18;

  const sections = buildSections(profile);

  // Simple wrap helper
  const wrap = (text: string, size: number, f = font, maxWidth = contentWidth - 160) => {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let cur = "";
    for (const w of words) {
      const test = cur ? cur + " " + w : w;
      if (f.widthOfTextAtSize(test, size) > maxWidth) {
        if (cur) lines.push(cur);
        cur = w;
      } else cur = test;
    }
    if (cur) lines.push(cur);
    return lines.length ? lines : [""];
  };

  for (const section of sections) {
    ensure(40);
    page.drawText(section.title.toUpperCase(), { x: margin, y, size: 10, font: bold, color: brand });
    y -= 6;
    page.drawLine({ start: { x: margin, y }, end: { x: margin + 60, y }, thickness: 1.2, color: brand });
    y -= 16;

    for (const row of section.rows) {
      const lines = wrap(row.value, 10);
      const rowH = Math.max(16, lines.length * 13 + 4);
      ensure(rowH);
      page.drawText(row.label, { x: margin, y, size: 9, font: bold, color: ink });
      let ly = y;
      for (const ln of lines) {
        page.drawText(ln, { x: margin + 160, y: ly, size: 10, font, color: ink });
        ly -= 13;
      }
      y -= rowH;
    }
    y -= 10;
  }

  // Footer on every page
  const pages = pdf.getPages();
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    p.drawText(
      "Renteaze is a PropTech company and not a licensed financial institution.",
      { x: margin, y: 32, size: 8, font, color: muted },
    );
    p.drawText("Renteaze™ — All rights reserved.", { x: margin, y: 20, size: 8, font, color: muted });
    p.drawText(`Page ${i + 1} of ${pages.length}`, {
      x: pageWidth - margin - 70,
      y: 20,
      size: 8,
      font,
      color: muted,
    });
  }

  return await pdf.save();
}

function toBase64(bytes: Uint8Array): string {
  let s = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    s += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(s);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return json({ sent: false, error: "Missing auth token" }, 401);

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    if (!BREVO_API_KEY) return json({ sent: false, error: "BREVO_API_KEY not configured" }, 500);

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ sent: false, error: "Invalid session" }, 401);
    const userId = userData.user.id;

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: profile, error: profErr } = await admin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (profErr || !profile) return json({ sent: false, error: "Profile not found" }, 404);

    if (profile.survey_email_sent_at) {
      return json({ sent: false, skipped: true, reason: "already_sent" });
    }
    if (!profile.email) return json({ sent: false, error: "Profile has no email" }, 400);

    const pdfBytes = await buildPdf(profile as Record<string, unknown>);
    const pdfBase64 = toBase64(pdfBytes);
    const today = new Date().toISOString().slice(0, 10);
    const fileName = `Renteaze-Survey-${today}.pdf`;

    const contactMethod =
      typeof profile.preferred_contact_method === "string" && profile.preferred_contact_method
        ? profile.preferred_contact_method.toLowerCase()
        : "your preferred contact method";

    const displayName = (profile.full_name as string) || (profile.first_name as string) || "there";

    const htmlContent = `
<!doctype html>
<html><body style="margin:0;background:#f6f6f8;font-family:Arial,Helvetica,sans-serif;color:#1a1a1f;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:#d4af1a;height:8px;"></div>
    <div style="padding:32px 32px 8px;">
      <div style="font-size:18px;font-weight:bold;color:#d4af1a;letter-spacing:1px;">RENTEAZE</div>
    </div>
    <div style="padding:8px 32px 32px;">
      <h1 style="font-size:22px;margin:16px 0 12px;">We've received your survey, ${displayName}.</h1>
      <p style="font-size:14px;line-height:1.6;color:#3a3a42;margin:0 0 16px;">
        Thanks for taking the time to share your details with us. Your submission is now <strong>under review</strong>.
      </p>
      <p style="font-size:14px;line-height:1.6;color:#3a3a42;margin:0 0 16px;">
        A Renteaze representative will reach out to you via <strong>${contactMethod}</strong> once the review is complete.
        A copy of the responses you submitted is attached to this email for your records.
      </p>
      <p style="font-size:14px;line-height:1.6;color:#3a3a42;margin:0 0 24px;">
        Warm regards,<br/>The Renteaze Team
      </p>
      <hr style="border:none;border-top:1px solid #e5e5ea;margin:24px 0;" />
      <p style="font-size:11px;color:#7a7a82;line-height:1.5;margin:0 0 6px;">
        Renteaze is a PropTech company and not a licensed financial institution.
      </p>
      <p style="font-size:11px;color:#7a7a82;line-height:1.5;margin:0;">
        Renteaze&trade; — All rights reserved.
      </p>
    </div>
  </div>
</body></html>`.trim();

    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
        to: [{ email: profile.email, name: displayName }],
        subject: "We've received your Renteaze survey — review in progress",
        htmlContent,
        attachment: [{ name: fileName, content: pdfBase64 }],
      }),
    });

    if (!brevoRes.ok) {
      const errText = await brevoRes.text();
      console.error("Brevo send failed", brevoRes.status, errText);
      return json({ sent: false, error: `Brevo ${brevoRes.status}: ${errText}` }, 502);
    }

    const sentAt = new Date().toISOString();
    const { error: stampErr } = await admin
      .from("profiles")
      .update({ survey_email_sent_at: sentAt })
      .eq("id", userId);
    if (stampErr) console.error("Failed to set survey_email_sent_at", stampErr);

    return json({ sent: true, sent_at: sentAt });
  } catch (e) {
    console.error(e);
    return json({ sent: false, error: (e as Error).message }, 500);
  }
});