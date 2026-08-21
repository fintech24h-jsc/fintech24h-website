export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export const mainNavLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about/' },
  {
    label: 'Services',
    href: '/services/',
    children: [
      { label: 'KOL Marketing', href: '/services/kol-marketing/' },
      { label: 'PR Campaigns', href: '/services/pr-media/' },
      { label: 'Community Growth', href: '/services/community-growth/' },
      { label: 'Event Marketing', href: '/services/event-marketing/' },
      { label: 'AI Marketing', href: '/services/ai-marketing/' },
      { label: 'Business Development', href: '/services/business-development/' },
      { label: 'Custom Solutions', href: '/services/custom-solutions/' }
    ]
  },
  { label: 'Contact', href: '/contact/' },
  { label: 'Partnership', href: 'https://docs.google.com/forms/d/e/1FAIpQLSeOhaoV-q4dyjEgVa5fVQToKPtHyqDmKBj9fHig9bNS3JrYqw/viewform' },
  { label: 'Get Proposal', href: '/#get-proposal' }
];

export const footerLinks = {
  services: [
    { label: 'KOL Marketing', href: '/services/kol-marketing/' },
    { label: 'PR Campaigns', href: '/services/pr-media/' },
    { label: 'Community Growth', href: '/services/community-growth/' },
    { label: 'Event Marketing', href: '/services/event-marketing/' },
    { label: 'AI Marketing', href: '/services/ai-marketing/' },
    { label: 'Business Development', href: '/services/business-development/' },
    { label: 'Custom Solutions', href: '/services/custom-solutions/' }
  ],
  company: [
    { label: 'About Us', href: '/about/' },
    { label: 'Our Process', href: '/#process' },
    { label: 'Case Studies', href: '/case-studies/' },
    { label: 'Contact Sales', href: '/contact/' }
  ],
  resources: [
    { label: 'Insights Blog', href: '/blog' },
    { label: 'Careers', href: '/careers/' },
    { label: 'Media Kit', href: 'https://drive.google.com/drive/folders/1fPgwA514HzHmkBOkhh_P4QfV6lie9OUh' },
    { label: 'Partnership', href: 'https://docs.google.com/forms/d/e/1FAIpQLSeOhaoV-q4dyjEgVa5fVQToKPtHyqDmKBj9fHig9bNS3JrYqw/viewform' },
    { label: 'Marketing Proposals', href: '/#get-proposal' },
    { label: 'Book a discovery call', href: '/contact/#book-call' }
  ],
  ecosystem: [
    { label: "DealMakers' Club", href: '/dealmakers/' },
    { label: 'Coinstori', href: 'https://coinstori.com' },
    { label: 'CMO Intern', href: 'https://cmointern.com' }
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy/' },
    { label: 'Terms of Service', href: '/terms/' }
  ]
};
