export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  telegram: string;
  linkedin: string;
  signatureColor: string; // Gradient color for the abstract interactive orb
}

export const team: TeamMember[] = [
  {
    name: 'Vincent Nguyen',
    role: 'Co-Founder & CEO',
    bio: 'Pioneering strategic growth architectures with 8+ years scaling high-performance blockchain operations and Web3 protocols globally.',
    telegram: 'https://telegram.me/vincentnguyen0501',
    linkedin: 'https://www.linkedin.com/in/vincentnguyen0501/',
    signatureColor: 'linear-gradient(135deg, #ff6b83 0%, #f0a278 100%)' // Solar Flare
  },
  {
    name: 'Phat Vo',
    role: 'Co-Founder & CPO',
    bio: 'Designing cutting-edge user interfaces and technical protocols, aligning user-centric UX systems with next-generation Web3 engines.',
    telegram: 'https://telegram.me/phatvt',
    linkedin: 'https://www.linkedin.com/in/phatvt/',
    signatureColor: 'linear-gradient(135deg, #00c8f0 0%, #7c5cfc 100%)' // Cyber Glow
  },
  {
    name: 'JayC',
    role: 'Head of CM',
    bio: 'Architecting viral marketing loops, orchestrating large-scale global community frameworks, and building active player/investor engagement networks.',
    telegram: 'https://telegram.me/Fintech24hIJAYC',
    linkedin: 'https://www.linkedin.com/in/jayc24h/',
    signatureColor: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' // Hyper Aura
  },
  {
    name: 'Gemi',
    role: 'Global Business Development',
    bio: 'Driving cross-border collaborations, facilitating venture integrations, and connecting strategic capital partners with emerging developer nodes.',
    telegram: 'https://telegram.me/qviet0706',
    linkedin: 'https://www.linkedin.com/in/quangviet0706/',
    signatureColor: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' // Mint Nebula
  }
];

export const advisors: TeamMember[] = [];

