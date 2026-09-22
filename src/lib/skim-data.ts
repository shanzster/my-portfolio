/* Content for the one-screen /skim page. Stored as a single Firestore doc
   (pages/skim). Tool logos and the section nav stay in code. */

export type SkimStat = { v: string; l: string };
export type SkimGraphic = { src: string; label: string };

export type SkimClient = {
  name: string;
  tag: string;
  result: string;
  to: string;
  color: string;
  logo?: string;
  overview: string;
  graphics?: SkimGraphic[];
};

export type SkimVisual = { src: string; label: string };
export type SkimResult = { v: string; l: string };
export type SkimService = { t: string; d: string };
export type SkimSocial = { h: string; link: string; color: string };
export type SkimAction = { label: string; sub: string; href: string };

export type SkimHeader = { title: string; sub: string };

export type SkimContent = {
  stats: SkimStat[];
  clients: SkimClient[];
  visuals: SkimVisual[];
  analytics: SkimVisual[];
  resultTiles: SkimResult[];
  services: SkimService[];
  socials: SkimSocial[];
  contactActions: SkimAction[];
  chrome: {
    menuName: string;
    menuSub: string;
    fullSiteLink: string;
    sectionLabels: string[];
  };
  overview: {
    name: string;
    subtitle: string;
    paragraph: string;
    toolkitLabel: string;
    /* Per-slot icon overrides for the toolkit row; "" falls back to the
       built-in logo (TOOL_LOGOS in skim.tsx, matched by position). */
    toolIcons: string[];
    toolkitExtra: string;
    availability: string;
  };
  headers: {
    work: SkimHeader;
    results: SkimHeader;
    services: SkimHeader;
    socials: SkimHeader;
    contact: SkimHeader;
  };
  recentVisualsLabel: string;
  seeServicesLink: string;
  openSocialsLink: string;
  hireButton: string;
  clientModal: {
    sampleGraphics: string;
    moreVisuals: string;
    close: string;
    fullCaseStudy: string;
  };
};

