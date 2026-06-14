// verify-nin edge function
//
// Validates the user's NIN/BVN submission and stores the supplied details on
// their profile. Auto-approval of KYC is GATED behind explicit configuration
// so that no user can be marked as `nin_verified` / `kyc_completed` without
// either (a) a real third-party verification API or (b) an admin manually
// flipping the feature flag in Supabase secrets.
//
// Behaviour:
//   - Always: persist nin/bvn/account/bank/dob to the profile and set
//     kyc_status = 'pending' so an admin can review.
//   - If KYC_AUTO_APPROVE_ENABLED === 'true' AND a real provider is wired in
//     (TODO: Prembly / Dojah / Smile Identity): mark verified.
//
// This prevents the previous bypass where any 11-digit NIN granted full KYC.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // ---- Authenticate caller ----
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return json({ verified: false, error: "Missing auth token" }, 401);

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const AUTO_APPROVE = Deno.env.get("KYC_AUTO_APPROVE_ENABLED") === "true";

    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return json({ verified: false, error: "Invalid session" }, 401);
    }
    const userId = userData.user.id;

    // ---- Validate input ----
    const body = await req.json().catch(() => ({}));
    const nin = typeof body.nin === "string" ? body.nin.trim() : "";
    const bvn = typeof body.bvn === "string" ? body.bvn.trim() : "";
    const account = typeof body.account === "string" ? body.account.trim() : "";
    const bank = typeof body.bank === "string" ? body.bank.trim() : "";
    const dob = typeof body.dob === "string" ? body.dob.trim() : "";

    if (!/^\d{11}$/.test(nin)) return json({ verified: false, error: "NIN must be 11 digits" });
    if (!/^\d{11}$/.test(bvn)) return json({ verified: false, error: "BVN must be 11 digits" });
    if (!/^\d{10}$/.test(account)) return json({ verified: false, error: "Account number must be 10 digits" });
    if (!bank) return json({ verified: false, error: "Bank is required" });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return json({ verified: false, error: "Invalid date of birth" });

    // ---- Real identity verification ----
    // TODO: integrate Prembly / Dojah / Smile Identity here. Until then, the
    // submission is queued for manual admin review and is NEVER auto-approved
    // from format alone — even if the feature flag is enabled.
    const providerVerified = false; // flip to true only when a real provider responds OK
    const shouldAutoApprove = AUTO_APPROVE && providerVerified;

    // ---- Privileged update via service role ----
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { error: upErr } = await admin
      .from("profiles")
      .update({
        nin,
        bvn,
        bank_account_number: account,
        bank_name: bank,
        dob,
        nin_verified: shouldAutoApprove,
        kyc_completed: shouldAutoApprove,
        kyc_status: shouldAutoApprove ? "verified" : "pending",
      })
      .eq("id", userId);

    if (upErr) return json({ verified: false, error: "Profile update failed" }, 500);

    if (shouldAutoApprove) {
      return json({ verified: true, status: "verified" });
    }
    return json({
      verified: false,
      status: "pending",
      message:
        "Your identity details have been submitted and are awaiting review. You'll be notified once verification is complete.",
    });
  } catch (e) {
    return json({ verified: false, error: (e as Error).message }, 500);
  }
});
