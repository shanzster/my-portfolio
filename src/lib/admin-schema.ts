/* Declarative form schema — a small field vocabulary the generic AdminForm
   renders. Adding a new editable content type later = describe its fields here. */
export type Field =
  | { kind: "text"; key: string; label: string; textarea?: boolean; placeholder?: string; help?: string }
  | { kind: "select"; key: string; label: string; options: string[] }
  | { kind: "bool"; key: string; label: string; help?: string }
  | { kind: "image"; key: string; label: string; help?: string }
  | { kind: "imageList"; key: string; label: string; help?: string }
  | { kind: "video"; key: string; label: string; help?: string }
  | { kind: "videoList"; key: string; label: string; help?: string }
  | { kind: "file"; key: string; label: string; help?: string }
  | { kind: "stringList"; key: string; label: string; help?: string }
  | { kind: "object"; key: string; label: string; fields: Field[]; help?: string }
  | { kind: "objectList"; key: string; label: string; fields: Field[]; help?: string };

const IMG_HELP = "Click Upload to add an image from your device (Cloudinary), or paste an image path / URL.";
const VID_HELP = "Click Upload to add a video (Cloudinary), or paste a YouTube / Vimeo / .mp4 link.";

export const SOCIAL_FIELDS: Field[] = [
  { kind: "text", key: "name", label: "Name" },
  { kind: "text", key: "handle", label: "Handle", placeholder: "@handle or page name" },
  { kind: "select", key: "platform", label: "Platform", options: ["Instagram", "Facebook"] },
  { kind: "text", key: "category", label: "Category", placeholder: "Fashion Brand · USA" },
  { kind: "text", key: "bio", label: "Bio", textarea: true },
  { kind: "text", key: "link", label: "Link (Follow/View button)", placeholder: "https://instagram.com/…" },
  {
    kind: "text",
    key: "color",
    label: "Brand color",
    placeholder: "oklch(0.55 0.14 25)",
    help: "OKLCH color used for the card accent & badge.",
  },
  { kind: "select", key: "status", label: "Status", options: ["Active", "Coming Soon"] },
  { kind: "bool", key: "owned", label: "My own business (shows the ★ My Business badge)" },
  { kind: "image", key: "logo", label: "Logo (optional)", help: IMG_HELP },
  {
    kind: "stringList",
    key: "posts",
    label: "Instagram post links",
    help: "Paste post/reel links (⋯ → Copy link). Each fills a grid tile and opens live.",
  },
];

export const WORK_FIELDS: Field[] = [
  { kind: "bool", key: "hidden", label: "Hide this project from the site (keeps it saved; direct /work link still works for previewing)" },
  { kind: "text", key: "title", label: "Title" },
  { kind: "text", key: "client", label: "Client" },
  { kind: "text", key: "tag", label: "Tag", placeholder: "Instagram · TikTok · Fashion" },
  { kind: "text", key: "category", label: "Category", placeholder: "Full-Stack Growth" },
  { kind: "text", key: "color", label: "Brand color", placeholder: "oklch(0.20 0.02 240)" },
  { kind: "text", key: "platform", label: "Platform (optional)" },
  { kind: "text", key: "duration", label: "Duration (optional)", placeholder: "Ongoing" },
  { kind: "image", key: "logo", label: "Logo (optional)", help: IMG_HELP },

  { kind: "text", key: "overview", label: "Overview", textarea: true },
  { kind: "text", key: "challenge", label: "Challenge", textarea: true },
  { kind: "text", key: "approach", label: "Approach", textarea: true },
  { kind: "text", key: "result", label: "Result", textarea: true },

  { kind: "stringList", key: "workflow", label: "Workflow steps" },
  { kind: "stringList", key: "what", label: "What I did" },
  { kind: "stringList", key: "tools", label: "Tools" },

  { kind: "image", key: "beforeImg", label: "Before image (optional)", help: IMG_HELP },
  { kind: "image", key: "afterImg", label: "After image (optional)", help: IMG_HELP },
  { kind: "image", key: "calendarImg", label: "Calendar image (optional)", help: IMG_HELP },
  { kind: "image", key: "analyticsImg", label: "Analytics image (optional)", help: IMG_HELP },
  { kind: "text", key: "websiteUrl", label: "Website URL (optional)" },
  { kind: "text", key: "flipbookUrl", label: "Flipbook URL (optional)" },

  { kind: "videoList", key: "reels", label: "Reels — videos (optional)", help: "Click Upload to add a video from your device (Cloudinary), or paste a .mp4 URL." },
  { kind: "imageList", key: "gallery", label: "Gallery images (optional)" },
  { kind: "imageList", key: "carouselSlides", label: "Carousel slides (optional)" },

  {
    kind: "objectList",
    key: "beforePoints",
    label: "Before points (optional)",
    fields: [
      { kind: "text", key: "icon", label: "Icon (emoji)" },
      { kind: "text", key: "text", label: "Text", textarea: true },
    ],
  },
  {
    kind: "objectList",
    key: "afterPoints",
    label: "After points (optional)",
    fields: [
      { kind: "text", key: "icon", label: "Icon (emoji)" },
      { kind: "text", key: "text", label: "Text", textarea: true },
    ],
  },
  {
    kind: "objectList",
    key: "analytics",
    label: "Analytics stats (optional)",
    fields: [
      { kind: "text", key: "label", label: "Label" },
      { kind: "text", key: "value", label: "Value" },
    ],
  },
  {
    kind: "objectList",
    key: "pdfDocs",
    label: "Brand files & evidence — PDFs (shown before the Content Calendar section)",
    help: "Each file renders in-browser with a preview on the case-study page.",
    fields: [
      { kind: "text", key: "title", label: "Title" },
      { kind: "file", key: "url", label: "PDF file", help: "Click Upload to add a PDF from your device (Cloudinary), or paste a URL / /path to a file in public/." },
    ],
  },
  {
    kind: "objectList",
    key: "graphics",
    label: "Graphics (optional)",
    fields: [
      { kind: "image", key: "src", label: "Image", help: IMG_HELP },
      { kind: "text", key: "title", label: "Title" },
      { kind: "text", key: "description", label: "Description", textarea: true },
      { kind: "stringList", key: "process", label: "Process notes" },
      { kind: "stringList", key: "tools", label: "Tools" },
      { kind: "bool", key: "portrait", label: "Portrait (tall image)" },
    ],
  },
];

