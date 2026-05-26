export type PropertyListingType = "Rent" | "Sale" | "Short-Let";

export interface Property {
  id: string;
  title: string;
  type: PropertyListingType;
  location: string;
  area: string;
  price: string;
  priceNumeric: number;
  beds: number;
  baths: number;
  sqm: number;
  features: string[];
  description: string;
  images: string[];
}

export const properties: Property[] = [
  {
    id: "lekki-3br-apartment",
    title: "3 Bedroom Apartment",
    type: "Rent",
    location: "Lekki Phase 1",
    area: "Lekki",
    price: "₦3,500,000/yr",
    priceNumeric: 3500000,
    beds: 3,
    baths: 3,
    sqm: 150,
    features: ["24hr Power", "Swimming Pool", "Security", "Fitted Kitchen", "Parking", "Borehole"],
    description: "A spacious modern 3-bedroom apartment in the heart of Lekki Phase 1, offering an ensuite master, fitted kitchen, and access to a serviced compound with 24-hour power and swimming pool. Walking distance to schools, restaurants, and Admiralty Way.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    ],
  },
  {
    id: "vi-4br-duplex",
    title: "4 Bedroom Duplex",
    type: "Sale",
    location: "Victoria Island",
    area: "Victoria Island",
    price: "₦85,000,000",
    priceNumeric: 85000000,
    beds: 4,
    baths: 4,
    sqm: 280,
    features: ["BQ", "Parking", "Garden", "CCTV", "Solar Inverter", "Smart Locks"],
    description: "Beautifully finished 4-bedroom semi-detached duplex on Victoria Island. Featuring a BQ, landscaped garden, and modern smart-home features. Title: Governor's Consent ready.",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    ],
  },
  {
    id: "yaba-2br-flat",
    title: "2 Bedroom Flat",
    type: "Rent",
    location: "Yaba",
    area: "Mainland",
    price: "₦1,800,000/yr",
    priceNumeric: 1800000,
    beds: 2,
    baths: 2,
    sqm: 90,
    features: ["Prepaid Meter", "Water", "Tiled", "Wardrobes", "Secure Compound"],
    description: "Well-finished 2-bedroom flat in a quiet Yaba street. Excellent for young professionals and small families. Close to UNILAG, Sabo, and major Mainland transport links.",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    ],
  },
  {
    id: "ikoyi-penthouse",
    title: "Luxury Penthouse",
    type: "Short-Let",
    location: "Ikoyi",
    area: "Ikoyi",
    price: "₦150,000/night",
    priceNumeric: 150000,
    beds: 3,
    baths: 3,
    sqm: 200,
    features: ["Ocean View", "Gym", "Concierge", "Pool", "High-Speed Wi-Fi", "Daily Cleaning"],
    description: "Premium 3-bedroom penthouse on the upper floors of an Ikoyi tower with sweeping ocean and skyline views. Perfect for executive stays and visiting diaspora families. Includes daily housekeeping and concierge.",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    ],
  },
  {
    id: "ikeja-studio",
    title: "Studio Apartment",
    type: "Rent",
    location: "Ikeja GRA",
    area: "Mainland",
    price: "₦1,200,000/yr",
    priceNumeric: 1200000,
    beds: 1,
    baths: 1,
    sqm: 45,
    features: ["Furnished", "AC", "Security", "Inverter", "Wi-Fi Ready"],
    description: "Smart, fully furnished studio in serene Ikeja GRA. Ideal for working professionals. Comes with inverter backup, AC, and dedicated parking.",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    ],
  },
  {
    id: "banana-island-detached",
    title: "5 Bedroom Detached House",
    type: "Sale",
    location: "Banana Island",
    area: "Ikoyi",
    price: "₦350,000,000",
    priceNumeric: 350000000,
    beds: 5,
    baths: 6,
    sqm: 500,
    features: ["Pool", "Cinema", "Smart Home", "Gym", "BQ", "Solar"],
    description: "Trophy 5-bedroom detached residence on Banana Island. Private pool, home cinema, gym, fully integrated smart-home system, and a 2-room BQ. Title: Certificate of Occupancy.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    ],
  },
];

export const featuredProperties = properties.slice(0, 3);
