export type EventAudience = "tenant" | "landlord" | "investor" | "professional" | "all";
export type EventType = "Online" | "In-Person" | "Hybrid";

export interface RenteazeEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: EventType;
  audience: EventAudience;
  speaker: string;
  price: number; // 0 = Free
  desc: string;
  image?: string;
}

export const events: RenteazeEvent[] = [
  {
    id: "rent-smarter-lagos",
    title: "Rent Smarter Lagos Seminar",
    date: "May 24, 2026",
    time: "10:00 AM WAT",
    location: "Lagos Continental Hotel, Victoria Island",
    type: "In-Person",
    audience: "tenant",
    speaker: "Tunde Adeyemi, Head of Tenant Solutions",
    price: 0,
    desc: "Learn how to break free from annual rent stress. Discover Save for Rent, Loan for Rent, and other Renteaze solutions live.",
  },
  {
    id: "diaspora-investment",
    title: "Diaspora Investment Webinar",
    date: "June 7, 2026",
    time: "2:00 PM GMT / 3:00 PM WAT",
    location: "Online (Zoom)",
    type: "Online",
    audience: "investor",
    speaker: "Dapo Okunogbe, Founding Partner",
    price: 0,
    desc: "Exclusive session for Nigerians abroad: learn how to invest in Lagos real estate with full transparency and professional management.",
  },
  {
    id: "landlord-masterclass",
    title: "Landlord Masterclass: Maximize Your Returns",
    date: "June 21, 2026",
    time: "11:00 AM WAT",
    location: "Renteaze Office, Ikeja",
    type: "In-Person",
    audience: "landlord",
    speaker: "Adaeze Nwosu, Director of Property Management",
    price: 25000,
    desc: "Property owners — discover guaranteed rent, professional management, and financing options to grow your portfolio.",
  },
  {
    id: "partner-onboarding",
    title: "Renteaze Partner Onboarding & Certification",
    date: "July 5, 2026",
    time: "9:00 AM WAT",
    location: "Online (Zoom)",
    type: "Online",
    audience: "professional",
    speaker: "Renteaze Partnerships Team",
    price: 0,
    desc: "For estate agents, lawyers, and surveyors joining the Renteaze referral programme. Earn your Certified Partner badge.",
  },
  {
    id: "rent-to-own-explainer",
    title: "Rent-to-Own: A Path to Owning Your Home",
    date: "July 19, 2026",
    time: "3:00 PM WAT",
    location: "Online (Zoom)",
    type: "Online",
    audience: "tenant",
    speaker: "Funke Adesanya, Product Lead",
    price: 0,
    desc: "Walk through how Renteaze's Rent-to-Own programme converts your monthly rent into equity in a home you can call your own.",
  },
  {
    id: "lagos-market-outlook",
    title: "Lagos Real Estate Outlook 2026",
    date: "August 9, 2026",
    time: "10:00 AM WAT",
    location: "Eko Hotel, Victoria Island",
    type: "Hybrid",
    audience: "all",
    speaker: "Panel: Renteaze + GTBank + Stanbic IBTC",
    price: 50000,
    desc: "Industry leaders share market data, investment trends, and what to expect across Lagos property in the year ahead.",
  },
];

export const featuredEvents = events.slice(0, 3);
