// Shared JSON-LD builders for /services/* pages.
// Pattern taken from services/ai-marketing.astro: provider points at the
// site-wide Organization (@id from BaseLayout) and FAQ answers are plain text.

const ORGANIZATION = {
  '@type': 'Organization',
  '@id': 'https://fintech24h.com/#organization',
  name: 'Fintech24h',
  url: 'https://fintech24h.com',
  logo: 'https://fintech24h.com/wp-content/uploads/2026/07/Logo-Fintech24h.webp',
  sameAs: [
    'https://www.linkedin.com/company/fintech24h/',
    'https://www.facebook.com/fintech24hnews',
    'https://x.com/fintech24h_com',
    'https://t.me/fintech24h',
    'https://medium.com/@fintech24h',
    'https://www.instagram.com/fintech24h/'
  ]
};

// Same markets as the Organization contactPoint (VN, SG, AE, ID, TH, IN).
const AREA_SERVED = ['Vietnam', 'Singapore', 'United Arab Emirates', 'Indonesia', 'Thailand', 'India'].map(
  (name) => ({ '@type': 'Country', name })
);

export const stripTags = (html: string) => html.replace(/<[^>]+>/g, '');

export function buildServiceSchema(opts: {
  name: string;
  alternateName?: string[];
  serviceType: string;
  url: string;
  description: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    ...(opts.alternateName ? { alternateName: opts.alternateName } : {}),
    serviceType: opts.serviceType,
    url: opts.url,
    description: opts.description,
    provider: ORGANIZATION,
    areaServed: AREA_SERVED
  };
}

// Build from the same array that renders on the page, so the schema can
// never contain a question that is not visible.
export function buildFaqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: stripTags(faq.a) }
    }))
  };
}
