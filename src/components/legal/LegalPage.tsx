import { ReactNode } from "react";
import Layout from "@/components/Layout";

interface Props {
  title: string;
  description: string;
  lastUpdated?: string;
  effectiveDate?: string;
  version?: string;
  tableOfContents?: Array<{ id: string; label: string }>;
  children: ReactNode;
}

const proseClasses = `prose prose-slate max-w-none text-[15px] md:text-base
  prose-headings:font-bold prose-headings:text-foreground prose-headings:scroll-mt-24
  prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-200
  prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
  prose-p:text-slate-700 prose-p:leading-[1.75] prose-p:my-5
  prose-ul:my-5 prose-ul:space-y-2 prose-ol:my-5 prose-ol:space-y-2
  prose-li:text-slate-700 prose-li:leading-relaxed prose-li:my-1.5 marker:text-primary
  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
  prose-strong:font-semibold prose-strong:text-foreground
  prose-code:bg-slate-100 prose-code:text-red-600 prose-code:px-2 prose-code:py-1 prose-code:rounded
  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
  prose-table:text-sm prose-table:my-6 prose-table:border prose-table:border-slate-200
  prose-th:bg-slate-100 prose-th:font-semibold prose-th:text-left prose-th:p-3 prose-th:border-b prose-th:border-slate-200
  prose-td:py-2.5 prose-td:px-3 prose-td:align-top prose-td:border-b prose-td:border-slate-100
  [&_tbody_tr:nth-child(even)]:bg-slate-50/60
`;

const FooterBlock = () => (
  <>
    <hr className="my-12 border-slate-200" />
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8 not-prose">
      <p className="text-sm text-slate-700 leading-relaxed">
        <strong>Notice:</strong> This document is provided for informational purposes
        and does not constitute legal advice. For data-protection enquiries contact{" "}
        <a href="mailto:dpo@renteaze.com" className="text-primary hover:underline font-medium">
          dpo@renteaze.com
        </a>
        . For all other legal matters contact{" "}
        <a href="mailto:legal@renteaze.com" className="text-primary hover:underline font-medium">
          legal@renteaze.com
        </a>
        .
      </p>
    </div>
    <div className="text-xs text-slate-600 mt-8 pt-8 border-t border-slate-200">
      <p>
        Renteaze is operated by <strong>Renteaze International Limited</strong> (RC 1768094),
        a company registered in Nigeria and licensed to provide financial services in accordance
        with applicable regulations.
      </p>
      <p className="mt-2">
        © {new Date().getFullYear()} Renteaze International Limited. All rights reserved.
      </p>
    </div>
  </>
);

const LegalPage = ({
  title,
  description,
  lastUpdated = "16 May 2026",
  effectiveDate,
  version = "1.0",
  tableOfContents,
  children,
}: Props) => {
  const hasToc = !!tableOfContents && tableOfContents.length > 0;

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy/90 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <div className="mb-2">
            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
              LEGAL
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-4">{title}</h1>
          <p className="text-lg text-white/90 leading-relaxed mb-6 max-w-2xl">{description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-white/80">
            {effectiveDate && (
              <div>
                Effective: <span className="font-medium">{effectiveDate}</span>
              </div>
            )}
            <div>
              Version: <span className="font-medium">{version}</span>
            </div>
            <div>
              Updated: <span className="font-medium">{lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          {hasToc ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <aside className="md:col-span-1">
                <div className="sticky top-20 bg-slate-50 rounded-lg p-6 border border-slate-200">
                  <h3 className="font-bold text-sm text-foreground mb-4 uppercase tracking-wide">
                    Contents
                  </h3>
                  <nav className="space-y-1 text-sm">
                    {tableOfContents!.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block text-slate-600 hover:text-primary hover:border-primary border-l-2 border-transparent pl-3 py-1.5 transition-colors"
                      >
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
              <article className={`md:col-span-3 ${proseClasses}`}>
                {children}
                <FooterBlock />
              </article>
            </div>
          ) : (
            <article className={`mx-auto max-w-3xl md:max-w-[70ch] ${proseClasses}`}>
              {children}
              <FooterBlock />
            </article>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default LegalPage;
