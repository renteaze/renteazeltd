import { MessageCircle } from "lucide-react";
import { waLink } from "@/config/contact";

const WhatsAppFAB = () => (
  <a
    href={waLink("Hello Renteaze, I'd like to learn more about your services")}
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
