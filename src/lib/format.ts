export const formatNGN = (n: number | string | null | undefined): string => {
  const v = typeof n === "string" ? Number(n) : n ?? 0;
  if (!Number.isFinite(v)) return "₦0";
  return "₦" + Number(v).toLocaleString("en-NG", { maximumFractionDigits: 0 });
};

export const formatDate = (d: string | Date | null | undefined): string => {
  if (!d) return "—";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
};

export const parseAmount = (s: string): number => {
  const cleaned = s.replace(/[^\d.]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};
