## Add new partner logos to "In Good Company" carousel

Upload the 7 attached logos as Lovable Assets and add them to the `PartnerLogosCarousel` partners list.

### Steps
1. Upload each uploaded image via `lovable-assets create` from `/mnt/user-uploads/`, writing `.asset.json` pointers to `src/assets/logos/`:
   - `dop-partners.jpg.asset.json` — D.O.P (Dapo Okunogbe & Partners)
   - `disciples-in-business.jpg.asset.json` — Disciples in Business UK Ltd
   - `epitom-concepts.jpg.asset.json` — Epitom Concepts UK Ltd
   - `epitom-inventory.jpg.asset.json` — Epitom Inventory
   - `facmance.jpg.asset.json` — FacMance
   - `oakbridge.jpg.asset.json` — Oakbridge Investment Holdings
   - `skywarder.jpg.asset.json` — Skywarder Limited
2. In `src/components/PartnerLogosCarousel.tsx`, import the 7 new asset pointers and append them to the `partners` array with proper names.
   - Note: existing `dop.png` is a different "DOP Real Estate Consulting Firm" — keep it; the new D.O.P (Dapo Okunogbe & Partners) is a separate entry.

### Out of scope
- No layout/carousel behavior changes.
- No changes to existing logos.
