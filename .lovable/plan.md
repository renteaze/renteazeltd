## Scope

Three presentation-only fixes:

1. **Legal page typography & rhythm** — content reads cramped and under-paragraphed.
2. **Footer cleanup** — "Contact" appears in both the Company and Legal columns.
3. **Navbar slimming** — too many top-level links on desktop and mobile.

No content rewrites, no routing changes, no business logic.

---

## 1. Legal pages — spacing & structure

File: `src/components/legal/LegalPage.tsx` (shared by all 5 pages, so one edit fixes all).

Tighten the `proseClasses` to give the long-form legal copy real breathing room:

- Increase vertical rhythm: `prose-h2:mt-12 prose-h2:mb-5`, `prose-h3:mt-8 prose-h3:mb-3`, `prose-p:my-5`, `prose-p:leading-[1.75]`.
- Bump base size on desktop: wrap article in `text-[15px] md:text-base`.
- Lists: `prose-ul:my-5 prose-ul:space-y-2 prose-li:leading-relaxed prose-li:my-1.5`, add `marker:text-primary`.
- Tables: `prose-table:border prose-table:border-slate-200`, `prose-th:border-b prose-td:border-b prose-td:border-slate-100`, zebra rows via `[&_tbody_tr:nth-child(even)]:bg-slate-50/60`.
- H2s get a subtle separator: `prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-200`.
- Anchored headings already use `scroll-mt-24` — keep.
- Widen the no-TOC article from `max-w-3xl` to `max-w-3xl md:max-w-[70ch]` for better measure.
- TOC sidebar: increase link spacing (`py-1.5`) and add a left-border active hint on hover.

No changes to the 5 page files themselves; they already pass clean `<h2>`/`<p>`/`<ul>`/`<table>` markup that the new prose styles will format correctly.

## 2. Footer — remove duplicate links

File: `src/components/Footer.tsx`.

- Remove `Contact` from the **Legal** column (it already lives under **Company** and again as a full Contact column).
- Remove `Properties` and `Events` from **Quick Links** since they're prominent in the navbar — Quick Links becomes audience-focused only (Tenants, Landlords, Investors, Professionals).
- Keep the dedicated **Contact Us** column with phone/email/address as-is.

Result: each link appears exactly once.

## 3. Navbar — slim the header

File: `src/components/Navbar.tsx`.

Desktop top-level becomes: **Home · Solutions ▾ · Properties · Events · Company ▾ · Sign In · Get Started**.

- New **Company** dropdown groups: About, Blog, FAQ, Contact.
- Remove About / Blog / FAQ / Contact as standalone top-level links.
- Keep existing **Solutions** dropdown unchanged.
- Mobile menu: reuse the same grouped structure (Solutions section + Company section), so the drawer is shorter and scannable.
- Dropdown state: replace single `dropdownOpen` boolean with a keyed value (`openMenu: string | null`) so Solutions and Company don't fight each other.

Footer keeps the secondary links (About, Blog, FAQ) so nothing becomes unreachable.

---

## Technical notes

- Tailwind Typography plugin is already installed — all `prose-*` modifiers above are supported.
- All colors stay on semantic tokens / existing slate scale already used in the file.
- No new files, no new dependencies, no route changes.
- Files touched: `LegalPage.tsx`, `Footer.tsx`, `Navbar.tsx` (3 files total).