/* Ads, Graphics, Calendars share this shape (see media-data.ts). */
export const MEDIA_FIELDS: Field[] = [
  { kind: "text", key: "title", label: "Title" },
  { kind: "text", key: "client", label: "Client" },
  { kind: "text", key: "category", label: "Category" },
  { kind: "image", key: "src", label: "Image (optional)", help: IMG_HELP },
  {
    kind: "text",
    key: "bg",
    label: "Placeholder gradient",
    placeholder: "linear-gradient(135deg, oklch(…), oklch(…))",
    help: "Shown as the card background until an image is added.",
  },
];

export const VIDEO_FIELDS: Field[] = [
  { kind: "text", key: "title", label: "Title" },
  { kind: "text", key: "client", label: "Client" },
  { kind: "text", key: "category", label: "Category", placeholder: "Reel, Promo, Ad…" },
  { kind: "video", key: "src", label: "Video (optional)", help: VID_HELP },
  {
    kind: "text",
    key: "bg",
    label: "Placeholder gradient",
    placeholder: "linear-gradient(135deg, oklch(…), oklch(…))",
    help: "Shown until a video is added.",
  },
];

const SCREENSHOT_FIELDS: Field[] = [
  { kind: "image", key: "src", label: "Image", help: IMG_HELP },
  { kind: "text", key: "caption", label: "Caption" },
];

export const CLIENT_FIELDS: Field[] = [
  { kind: "text", key: "name", label: "Name" },
  { kind: "text", key: "handle", label: "Handle" },
  { kind: "text", key: "platform", label: "Platform", placeholder: "Instagram · TikTok" },
  { kind: "text", key: "category", label: "Category", placeholder: "Fashion Brand · USA" },
  { kind: "text", key: "group", label: "Group", placeholder: "Fashion / Strategy / Local Service / Personal" },
  { kind: "text", key: "description", label: "Description", textarea: true },
  { kind: "stringList", key: "services", label: "Services" },
  { kind: "text", key: "link", label: "Link" },
  { kind: "text", key: "color", label: "Brand color", placeholder: "oklch(0.20 0.02 240)" },
  { kind: "text", key: "status", label: "Status", placeholder: "Active / Coming Soon" },
  { kind: "image", key: "logo", label: "Logo (optional)", help: IMG_HELP },
  { kind: "image", key: "coverImg", label: "Cover image (optional)", help: IMG_HELP },
  { kind: "objectList", key: "screenshots", label: "Screenshots (optional)", fields: SCREENSHOT_FIELDS },
  { kind: "objectList", key: "interviews", label: "Interviews (optional)", fields: SCREENSHOT_FIELDS },
  { kind: "objectList", key: "meetings", label: "Meetings (optional)", fields: SCREENSHOT_FIELDS },
  { kind: "objectList", key: "replies", label: "Replies (optional)", fields: SCREENSHOT_FIELDS },
];

export const SERVICE_FIELDS: Field[] = [
  { kind: "text", key: "title", label: "Title" },
  { kind: "text", key: "file", label: "File label", placeholder: "social_media.app", help: "The little filename on the card title bar." },
  { kind: "text", key: "tagline", label: "Tagline" },
  { kind: "text", key: "description", label: "Description", textarea: true },
  { kind: "stringList", key: "includes", label: "What's included" },
  { kind: "stringList", key: "tools", label: "Tools" },
  { kind: "text", key: "bestFor", label: "Best for", textarea: true },
  { kind: "text", key: "color", label: "Accent color", placeholder: "oklch(0.62 0.16 255)" },
  {
    kind: "object",
    key: "sample",
    label: "Sample link (optional)",
    fields: [
      { kind: "text", key: "label", label: "Label", placeholder: "Sample work — novanoir.com" },
      { kind: "text", key: "url", label: "URL" },
    ],
  },
];

export const GALLERY_FIELDS: Field[] = [
  { kind: "text", key: "label", label: "Folder name" },
  { kind: "text", key: "icon", label: "Icon (symbol)", placeholder: "◎ ✦ ▶ ⬡" },
  { kind: "text", key: "description", label: "Description", textarea: true },
  { kind: "text", key: "color", label: "Folder color", placeholder: "oklch(…)" },
  { kind: "text", key: "tabColor", label: "Tab color", placeholder: "oklch(…)" },
  {
    kind: "objectList",
    key: "items",
    label: "Media items",
    fields: [
      { kind: "text", key: "id", label: "ID" },
      { kind: "text", key: "title", label: "Title" },
      { kind: "text", key: "client", label: "Client" },
      { kind: "image", key: "src", label: "Image (optional)", help: IMG_HELP },
      { kind: "text", key: "bg", label: "Placeholder color/gradient", placeholder: "oklch(…) or linear-gradient(…)" },
      { kind: "select", key: "type", label: "Type", options: ["image", "video"] },
      { kind: "select", key: "aspect", label: "Aspect", options: ["square", "portrait", "landscape"] },
    ],
  },
];

/* ─── Page singletons ─── */

