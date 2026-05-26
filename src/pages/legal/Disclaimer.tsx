import LegalPage from "@/components/legal/LegalPage";

const toc = [
  { id: "purpose", label: "1. Purpose" },
  { id: "no-advice", label: "2. Not investment advice" },
  { id: "risk", label: "3. Investment risk" },
  { id: "specific", label: "4. Specific risks" },
  { id: "past", label: "5. Past performance" },
  { id: "forward", label: "6. Forward-looking statements" },
  { id: "suitability", label: "7. Suitability" },
  { id: "jurisdiction", label: "8. Jurisdictional restrictions" },
  { id: "regulation", label: "9. Regulatory status" },
  { id: "tax", label: "10. Tax" },
  { id: "third-party", label: "11. Third-party content" },
  { id: "contact", label: "12. Contact" },
];

const Disclaimer = () => (
  <LegalPage
    title="Investment & Financial Disclaimer"
    description="Important information about the risks of using Renteaze investment and financial products."
    effectiveDate="16 May 2026"
    version="2.0"
    tableOfContents={toc}
  >
    <h2 id="purpose">1. Purpose of this disclaimer</h2>
    <p>
      This Disclaimer applies to all financial and investment-related information published by
      Renteaze, including content on the website, dashboards, marketing emails, social-media
      channels, and webinars. It supplements — and does not replace — the deal-specific
      documentation provided for each opportunity.
    </p>

    <h2 id="no-advice">2. Not investment, legal, or tax advice</h2>
    <p>
      Information on the Services is for general information only and does not constitute
      investment, legal, accounting, or tax advice and is not a personal recommendation,
      solicitation, or offer to buy or sell any security. You should consult an appropriately
      licensed adviser before making any investment decision.
    </p>

    <h2 id="risk">3. Investment risk</h2>
    <p>
      <strong>All investments carry risk, including the risk of losing some or all of your
      capital.</strong> The value of investments and any income from them can fall as well as
      rise and is not guaranteed.
    </p>

    <h2 id="specific">4. Specific risks</h2>
    <ul>
      <li><strong>Liquidity:</strong> property-backed and private-market investments are typically illiquid; you may not be able to sell when you want to or at the price you want.</li>
      <li><strong>Market & valuation:</strong> property values fluctuate with macro-economic conditions, interest rates, and local demand.</li>
      <li><strong>Credit:</strong> tenant defaults, counterparty failure, or developer insolvency can reduce or eliminate returns.</li>
      <li><strong>Currency / FX:</strong> returns may be affected by the exchange rate between the Naira and your home currency.</li>
      <li><strong>Regulatory:</strong> changes in law or regulatory policy may affect the availability, structure, or profitability of an investment.</li>
      <li><strong>Concentration:</strong> investing a large portion of your portfolio in a single property, sector, or geography increases risk.</li>
      <li><strong>Operational:</strong> technology, custody, or service-provider failures may delay or disrupt transactions.</li>
    </ul>

    <h2 id="past">5. Past performance</h2>
    <p>
      Past performance is not a reliable indicator of future results. Any projections, targets,
      or examples shown are illustrative only, are not guaranteed, and may not be achieved.
    </p>

    <h2 id="forward">6. Forward-looking statements</h2>
    <p>
      Statements about future plans, returns, or market conditions are forward-looking. They
      involve risks and uncertainties and actual results may differ materially. Renteaze does not
      undertake to update forward-looking statements except as required by law.
    </p>

    <h2 id="suitability">7. Suitability</h2>
    <p>
      You are responsible for determining whether any investment is suitable for your
      circumstances, objectives, risk tolerance, and time horizon. Where we ask suitability
      questions, your answers must be accurate; we may refuse access to an opportunity if it is
      not appropriate for you.
    </p>

    <h2 id="jurisdiction">8. Jurisdictional restrictions</h2>
    <p>
      The Services are operated from Nigeria. Investment opportunities are not directed to, nor
      intended for distribution to or use by, any person in any jurisdiction where such
      distribution or use would be contrary to local law. In particular, opportunities are
      generally not registered under the US Securities Act of 1933 and are not being offered to
      US persons except in reliance on an available exemption.
    </p>

    <h2 id="regulation">9. Regulatory status</h2>
    <p>
      Renteaze operates in line with applicable Nigerian financial-services regulation, including
      requirements of the Securities and Exchange Commission (SEC) and the Central Bank of
      Nigeria (CBN) where relevant. We are not authorised by the UK FCA, US SEC, or EU national
      competent authorities, and opportunities are not protected by deposit-guarantee or
      investor-compensation schemes of those jurisdictions.
    </p>

    <h2 id="tax">10. Tax</h2>
    <p>
      Tax treatment depends on your individual circumstances and may change. Renteaze does not
      provide tax advice. You should seek independent tax advice in your jurisdiction.
    </p>

    <h2 id="third-party">11. Third-party content</h2>
    <p>
      The Services may include information from third parties (market data, news, valuations).
      Renteaze does not guarantee the accuracy or completeness of such information and is not
      responsible for any loss arising from reliance on it.
    </p>

    <h2 id="contact">12. Contact</h2>
    <p>
      Questions about this Disclaimer: <a href="mailto:legal@renteaze.com">legal@renteaze.com</a>.
    </p>
  </LegalPage>
);

export default Disclaimer;
