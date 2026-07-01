## Goal
Hide all public-facing property photos behind a consistent "Images Unavailable" placeholder, while keeping upload functionality intact in the Landlord and Admin forms.

## 1. New reusable component
Create `src/components/PropertyImagePlaceholder.tsx`:
- Props: `className?: string` (so callers pass the same sizing classes previously on `<img>`, e.g. `w-full h-48`, `h-[300px] md:h-[480px]`, `aspect-video`).
- Renders a `bg-gray-100` block with flex-centered content:
  - `<ImageOff />` from `lucide-react`, `size={32}`, `color="#9CA3AF"`
  - `<p className="text-sm text-gray-400 mt-2">Images Unavailable</p>`
- Rounded corners inherited via className.

## 2. Replace `<img>` usages (public-facing)
Swap the property-photo `<img>` tags for `<PropertyImagePlaceholder />` with matching size classes:

- `src/pages/Properties.tsx` (line 80) — listing card thumbnail (`w-full h-48 rounded-t-lg`-equivalent).
- `src/pages/Index.tsx` (line 179) — featured property card on home page.
- `src/pages/PropertyDetail.tsx` (lines 49–61) — replace the entire `<Carousel>` block with a single full-width placeholder (`w-full h-[300px] md:h-[480px] rounded-xl`). Remove now-unused `Carousel*` imports.

## 3. Portal-facing property views
Per the request, property cards inside the Landlord portal and Admin backend should also use the placeholder:

- `src/pages/portal/landlord/Properties.tsx` (lines ~180–192) — replace the `images[0]` branch (and the empty-state `Building2` fallback) with `<PropertyImagePlaceholder className="w-full h-full" />` inside the existing `aspect-video` wrapper.
- `src/pages/portal/landlord/PropertyDetail.tsx` (lines ~253–260) — same swap for the hero image block.
- `src/pages/portal/admin/Properties.tsx` — audit and apply the same swap to any property image renders (if none exist, no change).

## 4. Keep upload UI intact
Do NOT modify:
- `src/pages/portal/landlord/AddProperty.tsx` upload field and Supabase upload logic.
- Any admin property form upload UI.
Landlords/admins can still attach images; they simply won't render publicly until we flip this back on later.

## 5. Out of scope
- No changes to Supabase schema, storage buckets, or upload flows.
- No changes to non-property images (blog, events, partner logos, avatars).
- No feature flag — a straight visual swap; re-enabling later means restoring the `<img>` tags.

## Technical notes
- `ImageOff` icon is available in `lucide-react`.
- Color `#9CA3AF` and `text-gray-400`/`bg-gray-100` are used verbatim per the spec (not tokenized) so the placeholder reads as a clearly neutral "unavailable" state and matches the requested design.
- The placeholder accepts `className` so each call site preserves the exact dimensions of the image it replaces (no layout shift).