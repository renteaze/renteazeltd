// One-shot admin function to (a) ensure `partner-logos` public bucket exists
// and (b) upload a single file (base64) into it. Service-role only.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Ensure bucket exists & is public
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find((b) => b.name === "partner-logos")) {
    const { error } = await supabase.storage.createBucket("partner-logos", {
      public: true,
    });
    if (error && !error.message.includes("already exists")) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500, headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }
  } else {
    await supabase.storage.updateBucket("partner-logos", { public: true });
  }

  let body: { filename?: string; contentType?: string; base64?: string };
  try { body = await req.json(); } catch { body = {}; }

  if (!body.filename || !body.base64) {
    return new Response(JSON.stringify({ ok: true, message: "bucket ready" }), {
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }

  const bytes = Uint8Array.from(atob(body.base64), (c) => c.charCodeAt(0));
  const { error: upErr } = await supabase.storage
    .from("partner-logos")
    .upload(body.filename, bytes, {
      contentType: body.contentType ?? "application/octet-stream",
      upsert: true,
    });

  if (upErr) {
    return new Response(JSON.stringify({ error: upErr.message }), {
      status: 500, headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }

  const { data: pub } = supabase.storage.from("partner-logos").getPublicUrl(body.filename);
  return new Response(JSON.stringify({ ok: true, url: pub.publicUrl }), {
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
});
