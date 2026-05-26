## Issue

Each section across the 5 legal pages is rendered as a single dense paragraph (often 4–8 lines). With long-form legal copy this turns into a wall of text — even with the typography spacing fix from the last turn, the *content itself* is under-paragraphed.

## Fix

Break the dense `<p>` blocks into multiple shorter paragraphs (2–4 sentences each) across all five legal pages, and convert long enumerations embedded in prose into bullet lists. No wording changes, no new sections, no removed obligations — purely structural splits.

**Heuristic applied per section:**
- A paragraph longer than ~3 sentences or ~60 words gets split at natural topic shifts.
- Lists hidden inside prose (e.g. "(a) … (b) … (c) …", or comma-separated obligations) become `<ul>` with one item each.
- Strong opening sentence stays as its own paragraph when it summarises the section (gives the eye a hook).

**Files touched (5):**
- `src/pages/legal/Terms.tsx` — split sections 3, 6, 7, 8, 10, 11, 13, 15, 17, 18, 20, 21, 22.
- `src/pages/legal/Privacy.tsx` — split the dense GDPR/CCPA/NDPA narrative blocks; promote rights enumerations to bullets.
- `src/pages/legal/Cookies.tsx` — split sections 1, 2, 8, 9, 11 into 2 paragraphs each.
- `src/pages/legal/Disclaimer.tsx` — split risk-warning paragraphs into one risk per paragraph or bullet.
- `src/pages/legal/AmlKyc.tsx` — split CDD, monitoring, sanctions, STR, training sections into shorter paragraphs and bullet the procedural steps.

No edits to `LegalPage.tsx`, `Footer.tsx`, `Navbar.tsx`, routes, or styles. No new dependencies. The TOC anchors stay identical so the sidebar links keep working.
