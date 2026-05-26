import LegalPage from "@/components/legal/LegalPage";

const toc = [
  { id: "what", label: "1. What cookies are" },
  { id: "why", label: "2. Why we use them" },
  { id: "categories", label: "3. Categories" },
  { id: "necessary", label: "4. Strictly necessary" },
  { id: "functional", label: "5. Functional" },
  { id: "analytics", label: "6. Analytics" },
  { id: "marketing", label: "7. Marketing" },
  { id: "third-party", label: "8. Third-party cookies" },
  { id: "consent", label: "9. Consent & GPC" },
  { id: "manage", label: "10. Manage your choices" },
  { id: "dnt", label: "11. Do Not Track" },
  { id: "updates", label: "12. Updates" },
  { id: "contact", label: "13. Contact" },
];

const Cookies = () => (
  <LegalPage
    title="Cookie Policy"
    description="How Renteaze uses cookies and similar technologies, and how to control them — compliant with the EU ePrivacy Directive, UK PECR, and CCPA/CPRA."
    effectiveDate="16 May 2026"
    version="2.0"
    tableOfContents={toc}
  >
    <h2 id="what">1. What cookies are</h2>
    <p>
      Cookies are small text files stored on your device when you visit a website. We also use
      similar technologies such as pixels, SDKs, local storage, and device fingerprints
      (collectively, <strong>cookies</strong> in this policy).
    </p>

    <h2 id="why">2. Why we use cookies</h2>
    <p>
      We use cookies to keep you signed in, secure your session, remember your preferences,
      measure how the Services perform, and — with your consent — to measure marketing campaigns
      and personalise content.
    </p>

    <h2 id="categories">3. Categories</h2>
    <p>We use four categories of cookies, summarised below and detailed in the following sections.</p>

    <h2 id="necessary">4. Strictly necessary</h2>
    <p>Required for the Services to function. Cannot be disabled.</p>
    <table>
      <thead>
        <tr><th>Cookie</th><th>Purpose</th><th>Duration</th><th>Party</th></tr>
      </thead>
      <tbody>
        <tr><td>rnt_session</td><td>Authentication session</td><td>Session</td><td>First-party</td></tr>
        <tr><td>rnt_csrf</td><td>CSRF protection</td><td>Session</td><td>First-party</td></tr>
        <tr><td>rnt_consent</td><td>Stores your cookie preferences</td><td>12 months</td><td>First-party</td></tr>
        <tr><td>__cf_bm</td><td>Bot mitigation (Cloudflare)</td><td>30 minutes</td><td>Third-party</td></tr>
      </tbody>
    </table>

    <h2 id="functional">5. Functional</h2>
    <p>Remember your preferences (language, saved filters, dashboard layout). Opt-in.</p>
    <table>
      <thead>
        <tr><th>Cookie</th><th>Purpose</th><th>Duration</th><th>Party</th></tr>
      </thead>
      <tbody>
        <tr><td>rnt_locale</td><td>Preferred language</td><td>12 months</td><td>First-party</td></tr>
        <tr><td>rnt_ui</td><td>UI preferences</td><td>12 months</td><td>First-party</td></tr>
      </tbody>
    </table>

    <h2 id="analytics">6. Analytics</h2>
    <p>Help us understand how the Services are used so we can improve them. Opt-in.</p>
    <table>
      <thead>
        <tr><th>Cookie</th><th>Purpose</th><th>Duration</th><th>Party</th></tr>
      </thead>
      <tbody>
        <tr><td>_ga</td><td>Distinguish users (Google Analytics 4)</td><td>13 months</td><td>Third-party</td></tr>
        <tr><td>_ga_*</td><td>Session state (Google Analytics 4)</td><td>13 months</td><td>Third-party</td></tr>
        <tr><td>ph_*</td><td>Product analytics (PostHog)</td><td>12 months</td><td>Third-party</td></tr>
      </tbody>
    </table>

    <h2 id="marketing">7. Marketing</h2>
    <p>Measure campaigns and show relevant Renteaze content on other platforms. Opt-in.</p>
    <table>
      <thead>
        <tr><th>Cookie</th><th>Purpose</th><th>Duration</th><th>Party</th></tr>
      </thead>
      <tbody>
        <tr><td>_fbp</td><td>Meta Pixel attribution</td><td>3 months</td><td>Third-party</td></tr>
        <tr><td>li_sugr</td><td>LinkedIn Insights</td><td>3 months</td><td>Third-party</td></tr>
        <tr><td>_gcl_au</td><td>Google Ads conversion</td><td>3 months</td><td>Third-party</td></tr>
      </tbody>
    </table>

    <h2 id="third-party">8. Third-party cookies</h2>
    <p>
      Where cookies are set by a third party, that party acts as an independent controller of the
      data collected through the cookie and is governed by its own privacy policy.
    </p>

    <h2 id="consent">9. Consent and Global Privacy Control</h2>
    <p>
      In the EU, UK, and similar jurisdictions, we ask for your explicit, opt-in consent before
      setting any non-essential cookie. In California, we treat the Global Privacy Control (GPC)
      browser signal as a valid request to opt out of any "sale" or "sharing" of personal
      information for cross-context behavioural advertising.
    </p>

    <h2 id="manage">10. Manage your choices</h2>
    <ul>
      <li>Open the <strong>Cookie preferences</strong> link in the footer at any time to change your settings.</li>
      <li>Use your browser settings to block or delete cookies (consult your browser's help pages).</li>
      <li>Opt out of Google Analytics with the official browser add-on.</li>
      <li>Disabling strictly-necessary cookies will break sign-in and core functionality.</li>
    </ul>

    <h2 id="dnt">11. Do Not Track</h2>
    <p>
      Browser Do Not Track (DNT) signals are not yet a recognised standard. We do not currently
      respond to DNT but we do honour GPC as described above.
    </p>

    <h2 id="updates">12. Updates</h2>
    <p>
      We may update this Cookie Policy as our use of cookies changes. The "Updated" date at the
      top reflects the latest version.
    </p>

    <h2 id="contact">13. Contact</h2>
    <p>
      Questions about cookies: <a href="mailto:dpo@renteaze.com">dpo@renteaze.com</a>.
    </p>
  </LegalPage>
);

export default Cookies;