export const ABOUT_FIELDS: Field[] = [
  {
    kind: "object",
    key: "page",
    label: "Page text (hero, cards, kickers, CTA)",
    fields: [
      { kind: "text", key: "back", label: "Back link" },
      { kind: "text", key: "basedInLabel", label: "'Based in' label" },
      { kind: "text", key: "basedIn", label: "Location line" },
      { kind: "text", key: "helloKicker", label: "'Hello, I'm' kicker" },
      { kind: "text", key: "name", label: "Name" },
      { kind: "text", key: "role", label: "Role line" },
      { kind: "text", key: "paragraph", label: "Intro paragraph", textarea: true },
      {
        kind: "objectList",
        key: "socialChips",
        label: "Social chips",
        fields: [
          { kind: "text", key: "label", label: "Label" },
          { kind: "text", key: "href", label: "URL" },
        ],
      },
      {
        kind: "objectList",
        key: "quickStats",
        label: "Quick stats",
        fields: [
          { kind: "text", key: "v", label: "Value" },
          { kind: "text", key: "l", label: "Label" },
        ],
      },
      { kind: "text", key: "clockTitle", label: "Clock window title" },
      { kind: "text", key: "clockStatus", label: "Clock status line" },
      { kind: "text", key: "availabilityTitle", label: "Availability title" },
      { kind: "text", key: "availabilitySub", label: "Availability subtitle" },
      { kind: "text", key: "availabilityButton", label: "Availability button" },
      { kind: "text", key: "platformsTitle", label: "'Platforms I manage' title" },
      { kind: "stringList", key: "platforms", label: "Platform chips" },
      { kind: "text", key: "currentlyTitle", label: "'Currently' title" },
      { kind: "stringList", key: "currently", label: "Currently items" },
      { kind: "text", key: "kickerStory", label: "Kicker — story" },
      { kind: "text", key: "kickerJourney", label: "Kicker — journey" },
      { kind: "text", key: "kickerBeliefs", label: "Kicker — how I work" },
      { kind: "text", key: "kickerCredentials", label: "Kicker — credentials" },
      { kind: "text", key: "kickerTools", label: "Kicker — tools" },
      { kind: "text", key: "kickerDevices", label: "Kicker — devices" },
      { kind: "text", key: "terminalTitle", label: "Terminal window title" },
      { kind: "text", key: "terminalPrompt", label: "Terminal prompt" },
      { kind: "text", key: "terminalCommand", label: "Terminal command" },
      { kind: "text", key: "journeyCta", label: "Journey CTA link" },
      { kind: "text", key: "videoHide", label: "Video 'Hide' label" },
      { kind: "text", key: "videoWatch", label: "Video 'Watch' label" },
      { kind: "text", key: "ctaTitle", label: "Bottom CTA title" },
      { kind: "text", key: "ctaBody", label: "Bottom CTA body" },
      { kind: "text", key: "ctaClients", label: "'See clients' button" },
      { kind: "text", key: "ctaHire", label: "'Hire me' button" },
    ],
  },
  {
    kind: "object",
    key: "videoIntro",
    label: "Video introduction",
    fields: [
      { kind: "bool", key: "enabled", label: "Show the video-intro toggle on the About page" },
      { kind: "text", key: "buttonLabel", label: "Toggle button label" },
      { kind: "text", key: "title", label: "Title" },
      { kind: "text", key: "caption", label: "Caption" },
      { kind: "video", key: "url", label: "Video", help: VID_HELP },
    ],
  },
  { kind: "stringList", key: "story", label: "Story paragraphs", help: "Shown in the terminal ‘cat my-story.txt’ block." },
  {
    kind: "objectList",
    key: "credentials",
    label: "Credentials",
    fields: [
      { kind: "text", key: "type", label: "Section title", placeholder: "Experience / Skills" },
      { kind: "text", key: "icon", label: "Icon (symbol)" },
      {
        kind: "objectList",
        key: "items",
        label: "Items",
        fields: [
          { kind: "text", key: "title", label: "Title" },
          { kind: "text", key: "sub", label: "Subtitle" },
          { kind: "text", key: "detail", label: "Detail", textarea: true },
        ],
      },
    ],
  },
  {
    kind: "objectList",
    key: "journey",
    label: "Journey timeline",
    fields: [
      { kind: "text", key: "year", label: "Year" },
      { kind: "text", key: "title", label: "Title" },
      { kind: "text", key: "detail", label: "Detail", textarea: true },
      { kind: "text", key: "color", label: "Color", placeholder: "oklch(…)" },
      { kind: "bool", key: "cta", label: "Show ‘Let's talk’ link" },
    ],
  },
  {
    kind: "objectList",
    key: "beliefs",
    label: "Beliefs",
    fields: [
      { kind: "text", key: "icon", label: "Icon (symbol)" },
      { kind: "text", key: "title", label: "Title" },
      { kind: "text", key: "detail", label: "Detail", textarea: true },
    ],
  },
  {
    kind: "objectList",
    key: "tools",
    label: "Tools stack",
    fields: [
      { kind: "text", key: "name", label: "Name" },
      { kind: "text", key: "category", label: "Category" },
      { kind: "text", key: "color", label: "Color", placeholder: "oklch(…)" },
    ],
  },
  {
    kind: "objectList",
    key: "devices",
    label: "Devices / setup",
    fields: [
      { kind: "text", key: "name", label: "Name" },
      { kind: "text", key: "role", label: "Role" },
      { kind: "image", key: "image", label: "Image", help: IMG_HELP },
      { kind: "stringList", key: "specs", label: "Specs" },
      { kind: "text", key: "color", label: "Background color", placeholder: "oklch(…)" },
    ],
  },
];

const STAT_VL_FIELDS: Field[] = [
  { kind: "text", key: "v", label: "Value" },
  { kind: "text", key: "l", label: "Label" },
];

const IMG_LABEL_FIELDS: Field[] = [
  { kind: "image", key: "src", label: "Image", help: IMG_HELP },
  { kind: "text", key: "label", label: "Label" },
];

export const CLIENTS_META_FIELDS: Field[] = [
  { kind: "objectList", key: "stats", label: "Stat tiles", fields: STAT_VL_FIELDS },
  {
    kind: "objectList",
    key: "filters",
    label: "Filter chips",
    fields: [
      { kind: "text", key: "label", label: "Label" },
      { kind: "text", key: "dot", label: "Dot color", placeholder: "oklch(…)" },
    ],
  },
];

