export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export const mainNavLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'KOL & Influencer Marketing', href: '/services/kol-influencer-marketing' },
      { label: 'PR & Media Coverage', href: '/services/pr-media' },
      { label: 'Community Management', href: '/services/community-management' },
      { label: 'Growth & Airdrop Campaigns', href: '/services/growth-airdrop' },
      { label: 'Business Development', href: '/services/business-development' },
      { label: 'Content Strategy & SEO', href: '/services/content-strategy-seo' },
    ]
  },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' }
];

export const footerLinks = {
  services: [
    { label: 'KOL Marketing', href: '/services/kol-influencer-marketing' },
    { label: 'PR & Press Release', href: '/services/pr-media' },
    { label: 'Community Growth', href: '/services/community-management' },
    { label: 'Viral Airdrops', href: '/services/growth-airdrop' },
    { label: 'Business Development', href: '/services/business-development' },
    { label: 'SEO & Copywriting', href: '/services/content-strategy-seo' }
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Process', href: '/#process' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Contact Sales', href: '/contact' }
  ],
  resources: [
    { label: 'Insights Blog', href: '/blog' },
    { label: 'Marketing Proposals', href: '/#get-proposal' },
    { label: 'Book a discovery call', href: '/contact#book-call' }
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' }
  ]
};
