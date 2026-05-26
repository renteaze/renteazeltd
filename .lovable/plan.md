## The layout bug (why content is squeezed)

`src/components/legal/LegalPage.tsx` wraps the article in a `md:grid-cols-4` grid. The TOC sidebar takes 1 column **only when `tableOfContents` is passed**, and the article only gets `md:col-span-3` **in that same case**. None of the 5 legal pages currently pass a TOC — so the grid still creates 4 columns, the sidebar is absent, and the article falls into a single column (1/4 of the width). That's why every page looks squeezed to one side.

## Fix

**1. Repair the shell** (`src/components/legal/LegalPage.tsx`)
- When `tableOfContents` is absent: drop the grid entirely, render the article full-width within `max-w-3xl` (proper reading measure).
- When `tableOfContents` is present: keep the 4-col grid with sticky TOC + `md:col-span-3` article.
- Tighten prose: `max-w-none` inside the article container, comfortable line-height, sensible heading rhythm.

**2. Add a TOC to every page** so the sidebar layout is actually used and users can navigate long legal docs. Each `<h2>` gets a matching `id`.

**3. Rewrite content to global standard** — GDPR (EU/UK) + CCPA/CPRA (California) + NDPA (Nigeria). Every page restructured to match how Stripe / Wise / Revolut publish theirs.

### Privacy Policy (largest rewrite)
Sections: Who we are & controller identity · Data we collect (categories: identity, financial, KYC, device, usage, cookies) · Sources · Purposes & legal bases (GDPR Art. 6 mapped per purpose) · Sharing & processors · International transfers (SCCs, adequacy) · Retention schedule (table) · Your rights under GDPR (access, rectification, erasure, restriction, portability, objection, withdraw consent) · Your rights under CCPA/CPRA (know, delete, correct, opt-out of sale/sharing, limit sensitive PI, non-discrimination) · Your rights under NDPA · How to exercise rights + verification · Children · Automated decision-making & credit scoring · Security · Breach notification · Complaints (NDPC, ICO, EDPB, California AG) · Contact DPO · Changes.

### Terms of Service
Add: definitions · electronic contracting · consumer rights (UK CRA / EU consumer directives) · termination & account closure · suspension grounds · refunds & chargebacks · indemnity · warranty disclaimers · force majeure · assignment · severability · entire agreement · dispute resolution (informal → arbitration carve-out / small claims) · notices · contact. Keep Nigerian governing law, but mark mandatory consumer protections that cannot be contracted out of.

### Cookie Policy
Per-category tables (Strictly necessary / Functional / Analytics / Marketing) with cookie name, purpose, duration, party. Consent model (opt-in EU/UK, opt-out California sale/share via Global Privacy Control), how to withdraw, browser controls, Do Not Track statement, link to preference center.

### Disclaimer (Investment & Financial)
Risk warnings (capital at risk, illiquidity, forex, regulatory) · not investment advice · forward-looking statements · past performance · SEC Nigeria positioning · jurisdictional restrictions (not an offer where prohibited) · suitability · tax · third-party content.

### AML / KYC Policy
Regulatory basis (Nigeria MLPPA 2022, CBN AML/CFT regs, FATF) · customer due diligence levels (simplified, standard, enhanced) · PEP & sanctions screening (UN, OFAC, EU, UK HMT) · source of funds · ongoing monitoring · suspicious transaction reporting (NFIU) · record retention (5 years) · sanctions compliance · employee training · refusal/exit grounds · customer cooperation.

**4. Shared footer block** in LegalPage stays, but split the disclaimer/contact into: DPO contact (`dpo@renteaze.com`), legal (`legal@renteaze.com`), complaints address (registered office).

## Technical details

```text
src/components/legal/LegalPage.tsx     fix grid; conditional layout; TOC always supported
src/pages/legal/Privacy.tsx            full rewrite + TOC ids
src/pages/legal/Terms.tsx              full rewrite + TOC ids
src/pages/legal/Cookies.tsx            full rewrite with cookie tables + TOC
src/pages/legal/Disclaimer.tsx         full rewrite + TOC
src/pages/legal/AmlKyc.tsx             full rewrite + TOC
```

No new dependencies. No route changes. Existing `@tailwindcss/typography` `prose` classes handle the long-form formatting.

## Out of scope

- Cookie consent banner / preference center UI (content references it; building the UI is a separate task — flag if you want it).
- Actual legal review by counsel. These templates follow public best practice but should be reviewed by a Nigerian-qualified lawyer before going live.
