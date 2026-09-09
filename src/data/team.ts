export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  telegram: string;
  linkedin: string;
  signatureColor: string; // Gradient color for the abstract interactive orb
  image?: string; // Avatar URL
  specs?: string[]; // Operational node registry lines shown on the operator card
  mascot?: boolean; // Mascot member — keep avatar in full color and exclude from Person schema
}

export const team: TeamMember[] = [
  {
    name: 'Mr Cá',
    role: 'Chief Happiness Officer',
    bio: 'The heart of the office — keeping morale high, energy positive, and reminding everyone that great work happens when the team is happy.',
    telegram: 'https://t.me/fintech24h',
    linkedin: 'https://www.linkedin.com/company/fintech24h/',
    signatureColor: 'linear-gradient(135deg, #00c8f0 0%, #06b6d4 100%)', // Aqua Current
    image: 'https://fintech24h.com/wp-content/uploads/2026/09/CHPO-Fintech24h-Mr-Ca-Mr-Fish.jpeg',
    specs: ['Team Happiness Protocol', 'Culture & Vibe Ops', 'Daily Morale Node'],
    mascot: true
  },
  {
    name: 'Vincent Nguyen',
    role: 'Co-Founder & CEO',
    bio: 'Pioneering strategic growth architectures with 8+ years scaling high-performance blockchain operations and Web3 protocols globally.',
    telegram: 'https://telegram.me/vincentnguyen0501',
    linkedin: 'https://www.linkedin.com/in/vincentnguyen0501/',
    signatureColor: 'linear-gradient(135deg, #ff6b83 0%, #f0a278 100%)', // Solar Flare
    image: 'https://fintech24h.com/wp-content/uploads/2026/07/Vincent-300x300.png',
    specs: ['Web3 Growth Architecture', 'Global Ecosystem Seeding', 'Launchpad Advisory Node']
  },
  {
    name: 'Phat Vo',
    role: 'Co-Founder & CPO',
    bio: 'Designing cutting-edge user interfaces and technical protocols, aligning user-centric UX systems with next-generation Web3 engines.',
    telegram: 'https://telegram.me/phatvt',
    linkedin: 'https://www.linkedin.com/in/phatvt/',
    signatureColor: 'linear-gradient(135deg, #00c8f0 0%, #7c5cfc 100%)', // Cyber Glow
    image: 'https://fintech24h.com/wp-content/uploads/2026/07/Phat-vo-300x300.png',
    specs: ['Advanced UI/UX Protocols', 'Web3 Client Integrations', 'Front-end Architecture']
  },
  {
    name: 'JayC',
    role: 'Head of CM',
    bio: 'Architecting viral marketing loops, orchestrating large-scale global community frameworks, and building active player/investor engagement networks.',
    telegram: 'https://telegram.me/Fintech24hIJAYC',
    linkedin: 'https://www.linkedin.com/in/jayc24h/',
    signatureColor: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', // Hyper Aura
    image: 'https://fintech24h.com/wp-content/uploads/2026/07/JayC-300x300.png',
    specs: ['Community Infrastructure', 'Interactive Campaign Design', 'Multi-channel Moderation']
  },
  {
    name: 'Gemi',
    role: 'Global Business Development',
    bio: 'Driving cross-border collaborations, facilitating venture integrations, and connecting strategic capital partners with emerging developer nodes.',
    telegram: 'https://telegram.me/qviet0706',
    linkedin: 'https://www.linkedin.com/in/quangviet0706/',
    signatureColor: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', // Mint Nebula
    image: 'https://fintech24h.com/wp-content/uploads/2026/07/Gemi-300x300.png',
    specs: ['Strategic Capital Matchmaking', 'CEX/DEX Integrations', 'Global BD Pipeline']
  }
];

export const advisors: TeamMember[] = [];

