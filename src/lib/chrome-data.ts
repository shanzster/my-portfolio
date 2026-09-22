/* Route-level "chrome" text — page headers, buttons, empty-state labels — for
   the routes that don't have their own page doc. Stored as a single Firestore
   doc (pages/chrome) with this seed as fallback. */

export type MediaPageChrome = {
  back: string;
  kicker: string;
  title: string;
  blurb: string;
  countSuffix: string;
  viewFullSize: string;
  addLabel: string;
};

export type ComingSoonChrome = {
  windowTitle: string;
  kicker: string;
  title: string;
  body: string;
  handle: string;
  bodyEnd: string;
  follow: string;
  gotIt: string;
};

export type ChromeContent = {
  ads: MediaPageChrome;
  graphics: MediaPageChrome;
  calendars: MediaPageChrome;
  videos: MediaPageChrome & {
    lockedBadge: string;
    lockedTile: string;
    comingSoon: ComingSoonChrome;
  };
  servicesPage: {
    back: string;
    kicker: string;
    titleTop: string;
    titleAccent: string;
    blurb: string;
    countSuffix: string;
    includesLabel: string;
    bestForLabel: string;
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
  };
  socialsPage: {
    back: string;
    kicker: string;
    titleTop: string;
    titleAccent: string;
    blurb: string;
    igSuffix: string;
    accountsSuffix: string;
    myBusinessBadge: string;
    soonBadge: string;
    followLabel: string;
    viewLabel: string;
    note: string;
  };
  galleryPage: {
    back: string;
    kicker: string;
    titleTop: string;
    titleAccent: string;
    blurb: string;
    filesSuffix: string;
    foldersSuffix: string;
    openSuffix: string;
    recentsLabel: string;
    clickToPreview: string;
    itemsLabel: string;
    allFoldersButton: string;
    viewLabel: string;
    addMediaLabel: string;
    addNote: string;
  };
  clientsPage: {
    back: string;
    kicker: string;
    titleTop: string;
    titleAccent: string;
    blurb: string;
    finderTitle: string;
    itemsSuffix: string;
    statusPath: string;
    shownSuffix: string;
    colName: string;
    colCategory: string;
    colPlatform: string;
    colStatus: string;
    activeLabel: string;
    soonLabel: string;
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    comingSoon: ComingSoonChrome;
    aboutLabel: string;
    servicesLabel: string;
    viewPage: string;
    fullCaseStudy: string;
    caseStudySoon: string;
    addScreenshotLabel: string;
  };
  workDetail: {
    back: string;
    beforeAfterKicker: string;
    beforeFile: string;
    afterFile: string;
    beforeKicker: string;
    graphicsKicker: string;
    graphicsHint: string;
    graphicsFolderLabel: string;
    graphicTooltipHint: string;
    carouselKicker: string;
    carouselWindow: string;
    carouselTitle: string;
    carouselBody: string;
    carouselSteps: { n: string; t: string; d: string }[];
    enlargeHint: string;
    prevButton: string;
    nextButton: string;
    websiteKicker: string;
    openLink: string;
    documentsKicker: string;
    printingKicker: string;
    printingFile: string;
    calendarKicker: string;
    calendarWindow: string;
    calendarTitle: string;
    calendarBody: string;
    calendarPoints: string[];
    calendarCaption: string;
    calendarAddCaption: string;
    analyticsKicker: string;
    analyticsWindow: string;
    resultLabel: string;
    reelsKicker: string;
    galleryKicker: string;
    galleryWindow: string;
    aboutGraphicLabel: string;
    graphicKicker: string;
    madeWithLabel: string;
    howLabel: string;
    workWithMe: string;
    allWork: string;
    notFoundTitle: string;
    notFoundBody: string;
    goHome: string;
  };
};

