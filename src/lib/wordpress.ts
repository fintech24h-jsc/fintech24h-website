// src/lib/wordpress.ts
// WordPress Headless API Client
// WP runs in background at fintech24h.com/wp-json/

const WP_API_BASE = (import.meta.env.WP_API_URL || 'https://fintech24h.com/wp-json/wp/v2').replace(/\/$/, '');

// ─── Types ───────────────────────────────────────────────────────────────────

export interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  modified: string;
  featured_media: number;
  categories: number[];
  tags: number[];
  acf?: Record<string, any>;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
      media_details: { width: number; height: number };
    }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

export interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  acf?: Record<string, any>;
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  description: string;
}

export interface CaseStudy extends WPPost {
  acf: {
    client_name: string;
    client_logo: string;
    industry: string;
    challenge: string;
    solution: string;
    result_roi: string;
    result_reach: string;
    result_leads: string;
    result_timeline: string;
    testimonial_quote: string;
    testimonial_author: string;
    testimonial_role: string;
    services_used: string[];
    featured: boolean;
  };
}

// ─── Local Mock Data Fallbacks ───────────────────────────────────────────────

const MOCK_CATEGORIES: WPCategory[] = [
  { id: 1, name: 'Marketing', slug: 'marketing', count: 4, description: 'Growth strategies, social campaigns, and brand awareness.' },
  { id: 2, name: 'SEO & Content', slug: 'seo-content', count: 3, description: 'Technical SEO guides and content layout architectures.' },
  { id: 3, name: 'Web3 & Tech', slug: 'web3-tech', count: 2, description: 'Smart contract launch tactics and on-chain growth.' }
];

const MOCK_POSTS: WPPost[] = [
  {
    id: 101,
    slug: 'launch-web3-community-2026',
    title: { rendered: 'How to Launch a Successful Web3 Community in 2026' },
    excerpt: { rendered: 'Learn the exact 4-step framework to scale your Telegram and Discord channels with active, high-intent crypto investors.' },
    content: { rendered: '<p>Building a Web3 community is no longer just about buying members. In 2026, the metrics that matter are daily active discussions, referral multipliers, and member product-knowledge levels.</p><h2>Step 1: Incentivize Value, Not Just Actions</h2><p>Avoid plain referral spam. Reward users who answer other members technical questions, create quality memes, and participate in core governance votes.</p><h2>Step 2: Automate Security</h2><p>Bot protection is critical. Deploy customized captcha walls and scam-filtering scripts to ensure your community is free from malicious links.</p>' },
    date: '2026-05-15T08:00:00Z',
    modified: '2026-05-15T08:00:00Z',
    featured_media: 1,
    categories: [1, 3],
    tags: [10, 11],
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=800&auto=format&fit=crop',
        alt_text: 'Web3 Community Building',
        media_details: { width: 800, height: 500 }
      }]
    }
  },
  {
    id: 102,
    slug: 'programmatic-seo-crypto-projects',
    title: { rendered: 'The Ultimate Guide to Programmatic SEO for Crypto Projects' },
    excerpt: { rendered: 'Discover how to generate thousands of targeted landing pages for token pairs and rankings to capture organic search traffic.' },
    content: { rendered: '<p>Programmatic SEO allows crypto products to scale their organic visibility by automatically generating pages targeting low-difficulty, high-intent keyword formulas like "How to buy [Token]" or "[Token] price prediction".</p><h2>Step 1: Set Up Your Template</h2><p>Create clean, fast-loading templates in Astro. Ensure that they inject Schema.org structures, hold dynamic price widgets, and display obvious HubSpot lead forms.</p>' },
    date: '2026-06-01T10:30:00Z',
    modified: '2026-06-01T10:30:00Z',
    featured_media: 2,
    categories: [2],
    tags: [12],
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
        alt_text: 'Programmatic SEO Dashboard',
        media_details: { width: 800, height: 500 }
      }]
    }
  },
  {
    id: 103,
    slug: 'avoid-influencer-marketing-mistakes',
    title: { rendered: '5 Mistakes to Avoid in Your Next Influencer Campaign' },
    excerpt: { rendered: 'Don’t throw budget away on fake follower counts. Read this guide to audit KOL engagement and track actual ROI.' },
    content: { rendered: '<p>Influencer marketing in crypto can deliver 10x conversions or absolute zero. The difference lies in how you vet audiences and script briefs.</p><h2>Mistake #1: Believing Follower Counts</h2><p>Always audit KOL comments. Check if discussions relate to the post content or if they are dominated by bot responses.</p>' },
    date: '2026-06-12T14:00:00Z',
    modified: '2026-06-12T14:00:00Z',
    featured_media: 3,
    categories: [1],
    tags: [10],
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
        alt_text: 'Influencer Marketing Tech',
        media_details: { width: 800, height: 500 }
      }]
    }
  },
  {
    id: 104,
    slug: 'mastering-liquid-liquidity-token-launches',
    title: { rendered: 'Mastering Liquid Liquidity: Defi Token Launch playbooks' },
    excerpt: { rendered: 'A deep dive into automated market maker algorithms, liquidity pool sizing, and post-launch stability design.' },
    content: { rendered: '<p>Launching a token requires a mathematically sound liquidity seeding plan. This article breaks down liquidity pools, slip rates, and arbitrage protection guides.</p>' },
    date: '2026-06-18T09:15:00Z',
    modified: '2026-06-18T09:15:00Z',
    featured_media: 4,
    categories: [3],
    tags: [11],
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=800&auto=format&fit=crop',
        alt_text: 'DeFi Liquidity Pools',
        media_details: { width: 800, height: 500 }
      }]
    }
  },
  {
    id: 105,
    slug: 'ai-marketing-bots-crypto-seeding',
    title: { rendered: 'AI Marketing Bots: The Future of Crypto Project Seeding' },
    excerpt: { rendered: 'How automation scripts and AI agents are revolutionizing targeted project outreach and multi-channel organic seeding.' },
    content: { rendered: '<p>AI bots are replacing manual telegram and twitter seeding tasks. Discover how to deploy natural-language marketing agents on scale securely.</p>' },
    date: '2026-06-22T11:45:00Z',
    modified: '2026-06-22T11:45:00Z',
    featured_media: 5,
    categories: [1, 3],
    tags: [10],
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
        alt_text: 'AI Bots and Seeding',
        media_details: { width: 800, height: 500 }
      }]
    }
  },
  {
    id: 106,
    slug: 'global-web3-regulatory-marketing-policies',
    title: { rendered: 'Navigating Global Web3 Regulatory Marketing Policies' },
    excerpt: { rendered: 'Ensure compliance while running promotions across the EU, US, and APAC markets. A playbook for compliance officers.' },
    content: { rendered: '<p>Marketing crypto is subject to shifting regulatory boundaries. Protect your brand by learning rules regarding financial promotion waivers and disclosures.</p>' },
    date: '2026-06-26T16:20:00Z',
    modified: '2026-06-26T16:20:00Z',
    featured_media: 6,
    categories: [2],
    tags: [12],
    _embedded: {
      'wp:featuredmedia': [{
        source_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=800&auto=format&fit=crop',
        alt_text: 'Compliance Regulation Desk',
        media_details: { width: 800, height: 500 }
      }]
    }
  }
];

