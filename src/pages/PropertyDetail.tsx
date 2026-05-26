import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, MapPin, Bed, Bath, Maximize, CheckCircle2, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel";
import Layout from "@/components/PortalAwareLayout";
import { properties } from "@/data/properties";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const property = properties.find((p) => p.id === id);

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  if (!property) return <Navigate to="/properties" replace />;

  const waLink = `https://wa.me/2348000000000?text=${encodeURIComponent(
    `Hello Renteaze, I'm interested in "${property.title}" in ${property.location}.`
  )}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Enquiry sent!", {
      description: `Our team will reach out about "${property.title}" within 24 hours.`,
    });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <Layout>
      <section className="py-6 border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <Link to="/properties" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to listings
          </Link>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              {property.images.map((img, i) => (
                <CarouselItem key={i}>
                  <img src={img} alt={`${property.title} – view ${i + 1}`} className="w-full h-[300px] md:h-[480px] object-cover rounded-xl" />
                </CarouselItem>
              ))}
            </CarouselContent>
            {property.images.length > 1 && (
              <>
                <CarouselPrevious className="left-2 md:-left-4" />
                <CarouselNext className="right-2 md:-right-4" />
              </>
            )}
          </Carousel>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary">{property.type}</span>
              <h1 className="text-3xl md:text-4xl font-bold mt-3">{property.title}</h1>
              <p className="text-muted-foreground flex items-center gap-1 mt-2">
                <MapPin className="h-4 w-4" /> {property.location} · {property.area}
              </p>
            </div>

            <Card>
              <CardContent className="p-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <Bed className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="font-semibold">{property.beds}</p>
                  <p className="text-xs text-muted-foreground">Beds</p>
                </div>
                <div>
                  <Bath className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="font-semibold">{property.baths}</p>
                  <p className="text-xs text-muted-foreground">Baths</p>
                </div>
                <div>
                  <Maximize className="h-5 w-5 mx-auto text-primary mb-1" />
                  <p className="font-semibold">{property.sqm}</p>
                  <p className="text-xs text-muted-foreground">sqm</p>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-xl font-semibold mb-3">About this property</h2>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Features & amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {property.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Location</h2>
              <div className="aspect-video rounded-lg overflow-hidden border">
                <iframe
                  title={`Map of ${property.location}`}
                  className="w-full h-full"
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(property.location + ", Lagos, Nigeria")}&output=embed`}
                />
              </div>
            </div>
          </div>

          {/* Sticky enquiry sidebar */}
          <div className="lg:sticky lg:top-24">
            <Card className="border-2 border-primary/10 shadow-md">
              <CardContent className="p-6">
                <p className="text-2xl font-bold text-primary">{property.price}</p>
                <p className="text-xs text-muted-foreground mt-1">Listed on Renteaze</p>

                <form onSubmit={handleSubmit} className="space-y-3 mt-5">
                  <div>
                    <Label htmlFor="enq-name">Full Name</Label>
                    <Input id="enq-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="enq-email">Email</Label>
                    <Input id="enq-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="enq-phone">Phone</Label>
                    <Input id="enq-phone" type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" placeholder="+234..." />
                  </div>
                  <div>
                    <Label htmlFor="enq-msg">Message</Label>
                    <Textarea id="enq-msg" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1" placeholder="When would you like to view?" />
                  </div>
                  <Button type="submit" className="w-full bg-primary text-primary-foreground">Send Enquiry</Button>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="block">
                    <Button type="button" variant="outline" className="w-full gap-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white">
                      <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                    </Button>
                  </a>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PropertyDetail;
