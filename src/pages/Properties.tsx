import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Bed, Bath, Maximize, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/PortalAwareLayout";
import { properties } from "@/data/properties";

const Properties = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [bedsFilter, setBedsFilter] = useState("all");

  const filtered = properties.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || p.type === typeFilter;
    const matchesBeds = bedsFilter === "all" || p.beds === Number(bedsFilter);
    return matchesSearch && matchesType && matchesBeds;
  });

  return (
    <Layout>
      <section className="bg-navy text-navy-foreground py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Find Your <span className="text-accent">Perfect Property</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse curated properties across Lagos — for rent, purchase, or short-let.
          </p>
        </div>
      </section>

      <section className="py-6 border-b sticky top-16 bg-background z-40">
        <div className="container mx-auto px-4 lg:px-8 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Rent">Rent</SelectItem>
              <SelectItem value="Sale">Sale</SelectItem>
              <SelectItem value="Short-Let">Short-Let</SelectItem>
            </SelectContent>
          </Select>
          <Select value={bedsFilter} onValueChange={setBedsFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Bedrooms" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Beds</SelectItem>
              {[1, 2, 3, 4, 5].map((b) => (
                <SelectItem key={b} value={String(b)}>{b} Bed{b > 1 ? "s" : ""}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No properties match your filters</p>
              <p className="text-muted-foreground text-sm">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <Link key={p.id} to={`/properties/${p.id}`} className="group">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden h-full">
                    <img src={p.images[0]} alt={p.title} className="w-full h-48 object-cover group-hover:scale-[1.02] transition-transform" loading="lazy" />
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary">{p.type}</span>
                        <span className="font-bold text-primary">{p.price}</span>
                      </div>
                      <h3 className="font-semibold text-lg">{p.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-4 w-4" /> {p.location}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-3">
                        <span className="flex items-center gap-1"><Bed className="h-4 w-4" /> {p.beds}</span>
                        <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {p.baths}</span>
                        <span className="flex items-center gap-1"><Maximize className="h-4 w-4" /> {p.sqm}sqm</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Properties;