const MOCK_CASE_STUDIES: CaseStudy[] = [
  {
    id: 201,
    slug: 'avalanche-growth-campaign',
    title: { rendered: 'Avalanche Ecosystem Regional Growth Campaign' },
    excerpt: { rendered: 'How Fintech24h onboarded 30,000+ local builders and investors across Vietnam and Singapore within 60 days.' },
    content: { rendered: '<p>We designed a customized localized campaign utilizing a hybrid framework: regional Web3 KOLs, focused community AMAs, and interactive builder meetups.</p>' },
    date: '2026-04-10T09:00:00Z',
    modified: '2026-04-10T09:00:00Z',
    featured_media: 4,
    categories: [1],
    tags: [20],
    acf: {
      client_name: 'Avalanche Ecosystem',
      client_logo: '',
      industry: 'Layer 1 Blockchain',
      challenge: 'Low regional awareness and developer friction in Southeast Asian developer hub markets.',
      solution: 'Deployed 15 vetted local developer KOLs, organized regional AMA tours, and built a dedicated Vietnamese community hub.',
      result_roi: '45x ROI',
      result_reach: '1.2M Reach',
      result_leads: '3,200 Developers',
      result_timeline: '60 Days',
      testimonial_quote: 'Fintech24h executed our regional rollout flawlessly. Their developer relations network is top tier.',
      testimonial_author: 'Sarah Chen',
      testimonial_role: 'APAC Growth Director',
      services_used: ['KOL & Influencer Marketing', 'Community Management'],
      featured: true
    }
  },
  {
    id: 202,
    slug: 'aptos-community-scaling',
    title: { rendered: 'Aptos Community Acceleration Campaign' },
    excerpt: { rendered: 'Scaling active community users by 250% using gamified Quest campaigns and 24/7 security moderation.' },
    content: { rendered: '<p>By setting up structured task boards and integrating security protocols, we built a highly active hub of Aptos enthusiasts.</p>' },
    date: '2026-05-02T11:00:00Z',
    modified: '2026-05-02T11:00:00Z',
    featured_media: 5,
    categories: [1, 3],
    tags: [21],
    acf: {
      client_name: 'Aptos Hub',
      client_logo: '',
      industry: 'L1 Ecosystem Partners',
      challenge: 'Inundation of sybil bots and declining active user engagement indices.',
      solution: 'Setup strict Anti-Spam moderator bots alongside 24/7 coverage. Implemented gamified weekly Zealy quests.',
      result_roi: '28x ROI',
      result_reach: '850K Reach',
      result_leads: '15,000 active users',
      result_timeline: '45 Days',
      testimonial_quote: 'The level of spam reduction and user retention achieved by their moderators was outstanding.',
      testimonial_author: 'Marcus Aurel',
      testimonial_role: 'Operations Lead',
      services_used: ['Community Management', 'Growth & Airdrop Campaigns'],
      featured: false
    }
  }
];

