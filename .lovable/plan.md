## Move and upgrade the "In good company" strip

### 1. Reposition
Move the "In good company" `<section>` (Index.tsx lines 227–241) directly under the hero (after line 91), removing it from its current position between Insights and Testimonials.

### 2. Add logo assets
Copy the 8 uploaded logos into `src/assets/logos/`:
- HCC Harvesthouse, Cadlinks Systems, DOP Real Estate, FirstBank, GTBank, Hermon Barristers & Solicitors, Oduak Projects, Bujeti

Fetch the official logos for the 3 remaining partners (Stanbic IBTC, MyCover.AI, Zed Crest) from the web and save into `src/assets/logos/` as well.

### 3. New `PartnerLogosCarousel` component
Create `src/components/PartnerLogosCarousel.tsx` using the existing `embla-carousel-react` (already in `ui/carousel.tsx`) with:
- Auto-scrolling continuous marquee (embla-carousel-autoplay or a lightweight CSS marquee fallback)
- Responsive slides: 2 on mobile, 3 sm, 4 md, 5 lg
- Each slide renders an `<img>` of the logo with consistent height (~h-10 md:h-12), `object-contain`, grayscale on idle + color on hover, proper `alt`
- Loop enabled, drag-free, no visible nav buttons

### 4. Wire into Index
Replace the inline `flex flex-wrap` logo list with `<PartnerLogosCarousel />` in the relocated section. Keep the "In good company" eyebrow label and section chrome (`py-10 border-y bg-background`).

### Out of scope
- No changes to LpTemplate's trust strip (separate component)
- No new dependencies beyond optionally `embla-carousel-autoplay` (already-compatible plugin)
