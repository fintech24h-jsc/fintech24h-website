export interface Job {
  id: string;
  slug: string;
  status: 'open' | 'closed';
  title: string;
  location: string;
  type: string;
  department: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
}

export const jobs: Job[] = [
  {
    id: "FI24H-JOB-001",
    slug: "content-social-media-specialist",
    status: "closed",
    title: "Content & Social Media Specialist",
    location: "Remote / Hybrid",
    type: "Full-time / Part-time",
    department: "Marketing & Content",
    about: "We are looking for a creative and detail-oriented Content & Social Media Specialist to manage content across the Fintech24h ecosystem, including Fintech24h, CMO Intern, and Coinstori.",
    responsibilities: [
      "Write and publish articles, news, and announcements.",
      "Manage content distribution across LinkedIn, X, Telegram, Facebook, and Instagram.",
      "Optimize content for SEO and audience engagement.",
      "Create social media captions and content repurposing strategies.",
      "Coordinate with design and marketing teams for campaign execution."
    ],
    requirements: [
      "Strong English writing skills.",
      "Basic understanding of SEO and social media marketing.",
      "Interest in Blockchain, Fintech, AI, Marketing, or Technology industries."
    ],
    niceToHave: [
      "Experience with AI content tools (ChatGPT, Claude, Gemini).",
      "Basic Canva or graphic design skills."
    ],
    benefits: [
      "Global projects and partners.",
      "Remote-friendly culture.",
      "Creative freedom and ownership.",
      "Career growth opportunities."
    ]
  },
  {
    id: "FI24H-JOB-002",
    slug: "community-partnership-specialist",
    status: "open",
    title: "Community & Partnership Specialist",
    location: "Remote / Hybrid",
    type: "Full-time / Part-time",
    department: "Community & BD",
    about: "We are looking for a proactive and people-oriented Community & Partnership Specialist to help grow the Fintech24h ecosystem by connecting with founders, business leaders, project teams, investors, and industry communities worldwide.",
    responsibilities: [
      "Identify and connect with potential partners, founders, and business leaders.",
      "Invite prospects to join Telegram groups, community channels, and networking discussions.",
      "Build and maintain relationships with ecosystem partners and communities.",
      "Support outreach via LinkedIn, Telegram, email, and social platforms.",
      "Coordinate community activities and campaign communications.",
      "Assist in expanding Fintech24h's global network and community presence."
    ],
    requirements: [
      "Strong English communication and networking skills.",
      "Comfortable using LinkedIn, Telegram, X, and other social platforms.",
      "Proactive, organized, and relationship-oriented.",
      "Interest in Blockchain, Fintech, AI, Startups, or Technology."
    ],
    niceToHave: [
      "Experience in Community Management, Partnerships, Customer Success, or Business Development.",
      "Existing network within Blockchain, Fintech, AI, or Startup ecosystems."
    ],
    benefits: [
      "Work with global projects and industry leaders.",
      "Remote-friendly and international environment.",
      "Empowerment culture with ownership and autonomy.",
      "Career growth and networking opportunities.",
      "Collaborative and innovation-driven team."
    ]
  }
];
