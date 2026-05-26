export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  audience: "Tenants" | "Landlords" | "Investors" | "Market Insights" | "PropTech";
  date: string;
  readTime: string;
  author: string;
  image: string;
  content: string; // simple HTML / paragraphs
}

export const blogPosts: BlogPost[] = [
  {
    slug: "tenant-rights-lagos",
    title: "Understanding Your Rights as a Tenant in Lagos",
    excerpt: "Know your legal protections under Nigerian tenancy law — from rent receipts to eviction procedures.",
    category: "Tenants",
    audience: "Tenants",
    date: "2024-12-15",
    readTime: "5 min",
    author: "Funke Adesanya",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
    content: `<p>If you rent in Lagos, the Lagos State Tenancy Law 2011 sets out exactly what you and your landlord can — and can't — do. Knowing the basics protects you from agents who invent rules and landlords who shortcut the process.</p>

<h2>Your right to a written tenancy agreement</h2>
<p>Every tenancy must be backed by a written agreement that clearly states the rent, the duration, the obligations of both parties, and any deposit terms. Verbal agreements are difficult to enforce. Always insist on a signed document — and read it before paying anything.</p>

<h2>Your right to a rent receipt</h2>
<p>You are entitled to a written, dated receipt for every payment, including agency and legal fees. The receipt must state what the payment is for. Keep every receipt — they are your strongest evidence in any dispute.</p>

<h2>Your right to quiet enjoyment</h2>
<p>Once you have paid your rent, your landlord cannot enter the property without reasonable notice, change the locks, cut off utilities, or harass you to leave.</p>

<h2>Your right to proper notice before eviction</h2>
<p>Landlords cannot evict tenants by force. They must serve a statutory notice (the length depends on your tenancy: monthly, quarterly, yearly), then a 7-day owner's notice, and finally obtain a court order if you do not vacate.</p>

<h2>What to do if your rights are breached</h2>
<p>Document everything in writing. Reach out to the Lagos State Real Estate Regulatory Authority (LASRERA) or a tenancy lawyer early. Renteaze tenants get free legal guidance through our partner network — talk to your account manager.</p>`,
  },
  {
    slug: "landlord-rental-income",
    title: "5 Ways to Maximize Your Rental Income in 2026",
    excerpt: "Strategic tips for landlords looking to increase property returns while minimizing vacancies.",
    category: "Landlords",
    audience: "Landlords",
    date: "2024-12-10",
    readTime: "7 min",
    author: "Adaeze Nwosu",
    image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200&q=80",
    content: `<p>The Lagos rental market is competitive, but well-positioned landlords are still earning above-average yields. Here are five practical levers that move the needle in 2026.</p>

<h2>1. Price for the market, not for the mortgage</h2>
<p>Rent that is too high turns into a vacancy. A vacant unit at ₦5M costs you more than an occupied one at ₦4.2M. Benchmark against three comparable properties on the same street before setting price.</p>

<h2>2. Offer monthly or quarterly payment options</h2>
<p>Most Lagos professionals can comfortably pay monthly but struggle with annual lump sums. Renteaze's Guaranteed Rent Support means you collect annually while your tenant pays monthly — best of both worlds.</p>

<h2>3. Invest in 24-hour power and water</h2>
<p>Inverters, solar, and reliable boreholes consistently lift rents by 10–20% and dramatically reduce tenant turnover.</p>

<h2>4. Screen tenants properly</h2>
<p>A bad tenant costs more than six months of vacancy. Verify employment, NIN, and references before signing.</p>

<h2>5. Outsource management</h2>
<p>Landlords managing their own properties consistently lose 15–20% of potential income to delayed collection, maintenance overruns, and missed rent reviews. Professional management pays for itself.</p>`,
  },
  {
    slug: "lagos-real-estate-market",
    title: "Lagos Real Estate Market: 2026 Outlook",
    excerpt: "Analyzing trends, pricing, and opportunities in Lagos's rapidly evolving property market.",
    category: "Market Insights",
    audience: "Market Insights",
    date: "2024-12-05",
    readTime: "8 min",
    author: "Dapo Okunogbe",
    image: "https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=1200&q=80",
    content: `<p>Lagos remains the most active real estate market in West Africa. Here's what we expect across rent, sales, and short-let in 2026.</p>

<h2>Rents will continue to climb on the Island</h2>
<p>Lekki Phase 1, Ikoyi, and Victoria Island are projected to see 12–18% rent growth driven by limited new supply and continued demand from professionals and expat workers.</p>

<h2>Mainland is where the value sits</h2>
<p>Yaba, Gbagada, and Magodo offer the strongest rental yields for landlords — typically 7–9% net, vs. 4–5% on the Island.</p>

<h2>Diaspora demand is structural, not seasonal</h2>
<p>Returning and remote-investing diaspora Nigerians now account for an estimated 22% of all completed property purchases in Lagos. Expect this to grow.</p>

<h2>Short-let is normalising</h2>
<p>After regulatory clarity in 2024, short-let yields have stabilised at roughly 1.8x equivalent annual rent — strong, but no longer the gold rush it was.</p>

<h2>Risks to watch</h2>
<p>Construction costs, FX volatility, and the pace of land titling reform are the three variables to track closely.</p>`,
  },
  {
    slug: "proptech-nigeria",
    title: "How PropTech Is Transforming Nigerian Real Estate",
    excerpt: "From fintech-powered rent plans to AI property matching — technology is reshaping the industry.",
    category: "PropTech",
    audience: "PropTech",
    date: "2024-11-28",
    readTime: "6 min",
    author: "Tunde Adeyemi",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
    content: `<p>Real estate has been one of the slowest sectors to digitise in Nigeria — and that is finally changing. Three forces are at play.</p>

<h2>1. Embedded finance for rent</h2>
<p>Products like Save for Rent, Loan for Rent, and Rent-to-Own break the annual lump-sum that has been the single biggest barrier to housing access for Nigerian professionals.</p>

<h2>2. Verified, transparent listings</h2>
<p>Most Nigerian buyers and renters still discover property through informal agents. Platforms with verified title documents, real photos, and honest pricing are quickly winning trust.</p>

<h2>3. Remote-friendly investing</h2>
<p>For diaspora Nigerians, the ability to view, due-diligence, sign, and manage from abroad has unlocked a market that was previously gated by physical presence.</p>

<p>The next five years belong to platforms that combine all three.</p>`,
  },
  {
    slug: "diaspora-investment-guide",
    title: "A Diaspora Guide to Investing in Nigerian Real Estate",
    excerpt: "Everything you need to know about investing back home — from due diligence to management.",
    category: "Investors",
    audience: "Investors",
    date: "2024-11-20",
    readTime: "10 min",
    author: "Dapo Okunogbe",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    content: `<p>If you live abroad and you're thinking about buying property in Nigeria, the good news is the process is more transparent than it was a decade ago. The bad news is the old pitfalls haven't gone away. Here's a clear-eyed guide.</p>

<h2>Step 1: Decide what you want the property to do</h2>
<p>Are you buying for capital appreciation, rental yield, eventual return, or family use? The answer changes the right location entirely.</p>

<h2>Step 2: Verify the title</h2>
<p>Never wire funds before independently verifying the title at the relevant lands registry. C of O, Governor's Consent, and Registered Deed are the gold standard. "Excision in process" usually means problems.</p>

<h2>Step 3: Use a regulated, accountable manager</h2>
<p>You will not be on the ground. Pick a manager that issues monthly statements, photographs the property regularly, and is itself registered (RC number, regulator membership).</p>

<h2>Step 4: Plan for FX</h2>
<p>Returns earned in NGN need a clear plan for repatriation. Use platforms that quote both NGN and GBP/USD equivalents and that handle distributions in your preferred currency.</p>

<h2>Step 5: Start small</h2>
<p>A first joint-venture or co-investment in a managed deal is a much safer first step than a solo Banana Island purchase. Build trust, then scale.</p>`,
  },
  {
    slug: "save-for-rent-explained",
    title: "Save for Rent, Explained: The 10-Month Plan That Changes Everything",
    excerpt: "How splitting your annual rent into 10 monthly contributions ends the December scramble for good.",
    category: "Tenants",
    audience: "Tenants",
    date: "2024-11-12",
    readTime: "4 min",
    author: "Funke Adesanya",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80",
    content: `<p>The single biggest source of rent-related stress in Nigeria isn't the price — it's the timing. Annual rent due in one lump sum, every year, is a financial shock that even well-paid professionals struggle with. Save for Rent fixes that.</p>

<h2>How it works</h2>
<p>You tell us your annual rent target. We calculate 10% per month. You pay that amount into a dedicated, locked virtual account each month for 10 months. We release the full amount to your landlord on or before your rent due date.</p>

<h2>What it costs</h2>
<p>Nothing. There is no interest and no service fee on the basic plan. The discipline of locking the funds is the entire product.</p>

<h2>Who it's for</h2>
<p>Anyone with predictable monthly income and an annual lease — most Lagos professionals fit this profile.</p>

<h2>What if I'm short at the end?</h2>
<p>That's what Add-On Funds is for. We bridge the gap with a small, transparent loan — no embarrassing calls to friends or family.</p>`,
  },
];

export const featuredPosts = blogPosts.slice(0, 3);
