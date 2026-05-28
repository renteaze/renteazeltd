import { useState } from "react";
import { Loader2, Mail, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import PortalShell from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type ResultRow = {
  user_id: string;
  sent?: boolean;
  sent_at?: string;
  recipient?: string;
  error?: string;
  status?: number;
};

type BackfillResponse = {
  backfill?: boolean;
  count?: number;
  results?: ResultRow[];
  error?: string;
};

const EmailBackfill = () => {
  const { roles } = useAuth();
  const role = roles.includes("admin") ? "admin" : "staff";
  const [running, setRunning] = useState(false);
  const [response, setResponse] = useState<BackfillResponse | null>(null);
  const [ranAt, setRanAt] = useState<string | null>(null);

  const run = async () => {
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke<BackfillResponse>(
        "send-survey-email",
        { body: { backfill: true } },
      );
      if (error) throw error;
      setResponse(data ?? null);
      setRanAt(new Date().toISOString());
      const results = data?.results ?? [];
      const sent = results.filter((r) => r.sent).length;
      const failed = results.filter((r) => !r.sent).length;
      toast.success(`Backfill complete — ${sent} sent, ${failed} failed (${results.length} total)`);
    } catch (e) {
      const msg = (e as Error).message || "Backfill failed";
      toast.error(msg);
      setResponse({ error: msg });
    } finally {
      setRunning(false);
    }
  };

  const results = response?.results ?? [];
  const sentCount = results.filter((r) => r.sent).length;
  const failedCount = results.filter((r) => !r.sent).length;

  return (
    <PortalShell role={role}>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            Survey Email Backfill
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            Sends the welcome / survey-receipt email (with PDF attachment) to every user who
            completed the survey but has no <code>survey_email_sent_at</code>. Idempotent — safe
            to re-run.
          </p>
        </div>
        <Button onClick={run} disabled={running} size="lg">
          {running ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Running…
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Run backfill now
            </>
          )}
        </Button>
      </div>

      {response && !response.error && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Stat label="Processed" value={response.count ?? results.length} />
          <Stat label="Sent" value={sentCount} tone="success" />
          <Stat label="Failed" value={failedCount} tone={failedCount > 0 ? "danger" : "muted"} />
        </div>
      )}

      {response?.error && (
        <div className="bg-destructive/10 border border-destructive/40 text-destructive rounded-lg p-4 mb-6 text-sm">
          {response.error}
        </div>
      )}

      {ranAt && (
        <p className="text-xs text-muted-foreground mb-3">
          Last run: {new Date(ranAt).toLocaleString()}
        </p>
      )}

      {results.length > 0 && (
        <div className="border rounded-xl overflow-hidden bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">User ID</th>
                <th className="text-left px-4 py-3">Recipient</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Sent at</th>
                <th className="text-left px-4 py-3">Error</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={r.user_id + i} className="border-t">
                  <td className="px-4 py-3 font-mono text-xs">{r.user_id.slice(0, 8)}…</td>
                  <td className="px-4 py-3">{r.recipient ?? "—"}</td>
                  <td className="px-4 py-3">
                    {r.sent ? (
                      <Badge className="bg-green-600 hover:bg-green-600">Sent</Badge>
                    ) : (
                      <Badge variant="destructive">Failed</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {r.sent_at ? new Date(r.sent_at).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-destructive max-w-md truncate" title={r.error}>
                    {r.error ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {response && results.length === 0 && !response.error && (
        <div className="text-sm text-muted-foreground bg-muted/30 border rounded-lg p-6 text-center">
          No pending users — every completed survey has already been emailed.
        </div>
      )}
    </PortalShell>
  );
};

const Stat = ({
  label,
  value,
  tone = "muted",
}: {
  label: string;
  value: number;
  tone?: "success" | "danger" | "muted";
}) => {
  const color =
    tone === "success" ? "text-green-600" : tone === "danger" ? "text-destructive" : "text-foreground";
  return (
    <div className="bg-card border rounded-xl p-5">
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
};

export default EmailBackfill;