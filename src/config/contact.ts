// Centralized contact details for Renteaze
export const WHATSAPP_NUMBER = "2348155020177";
export const PHONE_DISPLAY = "+234 815 502 0177";
export const PHONE_TEL = "+2348155020177";

export const waLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
