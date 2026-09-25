export type ClientScreenshot = {
  src?: string;
  caption: string;
};

/* Small editable bits on the Clients page (pages/clientsMeta). */
export type ClientsMeta = {
  stats: { v: string; l: string }[];
  filters: { label: string; dot: string }[];
};

export const CLIENTS_META: ClientsMeta = {
  stats: [
    { v: "9", l: "clients" },
    { v: "100s", l: "posts published" },
    { v: "2+", l: "years freelancing" },
    { v: "5", l: "platforms" },
  ],
  filters: [
    { label: "All", dot: "oklch(0.60 0.01 240)" },
    { label: "Fashion", dot: "oklch(0.62 0.18 255)" },
    { label: "Strategy", dot: "oklch(0.58 0.14 200)" },
    { label: "Local Service", dot: "oklch(0.62 0.14 55)" },
    { label: "Personal", dot: "oklch(0.55 0.16 290)" },
  ],
};

export type Client = {
  id: string;
  name: string;
  handle: string;
  platform: string;
  category: string;
  group: string;
  description: string;
  services: string[];
  link: string;
  color: string;
  status: string;
  // Visual
  logo?: string;
  coverImg?: string;
  // Modal content
  screenshots?: ClientScreenshot[];
  interviews?: ClientScreenshot[];
  meetings?: ClientScreenshot[];
  replies?: ClientScreenshot[];
};

export const CLIENTS: Client[] = [
  {
    id: "oaklynwear",
    group: "Fashion",
    name: "Oaklynwear",
    handle: "@oaklynwear",
    platform: "Instagram · TikTok",
    category: "Fashion Brand · USA",
    description:
      "A US-based fashion brand where I run everything — Google Ads, Meta Ads, social media management, branding, and account management. Paid and organic working as one system.",
    services: ["Google Ads", "Meta Ads", "Social Media Management", "Brand Identity", "Account Management"],
    link: "https://instagram.com/oaklynwear",
    color: "oklch(0.20 0.02 240)",
    status: "Active",
  },
  {
    id: "roselyn-atelier",
    group: "Fashion",
    name: "Roselyn Atelier",
    handle: "@roselynamatelier",
    platform: "Instagram · TikTok",
    category: "Fashion Brand · UK",
    description:
      "A UK-based fashion atelier. I handle the full marketing stack — Google Ads, Meta Ads, editorial content, brand aesthetics, and daily management — keeping the premium look while the performance engine runs underneath.",
    services: ["Google Ads", "Meta Ads", "Social Media Management", "Brand Identity", "Account Management"],
    link: "https://instagram.com/roselynamatelier",
    color: "oklch(0.55 0.08 10)",
    status: "Active",
  },
  {
    id: "lirenne-wear",
    group: "Fashion",
    name: "Lirenne Wear",
    handle: "@lirennewear",
    platform: "Instagram · TikTok",
    category: "Fashion Brand · USA",
    description:
      "A US-based fashion label. I built the identity and content system from the ground up, then layered Google and Meta ad campaigns on top — the complete marketing operation, managed end-to-end.",
    services: ["Google Ads", "Meta Ads", "Social Media Management", "Brand Identity", "Account Management"],
    link: "https://instagram.com/lirennewear",
    color: "oklch(0.38 0.10 260)",
    status: "Active",
  },
  {
    id: "bella-monza",
    group: "Fashion",
    name: "Bella Monza",
    handle: "@bellamonza",
    platform: "Instagram · TikTok",
    category: "Fashion Brand",
    description:
      "A fashion store where I own the entire marketing stack — Google Ads, Meta Ads, social media management, branding, and account management. Fast creative cycles held together by a consistent identity.",
    services: ["Google Ads", "Meta Ads", "Social Media Management", "Brand Identity", "Account Management"],
    link: "https://instagram.com/bellamonza",
    color: "oklch(0.45 0.16 350)",
    status: "Active",
  },
  {
    id: "stealandstyle",
    group: "Fashion",
    name: "StealandStyle",
    handle: "@stealandstyle",
    platform: "Instagram",
    category: "Fashion Brand",
    description:
      "A fashion-focused Instagram brand. I manage its social presence end-to-end — content design, short-form video, and community — building a feed that turns style inspiration into an engaged following.",
    services: ["Social Media Management", "Content Design", "Reels & Short-form", "Community Management"],
    link: "https://instagram.com/stealandstyle",
    color: "oklch(0.50 0.16 320)",
    status: "Active",
  },
  {
    id: "novanoir",
    group: "Fashion",
    name: "Nova Noir",
    handle: "@novanoir.us",
    platform: "Instagram · TikTok",
    category: "Fashion Brand · USA",
    description:
      "A US-based fashion brand with a dark, modern aesthetic. I run the full marketing stack — Google Ads, Meta Ads, social media management, branding, and account management — as one connected system.",
    services: ["Google Ads", "Meta Ads", "Social Media Management", "Brand Identity", "Account Management"],
    link: "https://novanoir.us",
    color: "oklch(0.28 0.03 285)",
    status: "Active",
  },
  {
    id: "masinloc-tourism",
    group: "Strategy",
    name: "Masinloc Tourism Office",
    handle: "Masinloc Tourism Office",
    platform: "Facebook",
    category: "Government · Tourism",
    description:
      "The official tourism office of Masinloc, Zambales. As Creative Strategist, I shape how the municipality presents itself — campaign ideas like the Joiners Program, destination content, and a visual system that drives real tourism.",
    services: ["Creative Strategy", "Campaign Ideation", "Content Strategy", "Graphic Design"],
    link: "https://facebook.com/masinloctourismoffice",
    color: "oklch(0.58 0.14 200)",
    status: "Active",
    logo: "/MasinlocTourism/logo.jpg",
  },
  {
    id: "fast-snaking",
    group: "Local Service",
    name: "Fast Snaking Services",
    handle: "Fast Snaking Services",
    platform: "Facebook",
    category: "Local Service · USA",
    description:
      "A Philadelphia-based plumbing and drainage business built from a single DM. I created everything from scratch — brand identity, Facebook page, content system, and ongoing management.",
    services: ["Brand Identity", "Social Media Management", "Content Strategy", "Graphic Design"],
    link: "https://fastsnakingservices.vercel.app",
    color: "oklch(0.55 0.14 25)",
    status: "Active",
    logo: "/FastToiletSnaking/logo.png",
  },
  {
    id: "snappy-nomad",
    group: "Personal",
    name: "The Snappy Nomad",
    handle: "@thesnappynomad",
    platform: "Instagram · Facebook",
    category: "Travel Camera · Personal Business",
    description:
      "A personal business built around a travel camera. I run it end-to-end — branding strategy, positioning, identity, launch planning, and ongoing management of the brand and its social presence. Currently in pre-launch.",
    services: ["Branding Strategy", "Brand Identity", "Social Media Management", "Launch Planning"],
    link: "https://instagram.com/shanzster.zip",
    color: "oklch(0.62 0.16 255)",
    status: "Coming Soon",
  },
];
