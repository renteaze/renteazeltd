import { useState } from "react";
import { Calendar, MapPin, Clock, User, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/PortalAwareLayout";
import EventRegistrationModal from "@/components/EventRegistrationModal";
import { events, RenteazeEvent, EventAudience } from "@/data/events";

type Filter = "all" | EventAudience | "free" | "paid";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "tenant", label: "Tenants" },
  { key: "landlord", label: "Landlords" },
  { key: "investor", label: "Investors" },
  { key: "professional", label: "Professionals" },
  { key: "free", label: "Free" },
  { key: "paid", label: "Paid" },
];

const audienceLabel: Record<EventAudience, string> = {
  tenant: "Tenants",
  landlord: "Landlords",
  investor: "Investors",
  professional: "Professionals",
  all: "Everyone",
};

const Events = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<RenteazeEvent | null>(null);

  const filtered = events.filter((e) => {
    if (filter === "all") return true;
    if (filter === "free") return e.price === 0;
    if (filter === "paid") return e.price > 0;
    return e.audience === filter || e.audience === "all";
  });

  return (
    <Layout>
      <section className="bg-navy text-navy-foreground py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Upcoming <span className="text-accent">Events & Training</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Seminars, webinars, and workshops for tenants, landlords, investors, and partners across Nigeria.
          </p>
        </div>
      </section>

      <section className="py-6 border-b sticky top-16 bg-background z-40">
        <div className="container mx-auto px-4 lg:px-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <Button
              key={f.key}
              variant={filter === f.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>No events match this filter yet — check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow border-t-4 border-t-primary">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        event.type === "Online" ? "bg-accent/10 text-accent"
                        : event.type === "Hybrid" ? "bg-primary/10 text-primary"
                        : "bg-light-blue text-primary"
                      }`}>
                        {event.type}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground inline-flex items-center gap-1">
                        <Tag className="h-3 w-3" /> {audienceLabel[event.audience]}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ml-auto ${
                        event.price === 0 ? "bg-green-100 text-green-700" : "bg-accent/15 text-accent"
                      }`}>
                        {event.price === 0 ? "Free" : `₦${event.price.toLocaleString()}`}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{event.desc}</p>
                    <div className="space-y-2 text-sm text-muted-foreground mb-5">
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary shrink-0" />{event.date}</div>
                      <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary shrink-0" />{event.time}</div>
                      <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary shrink-0" />{event.location}</div>
                      <div className="flex items-center gap-2"><User className="h-4 w-4 text-primary shrink-0" />{event.speaker}</div>
                    </div>
                    <Button
                      onClick={() => setSelected(event)}
                      className="w-full bg-primary text-primary-foreground"
                    >
                      Register Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <EventRegistrationModal
        event={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </Layout>
  );
};

export default Events;
