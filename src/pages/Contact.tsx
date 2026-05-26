import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import LeadCaptureForm from "@/components/LeadCaptureForm";

const Contact = () => (
  <Layout>
    <section className="bg-navy text-navy-foreground py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          Get In <span className="text-accent">Touch</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Have questions? Ready to get started? Our team is here to help.
        </p>
        <p className="mt-3 text-xs text-muted-foreground/80">
          Renteaze is operated by Renteaze International Limited (RC 1768094).
        </p>
      </div>
    </section>

    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div>
            <SectionHeading title="Send Us a Message" centered={false} />
            <LeadCaptureForm persona="general" />
          </div>

          {/* Contact Info */}
          <div>
            <SectionHeading title="Contact Information" centered={false} />
            <div className="space-y-6">
              <Card>
                <CardContent className="p-5 flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Office Address</h4>
                    <p className="text-sm text-muted-foreground">Lagos, Nigeria</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 flex items-start gap-4">
                  <Phone className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <a href="tel:+2348000000000" className="text-sm text-muted-foreground hover:text-primary transition-colors">+234 800 000 0000</a>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <a href="mailto:info@renteaze.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">info@renteaze.com</a>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 flex items-start gap-4">
                  <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Office Hours</h4>
                    <p className="text-sm text-muted-foreground">Monday – Friday: 9:00 AM – 6:00 PM</p>
                    <p className="text-sm text-muted-foreground">Saturday: 10:00 AM – 2:00 PM</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map placeholder */}
            <div className="mt-6 rounded-lg overflow-hidden border h-64 bg-muted flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Google Maps — Lagos Office</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Contact;
