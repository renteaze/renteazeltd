## Goal
Make the legal pages genuinely readable instead of appearing as one continuous block of text.

## What I will change
1. **Fix the shared legal-page typography** in `src/components/legal/LegalPage.tsx`:
   - Increase separation between sections.
   - Add clear spacing before/after paragraphs, lists, and tables.
   - Reduce overly wide text lines so paragraphs are easier to scan.
   - Make list items visibly separate instead of looking like inline text.
   - Keep the table of contents layout, but improve its spacing so it does not compete with the article text.

2. **Fix the Terms page markup** in `src/pages/legal/Terms.tsx`:
   - Convert definition-style sections into proper definition/list blocks with spacing.
   - Add visual breathing room between short paragraphs in sections like Eligibility and Accounts.
   - Avoid headings immediately touching previous content.

3. **Apply the same readability pattern to the other legal pages**:
   - `Privacy.tsx`
   - `Cookies.tsx`
   - `Disclaimer.tsx`
   - `AmlKyc.tsx`

## Technical approach
- Use Tailwind Typography selectors already centralized in `LegalPage.tsx`, not scattered one-off styling.
- Keep existing legal wording, route structure, anchors, and table-of-contents IDs unchanged.
- Use existing semantic design tokens where possible and avoid adding unrelated design changes.
- Verify the `/legal/terms` page after implementation so the first viewport no longer shows headings and body copy running together.