export const SKIM_FIELDS: Field[] = [
  { kind: "objectList", key: "stats", label: "Stats", fields: STAT_VL_FIELDS },
  {
    kind: "objectList",
    key: "clients",
    label: "Clients",
    fields: [
      { kind: "text", key: "name", label: "Name" },
      { kind: "text", key: "tag", label: "Tag" },
      { kind: "text", key: "result", label: "Result" },
      { kind: "text", key: "to", label: "Link (case study path)", placeholder: "/work/oaklynwear" },
      { kind: "text", key: "color", label: "Color", placeholder: "oklch(…)" },
      { kind: "image", key: "logo", label: "Logo (optional)", help: IMG_HELP },
      { kind: "text", key: "overview", label: "Overview", textarea: true },
      { kind: "objectList", key: "graphics", label: "Graphics (optional)", fields: IMG_LABEL_FIELDS },
    ],
  },
  { kind: "objectList", key: "visuals", label: "Visuals", fields: IMG_LABEL_FIELDS },
  { kind: "objectList", key: "analytics", label: "Analytics", fields: IMG_LABEL_FIELDS },
  { kind: "objectList", key: "resultTiles", label: "Result tiles", fields: STAT_VL_FIELDS },
  {
    kind: "objectList",
    key: "services",
    label: "Services",
    fields: [
      { kind: "text", key: "t", label: "Title" },
      { kind: "text", key: "d", label: "Description" },
    ],
  },
  {
    kind: "objectList",
    key: "socials",
    label: "Socials",
    fields: [
      { kind: "text", key: "h", label: "Handle" },
      { kind: "text", key: "link", label: "Link" },
      { kind: "text", key: "color", label: "Color", placeholder: "oklch(…)" },
    ],
  },
  {
    kind: "objectList",
    key: "contactActions",
    label: "Contact actions",
    fields: [
      { kind: "text", key: "label", label: "Label" },
      { kind: "text", key: "sub", label: "Subtitle" },
      { kind: "text", key: "href", label: "URL" },
    ],
  },
  {
    kind: "object",
    key: "chrome",
    label: "Menu bar & section labels",
    fields: [
      { kind: "text", key: "menuName", label: "Menu-bar name" },
      { kind: "text", key: "menuSub", label: "Menu-bar subtitle" },
      { kind: "text", key: "fullSiteLink", label: "'Full site' link label" },
      { kind: "stringList", key: "sectionLabels", label: "Section labels (Overview, Work, Results, Services, Socials, Contact)" },
    ],
  },
  {
    kind: "object",
    key: "overview",
    label: "Overview section",
    fields: [
      { kind: "text", key: "name", label: "Name" },
      { kind: "text", key: "subtitle", label: "Subtitle" },
      { kind: "text", key: "paragraph", label: "Paragraph", textarea: true },
      { kind: "text", key: "toolkitLabel", label: "Toolkit label" },
      { kind: "imageList", key: "toolIcons", label: "Toolkit icons (empty slot = built-in logo, order: PS, AI, Canva, CapCut, Meta)" },
      { kind: "text", key: "toolkitExtra", label: "Toolkit extra text" },
      { kind: "text", key: "availability", label: "Availability line" },
    ],
  },
  {
    kind: "object",
    key: "headers",
    label: "Section headers",
    fields: [
      { kind: "object", key: "work", label: "Work", fields: [{ kind: "text", key: "title", label: "Title" }, { kind: "text", key: "sub", label: "Subtitle" }] },
      { kind: "object", key: "results", label: "Results", fields: [{ kind: "text", key: "title", label: "Title" }, { kind: "text", key: "sub", label: "Subtitle" }] },
      { kind: "object", key: "services", label: "Services", fields: [{ kind: "text", key: "title", label: "Title" }, { kind: "text", key: "sub", label: "Subtitle" }] },
      { kind: "object", key: "socials", label: "Socials", fields: [{ kind: "text", key: "title", label: "Title" }, { kind: "text", key: "sub", label: "Subtitle" }] },
      { kind: "object", key: "contact", label: "Contact", fields: [{ kind: "text", key: "title", label: "Title" }, { kind: "text", key: "sub", label: "Subtitle" }] },
    ],
  },
  { kind: "text", key: "recentVisualsLabel", label: "'Recent visuals' label" },
  { kind: "text", key: "seeServicesLink", label: "'See full services' link" },
  { kind: "text", key: "openSocialsLink", label: "'Open socials wall' link" },
  { kind: "text", key: "hireButton", label: "'Hire me' button" },
  {
    kind: "object",
    key: "clientModal",
    label: "Client modal labels",
    fields: [
      { kind: "text", key: "sampleGraphics", label: "'Sample graphics' label" },
      { kind: "text", key: "moreVisuals", label: "'More visuals' fallback" },
      { kind: "text", key: "close", label: "Close button" },
      { kind: "text", key: "fullCaseStudy", label: "'Full case study' button" },
    ],
  },
];

const MEDIA_CHROME_FIELDS: Field[] = [
  { kind: "text", key: "back", label: "Back link" },
  { kind: "text", key: "kicker", label: "Kicker" },
  { kind: "text", key: "title", label: "Title" },
  { kind: "text", key: "blurb", label: "Blurb (before item count)", textarea: true },
  { kind: "text", key: "countSuffix", label: "Count suffix (after item count)" },
  { kind: "text", key: "viewFullSize", label: "'View Full Size' label" },
  { kind: "text", key: "addLabel", label: "Empty-slot label" },
];

const COMING_SOON_FIELDS: Field[] = [
  { kind: "text", key: "windowTitle", label: "Window title" },
  { kind: "text", key: "kicker", label: "Kicker" },
  { kind: "text", key: "title", label: "Title" },
  { kind: "text", key: "body", label: "Body (before handle)" },
  { kind: "text", key: "handle", label: "Handle" },
  { kind: "text", key: "bodyEnd", label: "Body (after handle)" },
  { kind: "text", key: "follow", label: "Follow button" },
  { kind: "text", key: "gotIt", label: "Dismiss button" },
];

