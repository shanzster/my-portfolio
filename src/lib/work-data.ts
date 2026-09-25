export type WorkItem = {
  id: string;
  /* When true the project is hidden from the public site (folder cards etc.)
     but stays editable in /admin and previewable at its direct /work/{id} URL. */
  hidden?: boolean;
  title: string;
  client: string;
  tag: string;
  category: string;
  color: string;

  // Case study fields
  overview: string;
  challenge: string;
  approach: string;
  workflow: string[];
  what: string[];
  result: string;
  tools: string[];
  duration?: string;
  platform?: string;

  // Visual assets — all optional, swap placeholders for real files
  logo?: string;
  beforeImg?: string;
  afterImg?: string;
  graphics?: {
    src?: string;
    title: string;
    description: string;
    process?: string[];
    tools?: string[];
    portrait?: boolean;  // tall/vertical images — show full height in modal
  }[];
  reels?: string[];
  calendarImg?: string;
  analytics?: { label: string; value: string }[];
  analyticsImg?: string;
  gallery?: string[];
  flipbookUrl?: string;  // embedded flipbook/document viewer URL
  carouselSlides?: string[];  // carousel post slides shown as swipeable/clickable sequence
  websiteUrl?: string;        // live website to embed/link
  pdfDocs?: { title: string; url: string }[];  // PDFs shown in-browser 2x2 grid
  afterPoints?: { icon: string; text: string }[];  // custom before/after bullet points
  beforePoints?: { icon: string; text: string }[];  // custom before bullet points
};

