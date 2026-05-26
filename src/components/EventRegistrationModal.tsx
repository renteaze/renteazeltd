import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EventRegistrationModalProps {
  event: { id: string; title: string; date: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EventRegistrationModal = ({ event, open, onOpenChange }: EventRegistrationModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Registration confirmed!", {
      description: `You're registered for "${event?.title}" on ${event?.date}. Check your email for details.`,
    });
    setName("");
    setEmail("");
    setPhone("");
    onOpenChange(false);
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register for Event</DialogTitle>
          <DialogDescription>{event.title} — {event.date}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="evt-name">Full Name</Label>
            <Input id="evt-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="evt-email">Email</Label>
            <Input id="evt-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="evt-phone">Phone Number</Label>
            <Input id="evt-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234..." className="mt-1" />
          </div>
          <Button type="submit" className="w-full bg-accent text-accent-foreground hover:opacity-90">
            Confirm Registration
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationModal;
