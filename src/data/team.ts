export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
  twitter?: string;
}

export const team: TeamMember[] = [
  {
    name: 'Jules Nguyen',
    role: 'Founder & CEO',
    bio: 'Ex-CMO of a tier-1 Web3 Launchpad. 8+ years scaling fintech and blockchain platforms across Southeast Asia and UAE.',
    image: '/images/team/jules-nguyen.jpg',
    linkedin: 'https://linkedin.com/company/fintech24h',
    twitter: 'https://x.com/fintech24h_com'
  },
  {
    name: 'Sarah Chen',
    role: 'Partner & COO',
    bio: 'Specializes in operations, compliance, and B2B partnerships. Managed liquidity relations for top token projects.',
    image: '/images/team/sarah-chen.jpg',
    linkedin: 'https://linkedin.com/company/fintech24h'
  },
  {
    name: 'Marcus Vasseur',
    role: 'Head of Growth Hacking',
    bio: 'Growth lead with expertise in viral loop design, programmatic SEO, and quantitative user acquisition strategies.',
    image: '/images/team/marcus-vasseur.jpg',
    linkedin: 'https://linkedin.com/company/fintech24h',
    twitter: 'https://x.com/fintech24h_com'
  },
  {
    name: 'Anh Pham',
    role: 'Lead Community Strategist',
    bio: 'Runs global moderation frameworks. Designed and executed campaigns spanning 200,000+ members on Discord.',
    image: '/images/team/anh-pham.jpg',
    linkedin: 'https://linkedin.com/company/fintech24h'
  },
  {
    name: 'Devon Patel',
    role: 'Head of Business Development',
    bio: 'Ex-Exchange Listing Director. Built relationships with launchpads, VCs, and market makers internationally.',
    image: '/images/team/devon-patel.jpg',
    linkedin: 'https://linkedin.com/company/fintech24h'
  }
];

export const advisors: TeamMember[] = [
  {
    name: 'Dr. Michael Sterling',
    role: 'Tokenomics Advisor',
    bio: 'Economist advising Tier-1 Layer-1 blockchains on token economics, inflation dampening, and staking structures.',
    image: '/images/team/advisor-michael.jpg',
    linkedin: 'https://linkedin.com/company/fintech24h'
  },
  {
    name: 'Kenji Sato',
    role: 'Strategic Investor Relations',
    bio: 'Managing Partner at a Tokyo-based Web3 VC fund. Mentors early-stage projects on institutional pitching.',
    image: '/images/team/advisor-kenji.jpg',
    linkedin: 'https://linkedin.com/company/fintech24h'
  }
];