const PAGE_HEADER_FIELDS: Field[] = [
  { kind: "text", key: "back", label: "Back link" },
  { kind: "text", key: "kicker", label: "Kicker" },
  { kind: "text", key: "titleTop", label: "Title (line 1)" },
  { kind: "text", key: "titleAccent", label: "Title (line 2, muted)" },
  { kind: "text", key: "blurb", label: "Blurb", textarea: true },
];

export const CHROME_FIELDS: Field[] = [
  { kind: "object", key: "ads", label: "Ads page", fields: MEDIA_CHROME_FIELDS },
  { kind: "object", key: "graphics", label: "Graphics page", fields: MEDIA_CHROME_FIELDS },
  { kind: "object", key: "calendars", label: "Calendars page", fields: MEDIA_CHROME_FIELDS },
  {
    kind: "object",
    key: "videos",
    label: "Videos page",
    fields: [
      ...MEDIA_CHROME_FIELDS,
      { kind: "text", key: "lockedBadge", label: "Locked-tile badge" },
      { kind: "text", key: "lockedTile", label: "Locked-tile label" },
      { kind: "object", key: "comingSoon", label: "Coming-soon modal", fields: COMING_SOON_FIELDS },
    ],
  },
  {
    kind: "object",
    key: "servicesPage",
    label: "Services page",
    fields: [
      ...PAGE_HEADER_FIELDS,
      { kind: "text", key: "countSuffix", label: "Count suffix" },
      { kind: "text", key: "includesLabel", label: "'Includes' label" },
      { kind: "text", key: "bestForLabel", label: "'Best for:' label" },
      { kind: "text", key: "ctaTitle", label: "CTA title" },
      { kind: "text", key: "ctaBody", label: "CTA body" },
      { kind: "text", key: "ctaButton", label: "CTA button" },
    ],
  },
  {
    kind: "object",
    key: "socialsPage",
    label: "Socials page",
    fields: [
      ...PAGE_HEADER_FIELDS,
      { kind: "text", key: "igSuffix", label: "Instagram count suffix" },
      { kind: "text", key: "accountsSuffix", label: "Accounts count suffix" },
      { kind: "text", key: "myBusinessBadge", label: "'My Business' badge" },
      { kind: "text", key: "soonBadge", label: "'Soon' badge" },
      { kind: "text", key: "followLabel", label: "Follow button" },
      { kind: "text", key: "viewLabel", label: "View button" },
      { kind: "text", key: "note", label: "How-to note", textarea: true },
    ],
  },
  {
    kind: "object",
    key: "galleryPage",
    label: "Gallery page",
    fields: [
      ...PAGE_HEADER_FIELDS,
      { kind: "text", key: "filesSuffix", label: "Files count suffix" },
      { kind: "text", key: "foldersSuffix", label: "Folders count suffix" },
      { kind: "text", key: "openSuffix", label: "Folder badge suffix" },
      { kind: "text", key: "recentsLabel", label: "'Recents' label" },
      { kind: "text", key: "clickToPreview", label: "'click to preview' hint" },
      { kind: "text", key: "itemsLabel", label: "'items' label" },
      { kind: "text", key: "allFoldersButton", label: "'All folders' button" },
      { kind: "text", key: "viewLabel", label: "'View' hover label" },
      { kind: "text", key: "addMediaLabel", label: "Empty-slot label" },
      { kind: "text", key: "addNote", label: "Add-media note", textarea: true },
    ],
  },
  {
    kind: "object",
    key: "clientsPage",
    label: "Clients page",
    fields: [
      ...PAGE_HEADER_FIELDS,
      { kind: "text", key: "finderTitle", label: "Finder window title" },
      { kind: "text", key: "itemsSuffix", label: "Items count suffix" },
      { kind: "text", key: "statusPath", label: "Status-bar path" },
      { kind: "text", key: "shownSuffix", label: "'shown' suffix" },
      { kind: "text", key: "colName", label: "List column — Name" },
      { kind: "text", key: "colCategory", label: "List column — Category" },
      { kind: "text", key: "colPlatform", label: "List column — Platform" },
      { kind: "text", key: "colStatus", label: "List column — Status" },
      { kind: "text", key: "activeLabel", label: "'Active' label" },
      { kind: "text", key: "soonLabel", label: "'Soon' label" },
      { kind: "text", key: "ctaTitle", label: "CTA title" },
      { kind: "text", key: "ctaBody", label: "CTA body" },
      { kind: "text", key: "ctaButton", label: "CTA button" },
      { kind: "object", key: "comingSoon", label: "Coming-soon modal", fields: COMING_SOON_FIELDS },
      { kind: "text", key: "aboutLabel", label: "'About this client' label" },
      { kind: "text", key: "servicesLabel", label: "'Services provided' label" },
      { kind: "text", key: "viewPage", label: "'View page' button" },
      { kind: "text", key: "fullCaseStudy", label: "'Full case study' button" },
      { kind: "text", key: "caseStudySoon", label: "'Case study coming soon' label" },
      { kind: "text", key: "addScreenshotLabel", label: "Empty screenshot label" },
    ],
  },
  {
    kind: "object",
    key: "workDetail",
    label: "Work case-study pages (shared labels)",
    fields: [
      { kind: "text", key: "back", label: "Back link" },
      { kind: "text", key: "beforeAfterKicker", label: "'Before & After' kicker" },
      { kind: "text", key: "beforeFile", label: "Before window title" },
      { kind: "text", key: "afterFile", label: "After window title" },
      { kind: "text", key: "beforeKicker", label: "'The starting point' label" },
      { kind: "text", key: "graphicsKicker", label: "'Graphics I Designed' kicker" },
      { kind: "text", key: "graphicsHint", label: "'hover to open' hint" },
      { kind: "text", key: "graphicsFolderLabel", label: "Folder label" },
      { kind: "text", key: "graphicTooltipHint", label: "Tooltip hint" },
      { kind: "text", key: "carouselKicker", label: "Carousel kicker" },
      { kind: "text", key: "carouselWindow", label: "Carousel window title" },
      { kind: "text", key: "carouselTitle", label: "Carousel context title" },
      { kind: "text", key: "carouselBody", label: "Carousel context body", textarea: true },
      {
        kind: "objectList",
        key: "carouselSteps",
        label: "Carousel steps",
        fields: [
          { kind: "text", key: "n", label: "Number" },
          { kind: "text", key: "t", label: "Title" },
          { kind: "text", key: "d", label: "Description" },
        ],
      },
      { kind: "text", key: "enlargeHint", label: "'click to enlarge' hint" },
      { kind: "text", key: "prevButton", label: "Prev button" },
      { kind: "text", key: "nextButton", label: "Next button" },
      { kind: "text", key: "websiteKicker", label: "Live-website kicker" },
      { kind: "text", key: "openLink", label: "'open' link" },
      { kind: "text", key: "documentsKicker", label: "Documents kicker" },
      { kind: "text", key: "printingKicker", label: "Printing kicker" },
      { kind: "text", key: "printingFile", label: "Printing window title" },
      { kind: "text", key: "calendarKicker", label: "Calendar kicker" },
      { kind: "text", key: "calendarWindow", label: "Calendar window title" },
      { kind: "text", key: "calendarTitle", label: "Calendar context title" },
      { kind: "text", key: "calendarBody", label: "Calendar context body ({client} = client name)", textarea: true },
      { kind: "stringList", key: "calendarPoints", label: "Calendar bullet points" },
      { kind: "text", key: "calendarCaption", label: "Calendar caption" },
      { kind: "text", key: "calendarAddCaption", label: "Calendar empty caption" },
      { kind: "text", key: "analyticsKicker", label: "Analytics kicker" },
      { kind: "text", key: "analyticsWindow", label: "Analytics window title" },
      { kind: "text", key: "resultLabel", label: "'Result' label" },
      { kind: "text", key: "reelsKicker", label: "Reels kicker" },
      { kind: "text", key: "galleryKicker", label: "Gallery kicker" },
      { kind: "text", key: "galleryWindow", label: "Gallery window title" },
      { kind: "text", key: "aboutGraphicLabel", label: "'About this graphic' label" },
      { kind: "text", key: "graphicKicker", label: "'Graphic' kicker" },
      { kind: "text", key: "madeWithLabel", label: "'Made with' label" },
      { kind: "text", key: "howLabel", label: "'How I made it' label" },
      { kind: "text", key: "workWithMe", label: "'Work with me' button" },
      { kind: "text", key: "allWork", label: "'All work' button" },
      { kind: "text", key: "notFoundTitle", label: "Not-found title" },
      { kind: "text", key: "notFoundBody", label: "Not-found body" },
      { kind: "text", key: "goHome", label: "'Go home' button" },
    ],
  },
];