export const SKIM: SkimContent = {
  stats: [
    { v: "9", l: "brands managed" },
    { v: "5+", l: "brands built" },
    { v: "2+", l: "yrs freelancing" },
    { v: "5", l: "platforms" },
  ],
  clients: [
    {
      name: "Oaklynwear", tag: "Fashion · US", result: "Full-stack · paid + organic", to: "/work/oaklynwear", color: "oklch(0.30 0.04 250)",
      overview: "US fashion brand where I run the entire marketing side — Google Ads, Meta Ads, social, branding, and account management. One person, the full stack.",
    },
    {
      name: "Roselyn Atelier", tag: "Fashion · UK", result: "Premium editorial + performance", to: "/work/roselyn-atelier", color: "oklch(0.55 0.10 12)",
      overview: "UK fashion atelier. I keep the premium editorial look while running Google and Meta ads and daily management underneath.",
    },
    {
      name: "Lirenne Wear", tag: "Fashion · US", result: "Brand + ads, end-to-end", to: "/work/lirenne-wear", color: "oklch(0.42 0.12 262)",
      overview: "US label built from the ground up — identity and content system first, then Google and Meta ad campaigns layered on top.",
    },
    {
      name: "Bella Monza", tag: "Fashion", result: "Fast creative, one identity", to: "/work/bella-monza", color: "oklch(0.48 0.16 350)",
      overview: "Fashion store where I own the whole stack — fast weekly creative held together by one consistent identity across every drop.",
    },
    {
      name: "Nova Noir", tag: "Fashion · US", result: "Full stack + Shopify", to: "/work/novanoir", color: "oklch(0.28 0.03 285)",
      overview: "Dark, modern US fashion brand. I run the full marketing stack plus the Shopify store (novanoir.com) as one connected system.",
    },
    {
      name: "StealandStyle", tag: "Fashion · IG", result: "IG content system", to: "/work/stealandstyle", color: "oklch(0.50 0.16 320)",
      overview: "Fashion-focused Instagram brand — content design, short-form video, and community, run to a consistent visual system.",
      graphics: [
        { src: "/Graphics/OverallBrandBoard.png", label: "Brand board" },
        { src: "/Graphics/01_Collection3_Cover1.png", label: "Collection cover" },
        { src: "/Graphics/COLLECTION2_CH-01.png", label: "Collection graphic" },
        { src: "/Campaigns/stealandstyle_Analytics_Screenshot.png", label: "Analytics" },
        { src: "/Campaigns/stealandstyle_ContentCalendar.png", label: "Content calendar" },
      ],
    },
    {
      name: "Masinloc Tourism", tag: "Strategy · FB", result: "↑ revenue & tourism", to: "/work/masinloc-tourism", color: "oklch(0.58 0.14 200)", logo: "/MasinlocTourism/logo.jpg",
      overview: "Official tourism page. As Creative Strategist I pitched campaigns like the Joiners Program and built a visual system that drove real tourism.",
      graphics: [
        { src: "/MasinlocTourism/BrandKit.jpg", label: "Brand kit" },
        { src: "/MasinlocTourism/Poster-1.png", label: "Event poster" },
        { src: "/MasinlocTourism/Poster-2.png", label: "Event poster" },
        { src: "/MasinlocTourism/Poster-3.png", label: "Event poster" },
      ],
    },
    {
      name: "Fast Snaking", tag: "Service · FB", result: "3–5 calls/week · organic", to: "/work/fast-snaking", color: "oklch(0.55 0.14 25)", logo: "/FastToiletSnaking/logo.png",
      overview: "Philadelphia plumbing brand built from a single DM — identity, Facebook page, content system, and management, all from zero.",
      graphics: [
        { src: "/FastToiletSnaking/OnboardingPost.png", label: "Onboarding post" },
        { src: "/FastToiletSnaking/WeExistPost.png", label: "Launch post" },
        { src: "/FastToiletSnaking/educationPost.png", label: "Education post" },
        { src: "/FastToiletSnaking/CalltoActionPost.png", label: "CTA post" },
        { src: "/FastToiletSnaking/analytics.png", label: "Analytics" },
        { src: "/FastToiletSnaking/contentcalendar.png", label: "Content calendar" },
      ],
    },
    {
      name: "The Snappy Nomad", tag: "Brand · Soon", result: "Pre-launch brand", to: "/work/snappy-nomad", color: "oklch(0.62 0.16 255)",
      overview: "My own travel camera brand — branding, positioning, and launch planning, built end-to-end. Currently in pre-launch.",
    },
  ],
  visuals: [
    { src: "/Graphics/OverallBrandBoard.png", label: "Brand board" },
    { src: "/Graphics/01_Collection3_Cover1.png", label: "Collection cover" },
    { src: "/Graphics/COLLECTION2_CH-01.png", label: "Collection graphic" },
    { src: "/MasinlocTourism/BrandKit.jpg", label: "Masinloc brand kit" },
    { src: "/MasinlocTourism/Poster-1.png", label: "Event poster" },
    { src: "/FastToiletSnaking/OnboardingPost.png", label: "Onboarding post" },
  ],
  analytics: [
    { src: "/Campaigns/fastsanking_analytics.png", label: "Fast Snaking — Reach & analytics" },
    { src: "/Campaigns/fastsanking_contentcalendar.png", label: "Fast Snaking — Content calendar" },
    { src: "/Campaigns/stealandstyle_Analytics_Screenshot.png", label: "StealandStyle — Analytics" },
    { src: "/Campaigns/stealandstyle_ContentCalendar.png", label: "StealandStyle — Content calendar" },
    { src: "/Campaigns/PSG_Analytics.png", label: "PSG — Analytics" },
    { src: "/Campaigns/PSG_ContentCalendar.png", label: "PSG — Content calendar" },
  ],
  resultTiles: [
    { v: "3–5", l: "calls / week — Fast Snaking, organic" },
    { v: "↑", l: "revenue & tourism — Masinloc" },
    { v: "0→1", l: "brands built from zero" },
  ],
  services: [
    { t: "Social Media Management", d: "Pages handled end-to-end." },
    { t: "Brand Identity", d: "Logos, colors, systems from scratch." },
    { t: "Content Strategy", d: "A plan that makes every post intentional." },
    { t: "Video & Reels", d: "Edits that earn replays." },
    { t: "Paid Ads (Meta + Google)", d: "Campaigns that reach and convert." },
    { t: "Content Package", d: "Graphics, captions, calendar in one." },
    { t: "Shopify Store Editing", d: "Conversion-ready storefronts." },
    { t: "Email Marketing", d: "Klaviyo flows & campaigns on autopilot." },
    { t: "AI Content & Image Gen", d: "On-brand visuals without a shoot." },
  ],
  socials: [
    { h: "@oaklynwear", link: "https://instagram.com/oaklynwear", color: "oklch(0.30 0.04 250)" },
    { h: "@roselynamatelier", link: "https://instagram.com/roselynamatelier", color: "oklch(0.55 0.10 12)" },
    { h: "@lirennewear", link: "https://instagram.com/lirennewear", color: "oklch(0.42 0.12 262)" },
    { h: "@bellamonza", link: "https://instagram.com/bellamonza", color: "oklch(0.48 0.16 350)" },
    { h: "@novanoir.us", link: "https://instagram.com/novanoir.us", color: "oklch(0.28 0.03 285)" },
    { h: "@stealandstyle", link: "https://instagram.com/stealandstyle", color: "oklch(0.50 0.16 320)" },
  ],
  contactActions: [
    { label: "Email me", sub: "seanthetechyyy@gmail.com", href: "mailto:seanthetechyyy@gmail.com" },
    { label: "Download CV", sub: "PDF", href: "/ALARCON_SA_CV_MVA.pdf" },
    { label: "Instagram", sub: "@shanzster.zip", href: "https://instagram.com/shanzster.zip" },
  ],
  chrome: {
    menuName: "Shanzster",
    menuSub: "— skim view",
    fullSiteLink: "Full site ↗",
    sectionLabels: ["Overview", "Work", "Results", "Services", "Socials", "Contact"],
  },
  overview: {
    name: "Shanzster",
    subtitle: "Social Media Manager · Creative Developer · Subic Bay, PH",
    paragraph:
      "I run the full marketing stack for business owners who don't want to deal with marketing — or don't have time for it. Google Ads, Meta Ads, content, branding, Shopify, and email. I understand the whole store funnel, start to end.",
    toolkitLabel: "Toolkit",
    toolIcons: ["", "", "", "", ""],
    toolkitExtra: "+ Klaviyo · Shopify · Notion · AI",
    availability: "Available for new clients — 2026",
  },
  headers: {
    work: { title: "Selected work", sub: "9 brands — tap for overview & graphics" },
    results: { title: "Results & analytics", sub: "Real screenshots — tap to enlarge" },
    services: { title: "Services", sub: "Pick a service, or mix and match" },
    socials: { title: "Socials", sub: "The accounts I run" },
    contact: { title: "Let's work together", sub: "Taking on new clients for 2026" },
  },
  recentVisualsLabel: "Recent visuals",
  seeServicesLink: "See full services →",
  openSocialsLink: "Open socials wall →",
  hireButton: "Hire me →",
  clientModal: {
    sampleGraphics: "Sample graphics",
    moreVisuals: "More visuals in the full case study.",
    close: "Close",
    fullCaseStudy: "Full case study →",
  },
};
