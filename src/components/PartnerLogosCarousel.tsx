import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

import gtbank from "@/assets/logos/gtbank.png";
import firstbank from "@/assets/logos/firstbank.png";
import stanbic from "@/assets/logos/stanbic.png";
import mycover from "@/assets/logos/mycover.png";
import bujeti from "@/assets/logos/bujeti.jpg";
import zedcrest from "@/assets/logos/zedcrest.png";
import hcc from "@/assets/logos/hcc.jpg";
import cadlinks from "@/assets/logos/cadlinks.png";
import dop from "@/assets/logos/dop.png";
import hermon from "@/assets/logos/hermon.png";
import oduak from "@/assets/logos/oduak.png";

const partners = [
  { name: "GTBank", src: gtbank },
  { name: "FirstBank", src: firstbank },
  { name: "Stanbic IBTC", src: stanbic },
  { name: "MyCover.AI", src: mycover },
  { name: "Bujeti", src: bujeti },
  { name: "Zedcrest", src: zedcrest },
  { name: "Harvest House Christian Center", src: hcc },
  { name: "Cadlinks Systems", src: cadlinks },
  { name: "DOP Real Estate Consulting Firm", src: dop },
  { name: "Hermon Barristers & Solicitors", src: hermon },
  { name: "Oduak Projects Ltd", src: oduak },
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
                src={p.src}
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