export const CHROME: ChromeContent = {
  ads: {
    back: "← Back to Gallery",
    kicker: "Gallery · Ads",
    title: "Campaign Analytics",
    blurb: "Analytics reports, content calendars, and campaign performance data",
    countSuffix: "campaign pieces.",
    viewFullSize: "View Full Size",
    addLabel: "Add Ad",
  },
  graphics: {
    back: "← Back to Gallery",
    kicker: "Gallery · Graphics",
    title: "Graphics & Visuals",
    blurb: "Brand posts, story templates, promo graphics and more",
    countSuffix: "pieces showcasing social media design work.",
    viewFullSize: "View Full Size",
    addLabel: "Add Graphic",
  },
  calendars: {
    back: "← Back to Gallery",
    kicker: "Gallery · Calendars",
    title: "Content Calendars",
    blurb: "Monthly editorial calendars, posting schedules, and campaign timelines",
    countSuffix: "planning documents.",
    viewFullSize: "View Full Size",
    addLabel: "Add Calendar",
  },
  videos: {
    back: "← Back to Gallery",
    kicker: "Gallery · Videos",
    title: "Videos & Reels",
    blurb: "Reels, vlogs, promo videos, motion captions, and collection launches — currently being built.",
    countSuffix: "",
    viewFullSize: "View Full Size",
    addLabel: "Add Video",
    lockedBadge: "building",
    lockedTile: "Video",
    comingSoon: {
      windowTitle: "Videos & Reels",
      kicker: "Building it",
      title: "Videos section is being built.",
      body: "Come back later to see all the video content — or get updates on",
      handle: "@shanzster.zip",
      bodyEnd: "on Instagram.",
      follow: "Follow @shanzster.zip ↗",
      gotIt: "Got it",
    },
  },
  servicesPage: {
    back: "← Back",
    kicker: "Services",
    titleTop: "What I can",
    titleAccent: "do for you.",
    blurb:
      "The full marketing stack for business owners who don't want to deal with marketing — or don't have the time — from social and branding to Shopify store builds and AI-generated content. Pick a service, or mix and match.",
    countSuffix: "services",
    includesLabel: "Includes",
    bestForLabel: "Best for:",
    ctaTitle: "Not sure which fits?",
    ctaBody: "Tell me about your brand and we'll figure out the right mix.",
    ctaButton: "Get in touch →",
  },
  socialsPage: {
    back: "← Gallery",
    kicker: "Socials",
    titleTop: "The accounts",
    titleAccent: "I run.",
    blurb: "Every store and page I manage, laid out like a feed. Tap a post to open it live; tap Follow to open the account.",
    igSuffix: "Instagram",
    accountsSuffix: "accounts",
    myBusinessBadge: "★ My Business",
    soonBadge: "Soon",
    followLabel: "Follow",
    viewLabel: "View",
    note: "Free & no API: on Instagram, open a post → ⋯ → Copy link, then paste it into that account's posts list in the admin. It fills a grid tile and opens live on click.",
  },
  galleryPage: {
    back: "← Back",
    kicker: "Gallery",
    titleTop: "All the work.",
    titleAccent: "Every piece.",
    blurb: "Graphics, video, and the numbers behind them — organized the way I'd organize a desktop. Hover a folder to peek inside.",
    filesSuffix: "files",
    foldersSuffix: "folders",
    openSuffix: "items · open →",
    recentsLabel: "Recents",
    clickToPreview: "click to preview",
    itemsLabel: "items",
    allFoldersButton: "← All folders",
    viewLabel: "View →",
    addMediaLabel: "add media",
    addNote: "Add or edit items in the Gallery tab of /admin — set each item's image to a file path or URL.",
  },
  clientsPage: {
    back: "← Back",
    kicker: "Clients",
    titleTop: "Brands I've",
    titleAccent: "worked with.",
    blurb: "Every client is different — different audience, different voice, different goal. Click a client to see how I worked with them.",
    finderTitle: "Finder — clients",
    itemsSuffix: "items",
    statusPath: "Macintosh HD ▸ shanzster ▸ Clients",
    shownSuffix: "shown",
    colName: "Name",
    colCategory: "Category",
    colPlatform: "Platform",
    colStatus: "Status",
    activeLabel: "Active",
    soonLabel: "Soon",
    ctaTitle: "Want to be on this list?",
    ctaBody: "I'm open to new clients. Let's talk.",
    ctaButton: "Get in touch →",
    comingSoon: {
      windowTitle: "The Snappy Nomad",
      kicker: "Coming Soon",
      title: "Brand is being built right now.",
      body: "Come back later to see it — or get updates on",
      handle: "@shanzster.zip",
      bodyEnd: "on Instagram.",
      follow: "Follow @shanzster.zip ↗",
      gotIt: "Got it",
    },
    aboutLabel: "About this client",
    servicesLabel: "Services provided",
    viewPage: "View page ↗",
    fullCaseStudy: "Full case study →",
    caseStudySoon: "Case study coming soon",
    addScreenshotLabel: "add screenshot",
  },
  workDetail: {
    back: "← Back to work",
    beforeAfterKicker: "Before & After",
    beforeFile: "before.jpeg",
    afterFile: "after.md",
    beforeKicker: "The starting point",
    graphicsKicker: "Graphics I Designed",
    graphicsHint: "hover to open",
    graphicsFolderLabel: "graphics",
    graphicTooltipHint: "click to learn more",
    carouselKicker: "Carousel Post",
    carouselWindow: "carousel_post.instagram",
    carouselTitle: "How I build carousels.",
    carouselBody:
      "Carousels are one of the highest-engagement post formats on Facebook and Instagram. Each slide needs to earn the swipe — a hook on slide 1, value in the middle, and a clear CTA at the end.",
    carouselSteps: [
      { n: "01", t: "Hook slide", d: "Slide 1 stops the scroll — bold headline, strong visual" },
      { n: "02", t: "Value slides", d: "Middle slides deliver the content — tips, steps, or info" },
      { n: "03", t: "CTA slide", d: "Final slide drives action — follow, save, or contact" },
      { n: "04", t: "Brand consistency", d: "Every slide uses the same colors, fonts, and layout system" },
    ],
    enlargeHint: "click to enlarge",
    prevButton: "← Prev",
    nextButton: "Next →",
    websiteKicker: "Live Website",
    openLink: "open ↗",
    documentsKicker: "Documents & Reports",
    printingKicker: "Printing Guidelines",
    printingFile: "PrintingGuidelines.pdf",
    calendarKicker: "Content Calendar",
    calendarWindow: "content_calendar.notion",
    calendarTitle: "The system behind the content.",
    calendarBody:
      "Every post on {client} was planned. This is the content calendar I built — mapping out posts by content pillar, format, and date so nothing was ever random.",
    calendarPoints: ["Content pillars defined", "Posts planned 2–4 weeks ahead", "Format variety (posts, stories, reels)", "Aligned with key dates & trends"],
    calendarCaption: "Content calendar",
    calendarAddCaption: "Add your Notion/calendar screenshot here",
    analyticsKicker: "Analytics & Results",
    analyticsWindow: "analytics.csv",
    resultLabel: "Result",
    reelsKicker: "Reels & Video",
    galleryKicker: "Everything I Made",
    galleryWindow: "gallery.finder",
    aboutGraphicLabel: "About this graphic",
    graphicKicker: "Graphic",
    madeWithLabel: "Made with",
    howLabel: "How I made it",
    workWithMe: "Work with me →",
    allWork: "← All work",
    notFoundTitle: "Project not found",
    notFoundBody: "This case study doesn't exist or was removed.",
    goHome: "Go home",
  },
};
