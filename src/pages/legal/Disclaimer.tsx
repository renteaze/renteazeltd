import LegalPage from "@/components/legal/LegalPage";

const Disclaimer = () => (
  <LegalPage
    title="Investment &amp; Financial Disclaimer"
    description="Important risk information for investors and users of Renteaze financial products."
  >
    <h2>1. Not Financial Advice</h2>
    <p>
      Information presented on Renteaze — including property listings, market commentary, projected
      yields, and investment opportunities — is provided for informational purposes only and does
      not constitute financial, legal, tax, or investment advice. Consult a licensed professional
      before making investment decisions.
    </p>

    <h2>2. No Guaranteed Returns</h2>
    <p>
      Real estate investments carry risk. Where projected returns, rental yields, or capital
      appreciation are shown, they are estimates based on stated assumptions. <strong>Actual
      returns may differ materially and Renteaze does not guarantee any specific outcome</strong>{" "}
      unless explicitly stated in a separate signed product agreement (for example, a guaranteed-rent
      management contract).
    </p>

    <h2>3. Liquidity Risk</h2>
    <p>
      Property and property-backed investments are typically illiquid. You may not be able to exit
      an investment quickly or at the price you expect.
    </p>

    <h2>4. Market &amp; Macroeconomic Risk</h2>
    <p>
      Performance can be affected by interest rates, currency movements (particularly relevant for
      diaspora investors), regulatory changes, and broader market conditions.
    </p>

    <h2>5. Save for Rent &amp; Loan for Rent</h2>
    <p>
      Savings contributions accumulate toward rent and are subject to product-specific terms,
      including timing of disbursement to landlords. Loans are subject to credit assessment, fees,
      and interest as disclosed at application.
    </p>

    <h2>6. Diaspora Investors</h2>
    <p>
      Investing from outside Nigeria involves foreign-exchange and repatriation considerations. Seek
      independent advice on cross-border tax and capital-control implications.
    </p>

    <h2>7. Past Performance</h2>
    <p>Past performance of any property, fund, or strategy is not indicative of future results.</p>

    <h2>8. Limitation</h2>
    <p>
      Renteaze and its affiliates accept no liability for losses arising from reliance on
      informational content. Specific product terms always govern over general marketing language.
    </p>
  </LegalPage>
);

export default Disclaimer;
