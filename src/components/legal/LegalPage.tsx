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

const LegalPage = ({ 
  title, 
  description, 
  lastUpdated = "16 May 2026",
  effectiveDate,
  version = "1.0",
  tableOfContents,
  children 
}: Props) => (
  <Layout>
    {/* Hero Section */}
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
          {effectiveDate && <div>Effective: <span className="font-medium">{effectiveDate}</span></div>}
          <div>Version: <span className="font-medium">{version}</span></div>
          <div>Updated: <span className="font-medium">{lastUpdated}</span></div>
        </div>
      </div>
    </section>

    {/* Main Content */}
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Table of Contents Sidebar */}
        {tableOfContents && tableOfContents.length > 0 && (
          <aside className="md:col-span-1">
            <div className="sticky top-20 bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 className="font-bold text-sm text-foreground mb-4 uppercase tracking-wide">
                Contents
              </h3>
              <nav className="space-y-2 text-sm">
                {tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-slate-600 hover:text-primary transition-colors py-1"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* Main Article */}
        <article className={`prose prose-slate max-w-none ${tableOfContents && tableOfContents.length > 0 ? 'md:col-span-3' : ''} 
          prose-headings:font-bold prose-headings:text-foreground 
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
          prose-p:text-slate-700 prose-p:leading-relaxed prose-p:my-4
          prose-li:text-slate-700
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:font-semibold prose-strong:text-foreground
          prose-code:bg-slate-100 prose-code:text-red-600 prose-code:px-2 prose-code:py-1 prose-code:rounded
          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
          prose-table:text-sm
          prose-th:bg-slate-100 prose-th:font-semibold
          prose-td:py-2 prose-td:px-4
        `}>
          {children}

          {/* Footer Section */}
          <hr className="my-12 border-slate-200" />
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-8 not-prose">
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong>Disclaimer:</strong> This document is provided for informational purposes and does 
              not constitute legal advice. For questions or concerns regarding this policy, please contact{" "}
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
        </article>
      </div>
    </section>
  </Layout>
);

export default LegalPage;
