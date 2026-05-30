## Replace icon-only logos with full wordmark versions

The current Stanbic IBTC, MyCover.AI, and Zedcrest logos came from logo.dev, which returned favicon-style icon marks without the brand name. Swap them for full horizontal logos that include the wordmark.

### Approach
1. Source full-wordmark logos for each:
   - **Stanbic IBTC** — fetch from Wikipedia's full SVG (`Stanbic_IBTC_Bank_Logo.svg`) at a valid thumb size, or from the official `stanbicibtcbank.com` site.
   - **MyCover.AI** — extract the inline SVG wordmark from `mycover.ai` header, save as `.svg`.
   - **Zedcrest** — extract the inline SVG wordmark from `zedcrest.com` header, save as `.svg`.
2. Replace the three files in `src/assets/logos/` (`stanbic.png`, `mycover.png`, `zedcrest.png`) — keeping the same filenames so no import changes are needed. Use `.svg` where extracted as SVG and update the import extension only if needed.
3. Visually verify each replacement renders the full name + mark, not just the icon, by viewing the saved files.

### Out of scope
- No layout or carousel changes — the 8 uploaded logos already display correctly.
