## Goal
1. Correct the About page so Renteaze is described as a **registered trademark of Renteaze International Limited (registered 10 Mar 2021)** — not a subsidiary of Dapo Okunogbe & Partners.
2. Add a clear "Renteaze is not a financial institution" disclosure in the footer, on every page, explaining that Renteaze is a PropTech platform and that financial services are delivered through licensed partners.

## Changes

### 1. `src/pages/About.tsx`
- Rewrite the "Our Story" copy: remove the "subsidiary of Dapo Okunogbe & Partners" line. Replace with messaging that Renteaze is a brand/registered trademark of Renteaze International Limited (RC 1768094), with the trademark registered on 10 March 2021, building on 15+ years of Nigerian real estate experience from the founding team.
- Update the hero sub-line under the H1 to reflect the same framing (no "subsidiary").
- Update the Credentials list: replace any "subsidiary" wording with "Registered trademark of Renteaze International Limited — registered 10 March 2021".
- Leave team bios largely intact, but soften the "Founded Dapo Okunogbe & Partners" bio so it reads as prior experience of the founder, not a parent company of Renteaze.

### 2. `src/pages/ForInvestors.tsx`
- Remove the bullet "Subsidiary of Dapo Okunogbe & Partners (Est. 2009)" and replace with "Renteaze is a registered trademark of Renteaze International Limited (RC 1768094)".

### 3. `src/pages/Index.tsx`
- Update the "Backed by 15+ Years of Real Estate" feature copy to drop the "Dapo Okunogbe & Partners" framing and instead reference the founding team's 15+ years of Lagos real estate expertise.

### 4. Footer disclaimer — `src/components/Footer.tsx`
Add a new disclosure block above (or just under) the existing copyright row, shown on every page that uses the main Footer. Wording (final copy):

> **Renteaze is a PropTech company, not a bank, deposit-taking institution, securities dealer, or licensed financial-services provider.** We provide property-technology services. Rent financing, savings, payments, and investment products surfaced on the platform are offered and operated by our licensed partners (banks, microfinance institutions, fund managers, and SEC/CBN-regulated entities), who are solely responsible for those products. Nothing on this site is investment, legal, or tax advice. All investments carry risk, including possible loss of capital. See our [Disclaimer](/legal/disclaimer) and [Terms](/legal/terms).

- Style: small muted text, full-width, with proper spacing — not buried in the copyright line.
- Include the existing "Operated by Renteaze International Limited (RC 1768094)" line and add "Renteaze® is a registered trademark of Renteaze International Limited (registered 10 March 2021)".

### 5. Auxiliary footers
For consistency, add a condensed version of the same not-a-financial-institution line to:
- `src/components/auth/AuthShell.tsx`
- `src/components/landing/LandingShell.tsx`

Just one sentence + link to `/legal/disclaimer`, so it appears on auth and landing pages too.

## Out of scope
- No changes to legal pages (Privacy, Terms, Disclaimer, AML/KYC) — they already use the correct entity name.
- No DB / backend changes.
- No restyling beyond what's needed for the new disclosure block to read cleanly.
