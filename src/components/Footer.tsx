import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/renteaze-logo-white.png";

const Footer = () => (
  <footer className="bg-navy text-navy-foreground">
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand */}
        <div>
          <span className="inline-flex items-center bg-background rounded-md px-3 py-1.5 ring-1 ring-foreground/5 shadow-sm mb-4">
            <img src={logo} alt="Renteaze" className="h-10" />
          </span>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nigeria's PropTech platform making renting, owning, and investing in property smarter and more accessible.
          </p>
          <p className="text-xs text-muted-foreground mt-4">Renteaze International Limited · RC 1768094</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4 text-accent">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: "For Tenants", path: "/for-tenants" },
              { label: "For Landlords", path: "/for-landlords" },
              { label: "For Investors", path: "/for-investors" },
              { label: "For Professionals", path: "/professionals" },
              { label: "Properties", path: "/properties" },
              { label: "Events", path: "/events" },
            ].map((l) => (
              <li key={l.path}>
                <Link to={l.path} className="hover:text-accent transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold mb-4 text-accent">Company</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: "About Us", path: "/about" },
              { label: "Blog & Insights", path: "/blog" },
              { label: "FAQ", path: "/faq" },
              { label: "Contact", path: "/contact" },
            ].map((l) => (
              <li key={l.path}>
                <Link to={l.path} className="hover:text-accent transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold mb-4 text-accent">Legal</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Terms of Service", path: "/legal/terms" },
              { label: "Privacy Policy", path: "/legal/privacy" },
              { label: "Cookie Policy", path: "/legal/cookies" },
              { label: "AML & KYC", path: "/legal/aml-kyc" },
              { label: "Disclaimer", path: "/legal/disclaimer" },
              { label: "Contact", path: "/contact" },
            ].map((l) => (
              <li key={l.path}>
                <Link to={l.path} className="hover:text-accent transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-4 text-accent">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent" />
              <span>Lagos, Nigeria</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-accent" />
              <a href="tel:+2348000000000" className="hover:text-accent transition-colors">
                +234 800 000 0000
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-accent" />
              <a href="mailto:info@renteaze.com" className="hover:text-accent transition-colors">
                info@renteaze.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary/20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Renteaze. All rights reserved.</p>
        <p>Operated by Renteaze International Limited (RC 1768094)</p>
      </div>
    </div>
  </footer>
);

export default Footer;
