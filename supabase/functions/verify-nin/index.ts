// verify-nin edge function
// Validates the user's NIN (DEV STUB: 11-digit check) and, on success,
// performs the privileged profile update (kyc_status, nin_verified, etc.)
// using the service-role client. This keeps users from self-approving KYC.

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

    // TODO: integrate Prembly / Dojah NIN verification API. For MVP we accept
    // a well-formed NIN as verified.
    const verified = true;

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
        nin_verified: verified,
        kyc_completed: verified,
        kyc_status: verified ? "verified" : "pending",
      })
      .eq("id", userId);

    if (upErr) return json({ verified: false, error: "Profile update failed" }, 500);

    return json({ verified, name: "Verified User" });
  } catch (e) {
    return json({ verified: false, error: (e as Error).message }, 500);
  }
});
