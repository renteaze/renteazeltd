import { MessageCircle } from "lucide-react";

const WhatsAppFAB = () => (
  <a
    href="https://wa.me/2348000000000?text=Hello%20Renteaze%2C%20I%27d%20like%20to%20learn%20more%20about%20your%20services"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle className="h-5 w-5" />
    <span className="hidden sm:inline text-sm font-semibold">Chat with us</span>
  </a>
);

export default WhatsAppFAB;
