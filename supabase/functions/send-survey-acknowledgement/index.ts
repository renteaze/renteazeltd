// send-survey-acknowledgement
// Admin-only. Sends a "we've received and reviewed your survey" email to a user
// via Brevo, drops an in-app notification, and stamps survey_acknowledged_at /
// survey_acknowledged_by on the profile. Idempotent.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    if (!BREVO_API_KEY) return json({ ok: false, error: "BREVO_API_KEY not configured" }, 500);

    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return json({ ok: false, error: "Missing auth token" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: userData, error: uErr } = await userClient.auth.getUser();
    if (uErr || !userData.user) return json({ ok: false, error: "Invalid session" }, 401);
    const callerId = userData.user.id;

    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", callerId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) return json({ ok: false, error: "Admin only" }, 403);

    let body: { user_id?: string } = {};
    try {
      const text = await req.text();
      if (text.trim()) body = JSON.parse(text);
    } catch { /* ignore */ }
    if (!body.user_id) return json({ ok: false, error: "user_id required" }, 400);

    const { data: profile, error: pErr } = await admin
      .from("profiles")
      .select("id,email,first_name,full_name,preferred_contact_method,survey_completed,survey_acknowledged_at")
      .eq("id", body.user_id)
      .single();
    if (pErr || !profile) return json({ ok: false, error: "User not found" }, 404);

    const p = profile as Record<string, unknown>;
    if (!p.survey_completed) return json({ ok: false, error: "User has not completed survey" }, 400);
    if (p.survey_acknowledged_at) {
      return json({ ok: true, skipped: true, reason: "already_acknowledged" });
    }
    const email = p.email as string | null;
    if (!email) return json({ ok: false, error: "User has no email" }, 400);

    const firstName = (p.first_name as string) || (p.full_name as string)?.split(" ")[0] || "there";
    const contactMethod =
      typeof p.preferred_contact_method === "string" && p.preferred_contact_method
        ? p.preferred_contact_method
        : "your preferred contact method";

    const html = `
<!doctype html>
<html><body style="margin:0;background:#f6f6f8;font-family:Arial,Helvetica,sans-serif;color:#1a1a1f;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:#d4af1a;height:8px;"></div>
    <div style="padding:32px 32px 8px;">
      <div style="font-size:18px;font-weight:bold;color:#d4af1a;letter-spacing:1px;">RENTEAZE</div>
    </div>
    <div style="padding:8px 32px 32px;">
      <h1 style="font-size:22px;margin:16px 0 12px;">Thank you, ${firstName} — your survey has been reviewed.</h1>
      <p style="font-size:14px;line-height:1.6;color:#3a3a42;margin:0 0 16px;">
        Our team has finished reviewing the responses you submitted. A Renteaze representative will
        be in touch with you shortly via <strong>${contactMethod}</strong> to discuss the next steps.
      </p>
      <p style="font-size:14px;line-height:1.6;color:#3a3a42;margin:0 0 24px;">
        We appreciate the time you took to share your details with us.
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
        to: [{ email, name: firstName }],
        subject: "Your Renteaze survey has been reviewed",
        htmlContent: html,
      }),
    });

    if (!brevoRes.ok) {
      const errText = await brevoRes.text();
      console.error("Brevo send failed", brevoRes.status, errText);
      return json({ ok: false, error: `Brevo ${brevoRes.status}: ${errText}` }, 502);
    }

    const nowIso = new Date().toISOString();

    const { error: stampErr } = await admin
      .from("profiles")
      .update({ survey_acknowledged_at: nowIso, survey_acknowledged_by: callerId })
      .eq("id", body.user_id);
    if (stampErr) console.error("stamp failed", stampErr);

    const { error: notifErr } = await admin.from("notifications").insert({
      user_id: body.user_id,
      type: "survey_acknowledged",
      title: "Your survey has been reviewed",
      body: `A Renteaze representative will reach out to you shortly via ${contactMethod}.`,
      link: "/dashboard",
    });
    if (notifErr) console.error("notification insert failed", notifErr);

    return json({ ok: true, acknowledged_at: nowIso });
  } catch (e) {
    console.error(e);
    return json({ ok: false, error: (e as Error).message }, 500);
  }
});
