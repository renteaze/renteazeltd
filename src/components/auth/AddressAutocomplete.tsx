import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin } from "lucide-react";

type Suggestion = {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
};

interface Props {
  id?: string;
  value: string;
  onChange: (value: string, coords?: { lat: number; lon: number }) => void;
  placeholder?: string;
  countryCode?: string; // ISO2 lowercase
}

const AddressAutocomplete = ({ id, value, onChange, placeholder, countryCode = "ng" }: Props) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const skipNextFetch = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }
    if (!value || value.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    const handle = setTimeout(async () => {
      setLoading(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=${countryCode}&addressdetails=1&limit=5&q=${encodeURIComponent(value)}`;
        const res = await fetch(url, { headers: { "Accept-Language": "en" } });
        if (res.ok) {
          const data = (await res.json()) as Suggestion[];
          setSuggestions(data);
          setOpen(data.length > 0);
        }
      } catch {
        // silent — user can still type freely
      } finally {
        setLoading(false);
      }
    }, 450);
    return () => clearTimeout(handle);
  }, [value, countryCode]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const pick = (s: Suggestion) => {
    skipNextFetch.current = true;
    onChange(s.display_name, { lat: parseFloat(s.lat), lon: parseFloat(s.lon) });
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length && setOpen(true)}
        placeholder={placeholder || "Start typing your address…"}
        autoComplete="off"
        className="mt-1"
      />
      {loading && (
        <Loader2 className="absolute right-3 top-3.5 h-4 w-4 animate-spin text-muted-foreground" />
      )}
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-64 overflow-auto">
          {suggestions.map((s) => (
            <button
              key={s.place_id}
              type="button"
              onClick={() => pick(s)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex gap-2 items-start border-b last:border-b-0"
            >
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
              <span className="line-clamp-2">{s.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