// ─── Fetch Helpers ────────────────────────────────────────────────────────────

async function fetchWP<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${WP_API_BASE}${endpoint}`);
  url.searchParams.set('_embed', '1');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    // ISR: cache 1 hour, auto-revalidate
    // @ts-ignore
    cf: { cacheTtl: 3600, cacheEverything: true },
  });

  if (!res.ok) throw new Error(`WP API Error ${res.status}: ${endpoint}`);
  return res.json() as Promise<T>;
}

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export async function getAllPosts(page = 1, perPage = 12): Promise<WPPost[]> {
  try {
    return await fetchWP<WPPost[]>('/posts', {
      page: String(page),
      per_page: String(perPage),
      status: 'publish',
      orderby: 'date',
      order: 'desc',
    });
  } catch (err) {
    console.warn('WP API fail: returning mock posts.');
    return MOCK_POSTS.slice((page - 1) * perPage, page * perPage);
  }
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  try {
    const posts = await fetchWP<WPPost[]>('/posts', { slug, status: 'publish' });
    return posts[0] || null;
  } catch (err) {
    console.warn(`WP API fail: searching mock posts for slug: ${slug}`);
    return MOCK_POSTS.find(p => p.slug === slug) || null;
  }
}

export async function getPostsByCategory(categorySlug: string, perPage = 12): Promise<WPPost[]> {
  try {
    const categories = await fetchWP<WPCategory[]>('/categories', { slug: categorySlug });
    if (!categories[0]) return [];
    return await fetchWP<WPPost[]>('/posts', {
      categories: String(categories[0].id),
      per_page: String(perPage),
      status: 'publish',
    });
  } catch (err) {
    console.warn(`WP API fail: returning mock posts for category slug: ${categorySlug}`);
    const cat = MOCK_CATEGORIES.find(c => c.slug === categorySlug);
    if (!cat) return [];
    return MOCK_POSTS.filter(p => p.categories.includes(cat.id)).slice(0, perPage);
  }
}

export async function getRecentPosts(count = 3): Promise<WPPost[]> {
  try {
    return await fetchWP<WPPost[]>('/posts', {
      per_page: String(count),
      status: 'publish',
      orderby: 'date',
      order: 'desc',
    });
  } catch (err) {
    console.warn('WP API fail: returning recent mock posts.');
    return MOCK_POSTS.slice(0, count);
  }
}

// ─── Case Studies (Custom Post Type) ─────────────────────────────────────────

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  try {
    return await fetchWP<CaseStudy[]>('/case-study', {
      per_page: '100',
      status: 'publish',
      orderby: 'date',
      order: 'desc',
    });
  } catch (err) {
    console.warn('WP API fail: returning mock case studies.');
    return MOCK_CASE_STUDIES;
  }
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  try {
    const items = await fetchWP<CaseStudy[]>('/case-study', { slug, status: 'publish' });
    return items[0] || null;
  } catch (err) {
    console.warn(`WP API fail: searching mock case studies for slug: ${slug}`);
    return MOCK_CASE_STUDIES.find(cs => cs.slug === slug) || null;
  }
}

export async function getFeaturedCaseStudy(): Promise<CaseStudy | null> {
  try {
    const items = await getAllCaseStudies();
    return items.find((cs) => cs.acf?.featured) || items[0] || null;
  } catch (err) {
    console.warn('WP API fail: returning featured mock case study.');
    return MOCK_CASE_STUDIES.find(cs => cs.acf?.featured) || MOCK_CASE_STUDIES[0] || null;
  }
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<WPCategory[]> {
  try {
    return await fetchWP<WPCategory[]>('/categories', { per_page: '100', hide_empty: 'true' });
  } catch (err) {
    console.warn('WP API fail: returning mock categories.');
    return MOCK_CATEGORIES;
  }
}

// ─── Utility: Strip HTML ─────────────────────────────────────────────────────

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
}

export function getExcerpt(post: WPPost, maxLength = 160): string {
  const text = stripHtml(post.excerpt.rendered || post.content.rendered);
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

export function getFeaturedImage(post: WPPost): { url: string; alt: string } {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  return {
    url: media?.source_url || '/images/default-og.jpg',
    alt: media?.alt_text || stripHtml(post.title.rendered),
  };
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}
