import { useState } from "react";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import EventRegistrationModal from "@/components/EventRegistrationModal";
import { events as allEvents, RenteazeEvent } from "@/data/events";

const events = allEvents.slice(0, 3);

const UpcomingEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState<RenteazeEvent | null>(null);

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <SectionHeading
          title="Upcoming Events & Training"
          subtitle="Join our seminars and webinars to learn how Renteaze can work for you."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow border-t-4 border-t-primary">
              <CardContent className="p-6">
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${
                  event.type === "Online"
                    ? "bg-accent/10 text-accent"
                    : "bg-light-blue text-primary"
                }`}>
                  {event.type}
                </span>
                <h3 className="font-semibold text-lg mb-3">{event.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{event.desc}</p>
                <div className="space-y-2 text-sm text-muted-foreground mb-5">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    {event.location}
                  </div>
                </div>
                <Button
                  onClick={() => setSelectedEvent(event)}
                  className="w-full bg-primary text-primary-foreground"
                >
                  Register Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <EventRegistrationModal
        event={selectedEvent}
        open={!!selectedEvent}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      />
    </section>
  );
};

export default UpcomingEvents;
