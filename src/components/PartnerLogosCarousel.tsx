import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

// All partner logos are hosted in the Supabase Storage bucket `partner-logos`
// so they survive Lovable project transfers. To add/replace logos, upload to
// that bucket and add an entry below.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const logoUrl = (file: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/partner-logos/${file}`;

const partners = [
  { name: "GTBank", file: "gtbank.png" },
  { name: "FirstBank", file: "firstbank.png" },
  { name: "Stanbic IBTC", file: "stanbic.png" },
  { name: "MyCover.AI", file: "mycover.png" },
  { name: "Bujeti", file: "bujeti.jpg" },
  { name: "Zedcrest", file: "zedcrest.png" },
  { name: "Harvest House Christian Center", file: "hcc.jpg" },
  { name: "Cadlinks Systems", file: "cadlinks.png" },
  { name: "DOP Real Estate Consulting Firm", file: "dop.png" },
  { name: "Hermon Barristers & Solicitors", file: "hermon.png" },
  { name: "Oduak Projects Ltd", file: "oduak.png" },
  { name: "Dapo Okunogbe & Partners", file: "dop-partners.jpg" },
  { name: "Disciples in Business UK Ltd", file: "disciples-in-business.jpg" },
  { name: "Epitom Concepts UK Ltd", file: "epitom-concepts.jpg" },
  { name: "Epitom Inventory", file: "epitom-inventory.jpg" },
  { name: "FacMance", file: "facmance.jpg" },
];

const PartnerLogosCarousel = () => {
  const autoplay = useRef(
    Autoplay({ delay: 2200, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [autoplay.current]
  );

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex items-center -ml-6">
        {partners.map((p) => (
          <div
            key={p.name}
            className="pl-6 shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
          >
            <div className="flex items-center justify-center h-16 md:h-20">
              <img
                src={logoUrl(p.file)}
                alt={`${p.name} logo`}
                loading="lazy"
                className="max-h-12 md:max-h-14 w-auto object-contain opacity-80 grayscale hover:grayscale-0 hover:opacity-100 transition"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerLogosCarousel;