export const WORK_ITEMS: WorkItem[] = [
  /* ───────── FASHION — FULL-STACK ───────── */
  {
    id: "oaklynwear",
    title: "Oaklynwear",
    client: "Oaklynwear",
    tag: "Instagram · TikTok · Fashion",
    category: "Full-Stack Growth",
    color: "oklch(0.20 0.02 240)",
    platform: "Instagram · TikTok · Meta Ads · Google Ads",
    duration: "Ongoing",
    tools: ["Meta Ads Manager", "Google Ads", "Canva", "Photoshop", "CapCut", "Notion"],
    websiteUrl: "https://oaklynwear.com",

    overview:
      "Oaklynwear is a US-based fashion brand. I run everything on the marketing side — Google Ads, Meta Ads, social media management, branding, and day-to-day account management. One person, the full stack.",

    challenge:
      "A fashion e-commerce brand competing in a crowded US market needs paid and organic working together — ads that convert, a feed that builds trust, and a brand identity that ties it all into one recognizable look. Handling those in isolation wastes budget; handling them together compounds.",

    approach:
      "I treat the brand as one funnel. Organic content builds the brand and warms the audience; Meta and Google campaigns capture demand and retarget engaged visitors; the branding keeps every touchpoint — ad, post, story — unmistakably Oaklynwear.",

    workflow: [
      "Brand & account audit — reviewed identity, content, and existing ad accounts",
      "Positioning — defined the visual direction and voice for the US fashion audience",
      "Content system — content pillars, calendar, and reusable template kit",
      "Paid setup — structured Meta and Google Ads campaigns with clean tracking",
      "Creative production — designed ad creatives and organic posts to one visual system",
      "Management — daily posting, community management, and budget optimization",
      "Reporting — regular performance reviews across paid and organic",
    ],

    what: [
      "Google Ads campaign setup & management",
      "Meta Ads (Facebook & Instagram) campaigns",
      "Full social media management",
      "Brand identity & visual direction",
      "Ad creative & content design",
      "Account management & reporting",
    ],

    result:
      "A single, consistent growth system — paid and organic run by one person, so creative, targeting, and brand always stay in sync.",
  },

  {
    id: "roselyn-atelier",
    title: "Roselyn Atelier",
    client: "Roselyn Atelier",
    tag: "Instagram · TikTok · Fashion",
    category: "Full-Stack Growth",
    color: "oklch(0.55 0.08 10)",
    platform: "Instagram · TikTok · Meta Ads · Google Ads",
    duration: "Ongoing",
    tools: ["Meta Ads Manager", "Google Ads", "Canva", "Photoshop", "CapCut", "Notion"],

    overview:
      "Roselyn Atelier is a UK-based fashion atelier with a polished, editorial aesthetic. I handle the full marketing stack — Google Ads, Meta Ads, social media management, branding, and account management.",

    challenge:
      "An atelier brand lives or dies on aesthetics — the ads have to feel as premium as the product. The challenge was building performance marketing that converts without ever cheapening the editorial look the brand is built on.",

    approach:
      "Editorial-first, performance-backed. Every creative — organic or paid — holds the atelier's visual standard, while campaign structure, audiences, and budgets are handled with pure performance discipline underneath.",

    workflow: [
      "Brand immersion — studied the atelier's aesthetic and audience",
      "Visual system — refined the brand's look into a repeatable content style",
      "Editorial calendar — planned content around collections and key dates",
      "Paid campaigns — Meta and Google Ads structured for e-commerce conversion",
      "Creative production — premium ad creatives matching the editorial feed",
      "Management — publishing, engagement, and continuous ad optimization",
    ],

    what: [
      "Google Ads campaign management",
      "Meta Ads campaigns & retargeting",
      "Social media management (Instagram · TikTok)",
      "Brand aesthetics & editorial direction",
      "Ad creative design",
      "Ongoing account management",
    ],

    result:
      "A premium, editorial presence with a real performance engine behind it — the brand looks like an atelier and markets like an e-commerce operation.",
  },

  {
    id: "lirenne-wear",
    title: "Lirenne Wear",
    client: "Lirenne Wear",
    tag: "Instagram · TikTok · Fashion",
    category: "Full-Stack Growth",
    color: "oklch(0.38 0.10 260)",
    platform: "Instagram · TikTok · Meta Ads · Google Ads",
    duration: "Ongoing",
    tools: ["Meta Ads Manager", "Google Ads", "Canva", "Photoshop", "CapCut", "Notion"],

    overview:
      "Lirenne Wear is a US-based fashion label. I run the complete marketing operation — Google Ads, Meta Ads, social media management, branding, and account management — bringing consistency and personality to the brand from the ground up.",

    challenge:
      "The label needed everything working at once: a recognizable identity, a content system that could sustain daily presence, and paid campaigns that turn attention into sales — without the overhead of a full team.",

    approach:
      "Build the system once, then run it hard. I established the visual identity and content pillars first, then layered Meta and Google campaigns on top so every ad dollar lands on a brand that already looks credible.",

    workflow: [
      "Identity groundwork — visual direction, templates, and brand rules",
      "Content engine — pillars, calendar, and batch production workflow",
      "Paid structure — Meta and Google Ads campaigns with e-commerce tracking",
      "Creative testing — iterating ad creatives against real performance data",
      "Daily management — posting, community, budgets, and optimization",
      "Reporting — clear monthly reviews across the whole funnel",
    ],

    what: [
      "Google Ads management",
      "Meta Ads management",
      "Full social media management",
      "Brand identity & content system",
      "Ad creative design & testing",
      "Account management & reporting",
    ],

    result:
      "One coherent brand across every touchpoint — organic feed, stories, and ads all pull in the same direction, managed end-to-end by one person.",
  },

  {
    id: "bella-monza",
    title: "Bella Monza",
    client: "Bella Monza",
    tag: "Instagram · TikTok · Fashion",
    category: "Full-Stack Growth",
    color: "oklch(0.45 0.16 350)",
    platform: "Instagram · TikTok · Meta Ads · Google Ads",
    duration: "Ongoing",
    tools: ["Meta Ads Manager", "Google Ads", "Canva", "Photoshop", "CapCut", "Notion"],

    overview:
      "Bella Monza is a fashion store where I own the entire marketing stack — Google Ads, Meta Ads, social media management, branding, and account management. Strategy through execution, one accountable person.",

    challenge:
      "Fashion retail moves fast: drops, seasons, trends. The brand needed marketing that could keep pace — fresh creative weekly, campaigns adjusted to what's selling, and a consistent identity holding it all together.",

    approach:
      "Speed with standards. A locked brand system makes fast creative possible without drift, and tight feedback loops between ad performance and organic content mean what works anywhere gets amplified everywhere.",

    workflow: [
      "Brand system — identity, templates, and creative rules built for speed",
      "Content calendar — planned around drops, seasons, and trends",
      "Paid campaigns — Meta and Google Ads aligned to product priorities",
      "Creative cycle — weekly production and performance-based iteration",
      "Management — publishing, engagement, budgets, and optimization",
    ],

    what: [
      "Google Ads campaigns",
      "Meta Ads campaigns",
      "Social media management",
      "Branding & creative direction",
      "Ad creative production",
      "Full account management",
    ],

    result:
      "A fashion brand that ships fast without looking rushed — consistent identity, active feed, and paid campaigns that keep pace with the product.",
  },

  {
    id: "stealandstyle",
    title: "StealandStyle",
    client: "StealandStyle",
    tag: "Instagram · Fashion",
    category: "Social Media Management",
    color: "oklch(0.50 0.16 320)",
    platform: "Instagram",
    duration: "Ongoing",
    tools: ["Canva", "Photoshop", "CapCut", "Notion"],

    overview:
      "StealandStyle is a fashion-focused Instagram brand. I manage its social presence end-to-end — content, design, and community — building a feed that turns style inspiration into an engaged following.",

    challenge:
      "Fashion content on Instagram is saturated. Standing out means a distinct visual voice and a posting rhythm consistent enough to compound — not occasional posts that get lost in the feed.",

    approach:
      "I built a recognizable content system for the brand — consistent templates, a clear aesthetic, and short-form video that stops the scroll — then kept it running with a steady calendar and active community management.",

    workflow: [
      "Account audit — reviewed the feed, voice, and audience",
      "Visual system — templates and aesthetic for a consistent look",
      "Content calendar — planned posts, stories, and reels",
      "Creative production — designed posts and edited short-form video",
      "Management — daily publishing and community engagement",
    ],

    what: [
      "Instagram content design",
      "Reels & short-form editing",
      "Content calendar & strategy",
      "Caption writing & brand voice",
      "Community management",
    ],

    result:
      "A consistent, recognizable Instagram presence with a feed and posting rhythm built to grow an engaged fashion audience.",
    analyticsImg: "/Campaigns/stealandstyle_Analytics_Screenshot.png",
    calendarImg: "/Campaigns/stealandstyle_ContentCalendar.png",
    graphics: [
      {
        src: "/Graphics/OverallBrandBoard.png",
        title: "Brand Board",
        description: "The full StealandStyle brand board — colors, typography, and visual language that every post is built on.",
        tools: ["Illustrator", "Canva"],
        process: [
          "Defined the palette, type system, and layout rules for the feed",
          "Built as the single source of truth for all StealandStyle content",
        ],
      },
      {
        src: "/Graphics/00_STEAL&STYLE_COLLECTION-1_SK01-05.png",
        title: "Collection 1 Series",
        description: "Post series for the first collection drop — designed as a cohesive set so the feed reads as one campaign.",
        tools: ["Photoshop", "Canva"],
        process: ["Designed the drop as a series, not one-off posts, so the grid tells a story"],
      },
      {
        src: "/Graphics/01_Collection3_Cover1.png",
        title: "Collection 3 Cover",
        description: "Cover graphic for the third collection launch.",
        tools: ["Photoshop", "Canva"],
        process: ["Kept the locked brand system while giving the new collection its own moment"],
      },
      {
        src: "/Graphics/COLLECTION2_CH-01.png",
        title: "Collection 2 Graphic",
        description: "Campaign graphic from the second collection drop.",
        tools: ["Photoshop", "Canva"],
        process: ["Part of the collection series — consistent layout, fresh product focus"],
      },
    ],
  },

  {
    id: "novanoir",
    title: "novanoir.us",
    client: "Nova Noir",
    tag: "Instagram · TikTok · Fashion",
    category: "Full-Stack Growth",
    color: "oklch(0.28 0.03 285)",
    platform: "Instagram · TikTok · Meta Ads · Google Ads",
    duration: "Ongoing",
    tools: ["Meta Ads Manager", "Google Ads", "Canva", "Photoshop", "CapCut", "Notion"],

    overview:
      "Nova Noir (novanoir.us) is a US-based fashion brand with a dark, modern aesthetic. I run the full marketing stack — Google Ads, Meta Ads, social media management, branding, and account management — as one connected system.",

    challenge:
      "A new-wave fashion brand needs its paid and organic to feel like one voice — ads that convert while the feed and identity stay unmistakably Nova Noir in a crowded US market.",

    approach:
      "One funnel, one look. Organic content builds the brand and warms the audience; Meta and Google campaigns capture and retarget demand; the branding keeps every touchpoint sharp, dark, and on-brand.",

    workflow: [
      "Brand & account audit — identity, content, and ad accounts",
      "Positioning — visual direction and voice for the US fashion audience",
      "Content system — pillars, calendar, and template kit",
      "Paid setup — Meta and Google Ads with clean tracking",
      "Creative production — ad creatives and organic posts to one system",
      "Management — posting, community, and budget optimization",
      "Reporting — performance reviews across paid and organic",
    ],

    what: [
      "Google Ads campaign management",
      "Meta Ads (Facebook & Instagram) campaigns",
      "Full social media management",
      "Brand identity & visual direction",
      "Ad creative & content design",
      "Account management & reporting",
    ],

    result:
      "A single, consistent growth system for Nova Noir — paid and organic in sync, with a dark, modern identity carried across every touchpoint.",
  },

  /* ───────── CREATIVE STRATEGY ───────── */
  {
    id: "masinloc-tourism",
    title: "Masinloc Tourism Office",
    client: "Masinloc Tourism Office",
    tag: "Facebook · Creative Strategy",
    category: "Creative Strategy",
    color: "oklch(0.58 0.14 200)",
    platform: "Facebook",
    duration: "Ongoing",
    tools: ["Canva", "Photoshop", "CapCut"],
    logo: "/MasinlocTourism/logo.jpg",
    overview: "The Masinloc Tourism Office is the official government body promoting tourism in Masinloc, Zambales. As Creative Strategist, I shape how the municipality presents itself — the campaigns, the content, and the ideas that bring visitors in.",
    challenge: "The page was inconsistent and underutilized. Posts were infrequent, visuals were low quality, and the content didn't inspire people to actually visit. A government tourism page needs to feel both official and inviting — a hard balance to strike.",
    approach: "I focused on making the content feel aspirational — the kind of posts that make someone say 'I want to go there.' Better visuals, storytelling captions, campaign ideas like the Joiners Program, and a consistent rhythm that kept Masinloc top of mind.",
    beforePoints: [
      { icon: "💬", text: "I was the one who reached out first — DM'd the tourism office because I saw the potential they weren't tapping into." },
      { icon: "📋", text: "No content strategy. No visual system. Posts were scattered and the page wasn't inspiring anyone to visit." },
      { icon: "🔧", text: "My pitch: let me organize, plan, and build a presence that actually reflects how beautiful Masinloc is." },
    ],
    afterPoints: [
      { icon: "◈", text: "Organized and planned a full content system — destination features, event coverage, and a consistent visual identity." },
      { icon: "↑", text: "Pitched the Joiners Program — a campaign that generated significant revenue and tourism growth, bringing real visitors to Masinloc's nature rivers and heritage sites." },
      { icon: "✦", text: "The page became an actual tourism resource — aspirational, official, and worth sharing." },
    ],
    workflow: [
      "Content audit — reviewed existing posts and identified gaps",
      "Destination mapping — catalogued key spots, events, and stories worth featuring",
      "Campaign ideation — pitched creative programs like the Joiners Program to drive visits",
      "Visual direction — established a clean, bright aesthetic that matched the destination",
      "Coordination — worked with the tourism office on event coverage and announcements",
      "Execution — wrote copy, designed graphics, published and managed the page",
    ],
    what: [
      "Creative strategy & campaign ideation",
      "Regular tourism content (destinations, events, culture)",
      "Visual direction for photography",
      "Caption writing that highlights Masinloc's appeal",
      "Event coverage coordination",
      "Promotional graphics for local events",
    ],
    result: "The Joiners Program and revitalized content brought measurable revenue and tourism growth. The page started functioning as an actual tourism resource rather than an afterthought.",
    graphics: [
      {
        src: "/MasinlocTourism/BrandKit.jpg",
        title: "Brand Kit",
        description: "Visual brand kit for Masinloc Tourism — colors, typography, and design language for all official content.",
        tools: ["Canva"],
        process: [
          "Defined a clean, coastal aesthetic that reflects Masinloc's natural beauty",
          "Set color palette and font system for consistent official use",
        ],
      },
      {
        src: "/MasinlocTourism/Poster-1.png",
        title: "Event Poster 1",
        description: "Promotional event poster for a local Masinloc tourism event.",
        tools: ["Canva", "Photoshop"],
        process: [
          "Designed for both print and digital use",
          "Used destination photography and bold typography to build excitement",
        ],
      },
      {
        src: "/MasinlocTourism/Poster-2.png",
        title: "Event Poster 2",
        description: "Second event poster — alternate design for a different event or announcement.",
        tools: ["Canva", "Photoshop"],
        process: ["Maintained brand consistency while adapting layout for the specific event"],
      },
      {
        src: "/MasinlocTourism/Poster-3.png",
        title: "Event Poster 3",
        description: "Third event poster — part of the series for Masinloc tourism campaigns.",
        tools: ["Canva", "Photoshop"],
        process: ["Created as part of a campaign series with consistent visual language"],
      },
      {
        src: "/MasinlocTourism/Dingalan - Poster Invitation (1).png",
        title: "Dingalan Invitation Poster",
        description: "Official invitation poster for a Dingalan-related event — designed for reach and attendance.",
        tools: ["Canva"],
        process: [
          "Designed to communicate event details clearly and invitingly",
          "Used warm tones and destination imagery to drive interest",
        ],
      },
    ],
  },

  /* ───────── LOCAL SERVICE ───────── */
  {
    id: "fast-snaking",
    title: "Fast Snaking Services",
    client: "Fast Snaking Services",
    tag: "Facebook · Local Service",
    category: "Social Media Management",
    color: "oklch(0.55 0.14 25)",
    platform: "Facebook",
    duration: "Ongoing",
    tools: ["Canva", "Photoshop"],
    logo: "/FastToiletSnaking/logo.png",
    calendarImg: "/FastToiletSnaking/contentcalendar.png",
    analyticsImg: "/FastToiletSnaking/analytics.png",
    websiteUrl: "https://fastsnakingservices.vercel.app",
    overview: "A Philadelphia-based plumbing and drainage business that started from a single DM. The client reached out with nothing — no brand, no page, no online presence. I built everything from scratch: identity, website direction, content system, and ongoing social media management.",
    challenge: "Zero starting point. The client had a service but no way for customers to find him online. No logo, no page, no content — just a business idea that needed a digital presence.",
    approach: "Treated it like a full brand launch. Started with identity, built the Facebook page, created a content system around trust and local credibility, and pushed it live. Philadelphia locals needed to find him and trust him — every post served that goal.",
    workflow: [
      "Initial consult — understood the business, service area, and target customer",
      "Brand identity — created the logo, color system, and visual direction",
      "Page setup — built and optimized the Facebook business page from zero",
      "Content planning — mapped out service features, education, and trust content",
      "Template design — built reusable Canva templates for all post types",
      "Execution — published consistently and managed inquiries",
      "Reporting — weekly progress reports and performance tracking",
    ],
    what: [
      "Full brand identity from scratch",
      "Facebook page setup and management",
      "Graphic design for all post types",
      "Content strategy and calendar",
      "Community management",
      "Weekly reporting",
      "Vehicle magnet design for physical marketing",
    ],
    result: "A complete brand and online presence built from nothing. Philadelphia locals can now find, verify, and contact Fast Snaking Services directly through Facebook — and the vehicle magnet turns every job into a moving ad.",
    afterPoints: [
      { icon: "📞", text: "3–5 calls a week coming in from Philadelphia locals finding the page organically." },
      { icon: "📲", text: "Reach and impressions growing week over week — all organic, zero ad spend." },
      { icon: "📍", text: "Localized brand presence established in Philadelphia — community recognizes the name." },
      { icon: "✦", text: "Vehicle magnet printed and running — the service van is now a rolling ad across the city." },
    ],
    beforePoints: [
      { icon: "💬", text: "A client DM'd me wanting to start a plumbing business. No plan, no money, just drive." },
      { icon: "📭", text: "Zero brand. Zero logo. Zero social media. Zero budget. Literally nothing to work with." },
      { icon: "📍", text: "Based in Philadelphia — needed to reach local customers fast without paid ads." },
      { icon: "🔧", text: "My job: build everything from the ground up and make it look established from day one." },
    ],
    carouselSlides: [
      "/FastToiletSnaking/slide-1.png",
      "/FastToiletSnaking/slide-2.png",
      "/FastToiletSnaking/slide-3.png",
      "/FastToiletSnaking/slide-4.png",
      "/FastToiletSnaking/slide-5.png",
    ],
    pdfDocs: [
      { title: "Vehicle Magnet Spec", url: "/FastToiletSnaking/FastSnakingServices_9_Inch_Vehicle_Magnet.pdf" },
      { title: "Day 1 Work Progress", url: "/FastToiletSnaking/FastSnakingServices_Day1_WorkProgress_TestWeek%20(1).pdf" },
      { title: "Day 2 Work Progress", url: "/FastToiletSnaking/FastSnakingServices_Day2_WorkProgress_TestWeek.pdf" },
      { title: "Week 1 Report", url: "/FastToiletSnaking/FastSnakingServices_Week1_Report_0521-0528_2026.pdf" },
    ],
    graphics: [
      {
        src: "/FastToiletSnaking/OnboardingPost.png",
        title: "Onboarding Post",
        description: "Welcome post introducing Fast Snaking Services to new followers — establishes trust from day one.",
        tools: ["Canva"],
        process: [
          "Designed to communicate who they are and what service they offer at a glance",
          "Clean layout, professional tone — builds immediate credibility",
        ],
      },
      {
        src: "/FastToiletSnaking/WeExistPost.png",
        title: "We Exist Post",
        description: "Brand awareness post announcing the page's launch to the Philadelphia community.",
        tools: ["Canva"],
        process: [
          "Announced the business on social media for the first time",
          "Focused on reach — simple, clear, memorable",
        ],
      },
      {
        src: "/FastToiletSnaking/InformationPost.png",
        title: "Information Post",
        description: "Service information post — tells potential customers exactly what Fast Snaking offers.",
        tools: ["Canva"],
        process: [
          "Listed core services clearly to reduce friction for potential customers",
          "Designed for quick readability on mobile",
        ],
      },
      {
        src: "/FastToiletSnaking/educationPost.png",
        title: "Education Post",
        description: "Educational content building trust by teaching followers about plumbing issues.",
        tools: ["Canva"],
        process: [
          "Used educational content to position Fast Snaking as the local Philadelphia expert",
          "Value-first approach — give info, earn trust, get leads",
        ],
      },
      {
        src: "/FastToiletSnaking/educationPost2.png",
        title: "Education Post 2",
        description: "Second educational post — another helpful tip to keep the audience engaged.",
        tools: ["Canva"],
        process: ["Continued the education series to maintain consistent posting"],
      },
      {
        src: "/FastToiletSnaking/educationpost3.png",
        title: "Education Post 3",
        description: "Third in the education series — deepens credibility through consistent helpful content.",
        tools: ["Canva"],
        process: ["Maintained the series format for brand consistency and algorithmic favor"],
      },
      {
        src: "/FastToiletSnaking/diy_awarenesspost.png",
        title: "DIY Awareness Post",
        description: "Post warning followers about the risks of DIY plumbing — driving them toward professional help.",
        tools: ["Canva"],
        process: [
          "Addressed a common behavior (DIY fixes) to redirect leads toward the business",
          "Soft sell — helpful first, service pitch second",
        ],
      },
      {
        src: "/FastToiletSnaking/availabilityPost.png",
        title: "Availability Post",
        description: "Lets followers know when and how to reach Fast Snaking Services.",
        tools: ["Canva"],
        process: [
          "Reduced friction for inquiries by clearly stating availability",
          "Included contact info prominently",
        ],
      },
      {
        src: "/FastToiletSnaking/CalltoActionPost.png",
        title: "Call to Action Post",
        description: "Direct CTA post driving followers to contact the business.",
        tools: ["Canva"],
        process: [
          "Strong headline, clear CTA, brand colors",
          "Designed to convert scrollers into inquiries",
        ],
      },
      {
        src: "/FastToiletSnaking/calltoactionpost2.png",
        title: "Call to Action Post 2",
        description: "Second CTA variation — alternate layout for A/B testing engagement.",
        tools: ["Canva"],
        process: ["Created a variation to test which CTA format drives more responses"],
      },
      {
        src: "/FastToiletSnaking/calltoaction.png",
        title: "Call to Action Graphic",
        description: "Standalone CTA graphic used across multiple post formats.",
        tools: ["Canva"],
        process: ["Built as a reusable CTA element for consistency across the feed"],
      },
      {
        src: "/FastToiletSnaking/InvitationPost.png",
        title: "Invitation Post",
        description: "Invites the Philadelphia community to follow and engage with the page.",
        tools: ["Canva"],
        process: ["Designed to grow the follower base through a friendly community invite"],
      },
      {
        src: "/FastToiletSnaking/FastSnakingServices_VehicleMagnet.png",
        title: "Vehicle Magnet Design",
        description: "Branded vehicle magnet for physical marketing — turns the service vehicle into a rolling ad across Philadelphia.",
        tools: ["Canva", "Photoshop"],
        process: [
          "Designed for print — high contrast, large text, easy to read at speed",
          "Included logo, service name, and contact number",
          "Exported print-ready at 9-inch spec for the magnet vendor",
        ],
      },
    ],
  },

  /* ───────── PERSONAL BRAND — BRANDING STRATEGY ───────── */
  {
    id: "snappy-nomad",
    title: "The Snappy Nomad",
    client: "The Snappy Nomad",
    tag: "Branding · Travel Camera",
    category: "Branding Strategy",
    color: "oklch(0.62 0.16 255)",
    platform: "Instagram · Facebook",
    duration: "Pre-launch",
    tools: ["Illustrator", "Canva", "Photoshop", "Notion"],
    overview: "The Snappy Nomad is a personal business built around a travel camera. I run it end-to-end — the branding strategy (positioning, identity, launch plan) and the ongoing management of the brand and its social presence. Currently in pre-launch.",
    challenge: "Coming soon.",
    approach: "Coming soon.",
    workflow: ["Coming soon — details will be revealed at launch."],
    what: ["Branding Strategy", "Brand Identity", "Positioning", "Launch Planning", "Social Media Management"],
    result: "Coming soon — follow the journey.",
  },
];
