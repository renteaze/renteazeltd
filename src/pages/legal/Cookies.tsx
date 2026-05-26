import LegalPage from "@/components/legal/LegalPage";

const Cookies = () => (
  <LegalPage
    title="Cookie Policy"
    description="How and why Renteaze uses cookies and similar technologies on our website and product."
  >
    <h2>1. What Are Cookies?</h2>
    <p>
      Cookies are small text files placed on your device by websites you visit. They help sites
      function, remember preferences, and measure usage.
    </p>

    <h2>2. Categories We Use</h2>
    <ul>
      <li>
        <strong>Strictly necessary:</strong> required for sign-in, session security, and core
        platform functionality. Cannot be disabled.
      </li>
      <li>
        <strong>Functional:</strong> remember preferences such as language and saved filters.
      </li>
      <li>
        <strong>Analytics:</strong> measure traffic, page performance, and feature usage so we can
        improve the product.
      </li>
      <li>
        <strong>Marketing:</strong> used (with your consent) to measure campaign performance and to
        show relevant Renteaze content on other platforms.
      </li>
    </ul>

    <h2>3. Managing Cookies</h2>
    <p>
      You can manage non-essential cookies via your browser settings. Disabling certain cookies may
      affect site functionality.
    </p>

    <h2>4. Third-Party Cookies</h2>
    <p>
      We may use third-party providers (analytics, advertising, payments) that set their own
      cookies. Their use of data is governed by their own policies.
    </p>

    <h2>5. Updates</h2>
    <p>This Cookie Policy may be updated as our use of cookies changes.</p>
  </LegalPage>
);

export default Cookies;
