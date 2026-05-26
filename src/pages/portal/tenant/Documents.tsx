import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Clock, FileText, Loader2, Upload, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import PortalShell from "@/components/portal/PortalShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/format";

type DocType = "government_id" | "proof_of_income" | "tenancy_agreement" | "utility_bill";

const REQUIRED: { id: DocType; label: string; hint: string }[] = [
  { id: "government_id", label: "Government ID", hint: "NIN slip, voter card, driver's licence, or passport" },
  { id: "proof_of_income", label: "Proof of Income", hint: "Last 3 payslips or 6-month bank statement" },
  { id: "tenancy_agreement", label: "Tenancy Agreement", hint: "Current or most recent tenancy agreement" },
  { id: "utility_bill", label: "Utility Bill", hint: "PHCN, water, or waste bill (last 3 months)" },
];

interface Doc {
  id: string;
  document_type: string;
  file_url: string;
  file_path: string;
  file_name: string;
  status: "pending" | "verified" | "rejected";
  rejection_reason: string | null;
  created_at: string;
}

const Documents = () => {
  const { user } = useAuth();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<DocType | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (user) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function load() {
    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("owner_id", user!.id)
      .order("created_at", { ascending: false });
    setDocs((data as Doc[]) ?? []);
    setLoading(false);
  }

  async function upload(type: DocType, file: File) {
    if (!user) return;
    if (file.size > 10 * 1024 * 1024) return toast.error("File too large (max 10 MB)");
    setUploading(type);
    const path = `${user.id}/${type}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("tenant-documents").upload(path, file, {
      upsert: false, contentType: file.type,
    });
    if (upErr) {
      setUploading(null);
      return toast.error(upErr.message);
    }
    const { data: { publicUrl } } = supabase.storage.from("tenant-documents").getPublicUrl(path);
    const { error: insErr } = await supabase.from("documents").insert({
      owner_id: user.id,
      document_type: type,
      file_url: publicUrl,
      file_path: path,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      status: "pending",
    });
    setUploading(null);
    if (insErr) return toast.error(insErr.message);
    toast.success("Document uploaded — pending review");
    await load();
  }

  async function remove(d: Doc) {
    if (d.status !== "pending") return;
    await supabase.storage.from("tenant-documents").remove([d.file_path]);
    await supabase.from("documents").delete().eq("id", d.id);
    toast.success("Removed");
    await load();
  }

  const latest = (type: string) => docs.find((d) => d.document_type === type);

  return (
    <PortalShell role="tenant">
      <h1 className="text-2xl font-bold">My Documents</h1>
      <p className="text-sm text-muted-foreground mb-6">Upload required documents so we can process your applications faster.</p>

      {loading ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REQUIRED.map((r) => {
              const d = latest(r.id);
              const status = d?.status ?? "missing";
              const color =
                status === "verified" ? "border-success/40 bg-success/5"
                : status === "pending" ? "border-accent/40 bg-accent/5"
                : status === "rejected" ? "border-destructive/40 bg-destructive/5"
                : "border-border";
              return (
                <div key={r.id} className={`bg-card border rounded-xl p-5 ${color}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{r.label}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{r.hint}</p>
                    </div>
                    <StatusBadge status={status} />
                  </div>

                  {d && (
                    <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                      <FileText className="h-3 w-3" />
                      <a href={d.file_url} target="_blank" rel="noreferrer" className="underline truncate">{d.file_name}</a>
                      <span>· {formatDate(d.created_at)}</span>
                    </div>
                  )}
                  {d?.status === "rejected" && d.rejection_reason && (
                    <p className="mt-2 text-xs text-destructive">{d.rejection_reason}</p>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <input
                      ref={(el) => { fileRefs.current[r.id] = el; }}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void upload(r.id, f);
                        e.target.value = "";
                      }}
                    />
                    <Button
                      size="sm" variant="outline"
                      onClick={() => fileRefs.current[r.id]?.click()}
                      disabled={uploading === r.id}
                    >
                      {uploading === r.id ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Upload className="h-3 w-3 mr-1" />}
                      {d ? "Replace" : "Upload"}
                    </Button>
                    {d?.status === "pending" && (
                      <Button size="sm" variant="ghost" onClick={() => remove(d)}>
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* All docs table */}
          {docs.length > 0 && (
            <div className="mt-8 bg-card border rounded-xl overflow-hidden">
              <h2 className="font-semibold p-4 border-b">All uploaded documents</h2>
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">File</th>
                    <th className="px-4 py-2">Uploaded</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((d) => (
                    <tr key={d.id} className="border-t">
                      <td className="px-4 py-2 capitalize">{d.document_type.replace(/_/g, " ")}</td>
                      <td className="px-4 py-2"><a href={d.file_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">{d.file_name}</a></td>
                      <td className="px-4 py-2">{formatDate(d.created_at)}</td>
                      <td className="px-4 py-2"><StatusBadge status={d.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </PortalShell>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
    verified: { label: "Verified", cls: "bg-success/10 text-success", icon: CheckCircle2 },
    pending: { label: "Pending", cls: "bg-accent/15 text-foreground", icon: Clock },
    rejected: { label: "Rejected", cls: "bg-destructive/10 text-destructive", icon: AlertCircle },
    missing: { label: "Not uploaded", cls: "bg-muted text-muted-foreground", icon: Upload },
  };
  const m = map[status] ?? map.missing;
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${m.cls}`}>
      <Icon className="h-3 w-3" /> {m.label}
    </span>
  );
};

export default Documents;