export const HOME_FIELDS: Field[] = [
  {
    kind: "image",
    key: "profileImage",
    label: "Profile photo — shows on the home About card & the About page",
    help: IMG_HELP,
  },
  {
    kind: "objectList",
    key: "testimonials",
    label: "Testimonials",
    fields: [
      { kind: "text", key: "quote", label: "Quote", textarea: true },
      { kind: "text", key: "name", label: "Name" },
      { kind: "text", key: "brand", label: "Brand" },
      { kind: "text", key: "platform", label: "Platform", placeholder: "Facebook / Instagram" },
      { kind: "text", key: "initials", label: "Initials", placeholder: "ME" },
      { kind: "text", key: "color", label: "Color", placeholder: "oklch(…)" },
    ],
  },
  {
    kind: "objectList",
    key: "faqs",
    label: "FAQ",
    fields: [
      { kind: "text", key: "q", label: "Question" },
      { kind: "text", key: "a", label: "Answer", textarea: true },
    ],
  },
  {
    kind: "objectList",
    key: "services",
    label: "Services (home preview cards)",
    fields: [
      { kind: "text", key: "k", label: "Number", placeholder: "01" },
      { kind: "text", key: "title", label: "Title" },
      { kind: "text", key: "file", label: "File label", placeholder: "social_media.app" },
      { kind: "text", key: "tagline", label: "Tagline" },
      { kind: "text", key: "description", label: "Description", textarea: true },
      { kind: "stringList", key: "includes", label: "Includes" },
      { kind: "stringList", key: "tools", label: "Tools" },
      { kind: "text", key: "bestFor", label: "Best for", textarea: true },
    ],
  },
  {
    kind: "objectList",
    key: "process",
    label: "Process steps (How I Work)",
    fields: [
      { kind: "text", key: "n", label: "Number", placeholder: "01" },
      { kind: "text", key: "file", label: "File label", placeholder: "discovery.md" },
      { kind: "text", key: "title", label: "Title" },
      { kind: "text", key: "desc", label: "Description", textarea: true },
      { kind: "stringList", key: "details", label: "Details" },
    ],
  },
  {
    kind: "objectList",
    key: "posts",
    label: "Latest Work grid",
    fields: [
      { kind: "text", key: "id", label: "ID" },
      { kind: "image", key: "image", label: "Image", help: IMG_HELP },
      { kind: "text", key: "alt", label: "Alt text" },
    ],
  },
  {
    kind: "objectList",
    key: "tools",
    label: "Toolkit",
    help: "Icons are matched to the tool name in code; keep the name spelled the same to keep its icon.",
    fields: [
      { kind: "text", key: "name", label: "Name" },
      { kind: "image", key: "icon", label: "Icon (empty = built-in artwork)", help: IMG_HELP },
      { kind: "text", key: "category", label: "Category" },
      { kind: "text", key: "group", label: "Group", placeholder: "Creative / Marketing / AI / …" },
      { kind: "text", key: "how", label: "How I use it", textarea: true },
      { kind: "stringList", key: "usedFor", label: "Used for" },
    ],
  },
  {
    kind: "object",
    key: "notification",
    label: "macOS notification (slides in once per visit)",
    fields: [
      { kind: "text", key: "title", label: "Title" },
      { kind: "text", key: "time", label: "Time label", placeholder: "now" },
      { kind: "text", key: "body", label: "Body", textarea: true },
      { kind: "text", key: "cta", label: "CTA label", placeholder: "Reply →" },
      { kind: "text", key: "dismiss", label: "Dismiss label" },
    ],
  },
  {
    kind: "object",
    key: "about",
    label: "About section (homepage)",
    fields: [
      { kind: "text", key: "kickerWho", label: "Kicker — who i am" },
      { kind: "text", key: "kickerClients", label: "Kicker — clients" },
      { kind: "text", key: "kickerSkills", label: "Kicker — tools & skills" },
      { kind: "stringList", key: "statement", label: "Statement lines (first line solid, rest muted)" },
      { kind: "text", key: "paragraph", label: "Paragraph", textarea: true },
      {
        kind: "objectList",
        key: "stats",
        label: "Stats row",
        fields: [
          { kind: "text", key: "value", label: "Value" },
          { kind: "text", key: "label", label: "Label" },
        ],
      },
      {
        kind: "objectList",
        key: "clients",
        label: "Clients grid",
        fields: [
          { kind: "text", key: "name", label: "Name" },
          { kind: "text", key: "sub", label: "Subtitle" },
        ],
      },
      {
        kind: "objectList",
        key: "skills",
        label: "Tools & skills groups",
        fields: [
          { kind: "text", key: "cat", label: "Category" },
          { kind: "stringList", key: "items", label: "Items" },
        ],
      },
    ],
  },
  {
    kind: "object",
    key: "workAside",
    label: "Selected Work — sidebars & labels",
    fields: [
      { kind: "text", key: "availability", label: "Availability line" },
      { kind: "text", key: "stamp", label: "Right-side stamp", placeholder: "Shanzster · 2026" },
      { kind: "text", key: "folderHint", label: "Folder hint" },
      { kind: "text", key: "currentlyTitle", label: "'currently' card title" },
      { kind: "stringList", key: "currently", label: "Currently items" },
      { kind: "text", key: "numbersTitle", label: "'by the numbers' card title" },
      {
        kind: "objectList",
        key: "numbers",
        label: "Numbers",
        fields: [
          { kind: "text", key: "value", label: "Value" },
          { kind: "text", key: "label", label: "Label" },
        ],
      },
      { kind: "text", key: "servicesTitle", label: "'services' card title" },
      { kind: "stringList", key: "services", label: "Service chips" },
      { kind: "text", key: "clientsTitle", label: "'clients' card title" },
      {
        kind: "objectList",
        key: "clients",
        label: "Clients",
        fields: [
          { kind: "text", key: "name", label: "Name" },
          { kind: "text", key: "tag", label: "Tag" },
        ],
      },
      { kind: "text", key: "recentTitle", label: "'recent' card title" },
      {
        kind: "objectList",
        key: "recent",
        label: "Recent items",
        fields: [
          { kind: "text", key: "label", label: "Label" },
          { kind: "text", key: "time", label: "Time" },
        ],
      },
      { kind: "text", key: "ctaText", label: "CTA text" },
      { kind: "text", key: "ctaButton", label: "CTA button" },
    ],
  },
  {
    kind: "object",
    key: "heroFolder",
    label: "Hero folder scene (service papers)",
    help: "Icons and the fan layout stay in code; text is merged by position.",
    fields: [
      {
        kind: "objectList",
        key: "services",
        label: "Service papers",
        fields: [
          { kind: "text", key: "label", label: "Label" },
          { kind: "text", key: "tagline", label: "Tagline" },
          { kind: "stringList", key: "story", label: "Story paragraphs" },
          { kind: "stringList", key: "tags", label: "Tags" },
        ],
      },
      { kind: "stringList", key: "desktopLabels", label: "Desktop icon labels (order fixed in code)" },
      { kind: "text", key: "folderLabel", label: "Folder label" },
      { kind: "text", key: "hoverHint", label: "Hover hint" },
      { kind: "text", key: "chooseTitle", label: "Mobile modal title" },
      { kind: "text", key: "readMore", label: "'read more' hint" },
    ],
  },
  {
    kind: "object",
    key: "workFolder",
    label: "Selected Work folder scene",
    fields: [
      { kind: "text", key: "hintDesktop", label: "Hint (desktop)" },
      { kind: "text", key: "hintMobile", label: "Hint (mobile)" },
      { kind: "text", key: "openBadge", label: "Card hover badge" },
      { kind: "text", key: "selectedWorkKicker", label: "Mobile preview kicker" },
      { kind: "text", key: "checkoutHint", label: "Mobile checkout hint" },
      { kind: "text", key: "checkoutButton", label: "Mobile checkout button" },
      { kind: "text", key: "comingSoonKicker", label: "Coming-soon kicker" },
      { kind: "text", key: "comingSoonTitle", label: "Coming-soon title" },
      { kind: "text", key: "comingSoonBody", label: "Coming-soon body (before handle)" },
      { kind: "text", key: "comingSoonHandle", label: "Coming-soon handle" },
      { kind: "text", key: "comingSoonBodyEnd", label: "Coming-soon body (after handle)" },
      { kind: "text", key: "comingSoonFollow", label: "Follow button" },
      { kind: "text", key: "comingSoonGotIt", label: "Dismiss button" },
    ],
  },
  {
    kind: "object",
    key: "skimPrompt",
    label: "'In a hurry?' skim modal",
    fields: [
      { kind: "text", key: "windowTitle", label: "Window title" },
      { kind: "text", key: "title", label: "Title" },
      { kind: "text", key: "body", label: "Body", textarea: true },
      { kind: "text", key: "skimButton", label: "Skim button" },
      { kind: "text", key: "fullButton", label: "Full-site button" },
    ],
  },
  {
    kind: "object",
    key: "aboutScene",
    label: "About photo name tag",
    fields: [
      { kind: "text", key: "kicker", label: "Kicker" },
      { kind: "text", key: "name", label: "Name" },
      { kind: "text", key: "role", label: "Role line" },
    ],
  },
  {
    kind: "object",
    key: "site",
    label: "Hero, contact & footer text",
    fields: [
      { kind: "text", key: "heroBadge", label: "Hero badge line" },
      { kind: "text", key: "heroHeadlineTop", label: "Hero headline (line 1)" },
      { kind: "text", key: "heroHeadlineAccent", label: "Hero headline (line 2, muted)" },
      { kind: "image", key: "heroLogo", label: "Hero logo (empty = built-in logo)", help: IMG_HELP },
      { kind: "text", key: "heroCtaPrimary", label: "Hero CTA — primary" },
      { kind: "text", key: "heroCtaWork", label: "Hero CTA — see the work" },
      { kind: "text", key: "heroCtaCv", label: "Hero CTA — download CV" },
      { kind: "stringList", key: "heroRoles", label: "Hero rotating roles" },
      { kind: "stringList", key: "heroTicker", label: "Hero marquee items" },
      { kind: "text", key: "toolkitHeadline", label: "Toolkit headline" },
      {
        kind: "objectList",
        key: "sections",
        label: "Section headers (order: About, Work, Services, Process, Testimonials, Latest, FAQ, Contact)",
        fields: [
          { kind: "text", key: "index", label: "Number", placeholder: "01" },
          { kind: "text", key: "title", label: "Title" },
          { kind: "text", key: "subtitle", label: "Subtitle (optional)" },
        ],
      },
      { kind: "text", key: "servicesIncludesLabel", label: "Services — 'Includes' label" },
      { kind: "text", key: "servicesBestForLabel", label: "Services — 'Best for:' label" },
      { kind: "text", key: "servicesCtaTitle", label: "Services CTA title" },
      { kind: "text", key: "servicesCtaBody", label: "Services CTA body" },
      { kind: "text", key: "servicesCtaButton", label: "Services CTA button" },
      { kind: "text", key: "latestWindowTitle", label: "Latest Work window title" },
      { kind: "text", key: "latestFooterNote", label: "Latest Work footer note" },
      { kind: "text", key: "latestFooterLink", label: "Latest Work footer link label" },
      { kind: "text", key: "faqWindowTitle", label: "FAQ window title" },
      { kind: "text", key: "deliveredLabel", label: "Testimonial 'Delivered' label" },
      {
        kind: "objectList",
        key: "heroStats",
        label: "Hero stats strip",
        fields: [
          { kind: "text", key: "value", label: "Value" },
          { kind: "text", key: "label", label: "Label" },
        ],
      },
      {
        kind: "objectList",
        key: "aboutPills",
        label: "About-card stat pills",
        fields: [
          { kind: "text", key: "value", label: "Value" },
          { kind: "text", key: "label", label: "Label" },
        ],
      },
      { kind: "stringList", key: "ticker", label: "Hero ticker items" },
      { kind: "text", key: "weeklyTitle", label: "Weekly note title" },
      {
        kind: "objectList",
        key: "weeklyItems",
        label: "Weekly note items",
        fields: [
          { kind: "text", key: "text", label: "Text" },
          { kind: "bool", key: "done", label: "Done (checked)" },
        ],
      },
      { kind: "text", key: "weeklyNote", label: "Weekly note footer line" },
      { kind: "text", key: "contactEmail", label: "Contact email" },
      { kind: "text", key: "contactHeadlineTop", label: "Contact headline (line 1)" },
      { kind: "text", key: "contactHeadlineAccent", label: "Contact headline (line 2)" },
      { kind: "text", key: "contactBlurb", label: "Contact blurb", textarea: true },
      { kind: "text", key: "contactToLabel", label: "Contact 'To' label" },
      { kind: "text", key: "contactFromLabel", label: "Contact 'From' label" },
      { kind: "text", key: "contactFromValue", label: "Contact 'From' value" },
      { kind: "text", key: "contactSubjectLabel", label: "Contact 'Subject' label" },
      { kind: "text", key: "contactSubjectValue", label: "Contact 'Subject' value" },
      { kind: "text", key: "contactSendButton", label: "Send button label" },
      { kind: "text", key: "contactCopyButton", label: "Copy-email button label" },
      { kind: "text", key: "basedInLabel", label: "'Based in' label" },
      { kind: "text", key: "availabilityTitle", label: "Availability title" },
      { kind: "text", key: "availabilityBody", label: "Availability body", textarea: true },
      {
        kind: "objectList",
        key: "socials",
        label: "Socials list",
        fields: [
          { kind: "text", key: "label", label: "Label" },
          { kind: "text", key: "href", label: "URL" },
          { kind: "text", key: "handle", label: "Handle / display" },
        ],
      },
      { kind: "text", key: "locationCity", label: "Location city" },
      { kind: "text", key: "locationNote", label: "Location note" },
      { kind: "text", key: "footerBrand", label: "Footer brand" },
      { kind: "text", key: "footerBlurb", label: "Footer blurb", textarea: true },
      { kind: "text", key: "exploreTitle", label: "Footer 'Explore' title" },
      {
        kind: "objectList",
        key: "footerExplore",
        label: "Footer explore links",
        fields: [
          { kind: "text", key: "label", label: "Label" },
          { kind: "text", key: "href", label: "URL" },
        ],
      },
      { kind: "text", key: "connectTitle", label: "Footer 'Connect' title" },
      {
        kind: "objectList",
        key: "footerConnect",
        label: "Footer connect links",
        fields: [
          { kind: "text", key: "label", label: "Label" },
          { kind: "text", key: "href", label: "URL" },
        ],
      },
      { kind: "text", key: "footerCopyright", label: "Footer copyright" },
      { kind: "text", key: "searchHint", label: "'Press ⌘K to search' hint" },
      { kind: "text", key: "footerTagline", label: "Footer tagline" },
    ],
  },
];
