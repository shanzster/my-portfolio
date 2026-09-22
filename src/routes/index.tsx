import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { MacWindow } from "@/components/MacWindow";
import { SelectingRoles } from "@/components/SelectingRoles";
import { HeroFolder } from "@/components/HeroFolder";
import { NavBar } from "@/components/NavBar";
import { SkimPrompt } from "@/components/SkimPrompt";
import { AboutScene } from "@/components/AboutScene";
import { WorkFolderScene } from "@/components/WorkFolder";
import { useWork, useHome } from "@/lib/content";
import { EditableText, EditableImage, useEdit } from "@/lib/edit-mode";
import { Reveal } from "@/hooks/useScrollReveal";
import logoImage from "@/image_reference/logos/Shanzster_Logo.png";
import photoshopLogo from "@/image_reference/logos/PS.png";
import illustratorLogo from "@/image_reference/logos/AI.png";
import canvaLogo from "@/image_reference/logos/canva.png";
import capcutLogo from "@/image_reference/logos/capcut.png";
import metaLogo from "@/image_reference/logos/meta.png";
import { TrafficLights } from "@/components/TrafficLights";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Shanzster — Social Media Manager & Creative Developer" },
      {
        name: "description",
        content:
          "Shanzster — Social media manager and creative developer from Subic Bay, Philippines. I run the full marketing stack for business owners who don't want to deal with marketing — or don't have time for it: Google Ads, Meta Ads, content, and branding.",
      },
      { property: "og:title", content: "Shanzster — Social Media Manager & Creative Developer" },
      { property: "og:description", content: "Full-stack marketing for fashion e-commerce brands — Google Ads, Meta Ads, social media management, and branding." },
      { property: "og:type", content: "website" },
    ],
  }),
});



/* ───────── macOS NOTIFICATION — slides in once per session ───────── */
function MacNotification() {
  const { data: home } = useHome();
  const notif = home.notification;
  const { editing } = useEdit();
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("shz-notif-shown")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => {
      setShow(true);
      sessionStorage.setItem("shz-notif-shown", "1");
    }, 3500);
    return () => clearTimeout(t);
  }, []);

  // Keep the notification on screen while edit mode is on so it can be edited.
  useEffect(() => {
    if (editing) {
      setShow(true);
      setLeaving(false);
    }
  }, [editing]);

  useEffect(() => {
    if (!show || leaving || editing) return;
    const t = setTimeout(() => setLeaving(true), 9000);
    return () => clearTimeout(t);
  }, [show, leaving, editing]);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => setShow(false), 400);
    return () => clearTimeout(t);
  }, [leaving]);

  if (!show) return null;

  return (
    <div
      className="fixed right-4 z-[90]"
      style={{
        top: 44,
        animation: leaving
          ? "notif-out 0.4s ease both"
          : "notif-in 0.5s cubic-bezier(.2,.8,.2,1) both",
      }}
    >
      <div
        className="w-[320px] max-w-[calc(100vw-32px)] rounded-[14px] border border-border bg-card/95 p-3.5 flex gap-3"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 12px 40px -10px oklch(0.2 0.02 240 / 0.3), 0 0 0 0.5px oklch(0.5 0.01 240 / 0.1)",
        }}
      >
        {/* App icon */}
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] text-[15px] text-white"
          style={{ background: "oklch(0.62 0.18 255)" }}
        >
          ✦
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <EditableText page="home" path={["notification", "title"]} value={notif.title} as="p" className="text-[12px] font-semibold tracking-tight text-foreground" />
            <EditableText page="home" path={["notification", "time"]} value={notif.time} as="span" className="text-[10px] tracking-tight text-foreground/35 shrink-0" />
          </div>
          <EditableText page="home" path={["notification", "body"]} value={notif.body} as="p" className="text-[12px] leading-snug tracking-tight text-foreground/60" />
          <div className="mt-2 flex items-center gap-3">
            <a
              href="#contact"
              onClick={() => setLeaving(true)}
              className="text-[11px] font-medium tracking-tight text-foreground hover:opacity-70 transition"
            >
              <EditableText page="home" path={["notification", "cta"]} value={notif.cta} />
            </a>
            <button
              onClick={() => setLeaving(true)}
              className="text-[11px] tracking-tight text-foreground/40 hover:text-foreground/70 transition"
            >
              <EditableText page="home" path={["notification", "dismiss"]} value={notif.dismiss} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <MacNotification />
      <SkimPrompt />
      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 pb-28 pt-6">
        <Hero />
        <Reveal><About /></Reveal>
        <Reveal delay={50}><Toolkit /></Reveal>
        <Reveal delay={50}><Work /></Reveal>
        <Reveal delay={50}><Services /></Reveal>
        <Reveal delay={50}><Process /></Reveal>
        <Reveal delay={50}><Testimonials /></Reveal>
        <Reveal delay={50}><SocialFeed /></Reveal>
        <Reveal delay={50}><FAQ /></Reveal>
        <Reveal delay={50}><Contact /></Reveal>
        <Footer />
      </main>
    </div>
  );
}

/* ───────── HERO ───────── */
function Hero() {
  const { data: home } = useHome();
  const site = home.site;
  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "calc(100dvh - 6rem - 28px)" }}
    >
      {/* Gradient wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, oklch(0.74 0.13 240 / 0.13) 0%, transparent 70%), radial-gradient(ellipse 45% 35% at 88% 12%, oklch(0.78 0.10 260 / 0.07) 0%, transparent 60%)",
        }}
      />

      {/* Layout: flex column, text on top, folder fills rest */}
      <div className="relative z-10 flex h-full flex-col">

        {/* ── Text block — centered, fixed height (z-20 keeps title/subtitle above the folder canvas) ── */}
        <div className="relative z-20 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-14 pt-6 pb-2 text-center" style={{ flexShrink: 0 }}>

          {/* Eyebrow */}
          <div className="flex flex-col items-center gap-2 mb-3 hero-drop hero-drop-1">
            <EditableImage
              page="home"
              path={["site", "heroLogo"]}
              src={site.heroLogo || logoImage}
              alt="Shanzster Logo"
              className="h-6 sm:h-8 w-auto object-contain"
            />
            <div className="flex items-center gap-2">
              <span
                className="pulse-dot h-1.5 w-1.5 rounded-full"
                style={{ background: "var(--traffic-green)" }}
              />
              <EditableText
                page="home"
                path={["site", "heroBadge"]}
                value={site.heroBadge}
                as="p"
                className="text-[9px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.26em] text-foreground/40 text-center"
              />
            </div>
          </div>

          {/* Headline — single h1, muted accent on the second line */}
          <h1
            className="font-bold tracking-tightest text-foreground leading-[0.9]"
            style={{ fontSize: "clamp(32px, 7vw, 88px)" }}
          >
            <EditableText page="home" path={["site", "heroHeadlineTop"]} value={site.heroHeadlineTop} as="span" className="block hero-drop hero-drop-2" />
            <span className="block hero-drop hero-drop-3" style={{ color: "oklch(0.18 0.01 240 / 0.25)" }}>
              <EditableText page="home" path={["site", "heroHeadlineAccent"]} value={site.heroHeadlineAccent} />
            </span>
          </h1>

          {/* Sub-line */}
          <p className="mt-3 text-[clamp(12px,1.8vw,16px)] tracking-tight text-foreground/45 max-w-sm hero-drop hero-drop-4">
            <SelectingRoles />
            <span className="blink text-foreground/40">|</span>
          </p>

          {/* CTAs — removed from here, moved below folder */}
        </div>

        {/* ── Folder canvas. Full-size folder in its own box: min-height floors
             it so it's never crushed (the hero grows instead), and the top
             margin guarantees a gap so the fan never touches the title. z-10
             sits below the text block (z-20). ── */}
        <div className="relative z-10 flex-1 hero-drop hero-drop-5 mt-0 sm:mt-1" style={{ minHeight: 480 }}>
          <HeroFolder />
        </div>

        {/* ── CTAs — below the folder ── */}
        <div className="flex items-center justify-center gap-3 py-4 hero-drop hero-drop-6" style={{ flexShrink: 0 }}>
          <a
            href="#contact"
            className="cta-primary rounded-full px-5 py-2 sm:px-6 sm:py-2.5 text-[11px] sm:text-[12px] font-medium tracking-tight"
          >
            <EditableText page="home" path={["site", "heroCtaPrimary"]} value={site.heroCtaPrimary} />
          </a>
          <a
            href="#work"
            className="rounded-full bg-foreground px-4 py-1.5 sm:px-5 sm:py-2 text-[11px] sm:text-[12px] tracking-tight text-background transition hover:opacity-85"
          >
            <EditableText page="home" path={["site", "heroCtaWork"]} value={site.heroCtaWork} />
          </a>
          <a
            href="/ALARCON_SA_CV_MVA.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border bg-card px-4 py-1.5 sm:px-5 sm:py-2 text-[11px] sm:text-[12px] tracking-tight text-foreground/70 transition hover:bg-secondary hover:text-foreground"
          >
            <EditableText page="home" path={["site", "heroCtaCv"]} value={site.heroCtaCv} />
          </a>
        </div>

        {/* ── Stats strip — pinned to bottom ── */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 divide-x sm:divide-x divide-border border-t border-border/40 hero-drop hero-drop-7"
          style={{ flexShrink: 0 }}
        >
          {site.heroStats.map((s, i) => (
            <Stat key={i} i={i} value={s.value} label={s.label} />
          ))}
        </div>

        {/* ── Marquee — freezes to a single editable row in edit mode ── */}
        <HeroMarquee items={site.heroTicker} />
      </div>
    </section>
  );
}

function HeroMarquee({ items }: { items: string[] }) {
  const { editing } = useEdit();
  return (
    <div
      className={`overflow-hidden border-t border-border/30 bg-secondary/30 ${editing ? "" : "ticker-mask"}`}
      style={{ flexShrink: 0 }}
    >
      {editing ? (
        <div className="flex flex-wrap gap-x-8 gap-y-2 py-2.5 px-4 text-[11px] tracking-tight text-foreground/35">
          {items.map((t, i) => (
            <span key={i} className="flex items-center gap-3">
              <span className="text-foreground/20">✦</span>
              <EditableText page="home" path={["site", "heroTicker", i]} value={t} />
            </span>
          ))}
        </div>
      ) : (
        <div className="ticker flex gap-10 whitespace-nowrap py-2.5 text-[11px] tracking-tight text-foreground/35">
          {items.flatMap((t, i, a) => [...a, ...a]).map((t, i) => (
            <span key={i} className="flex items-center gap-10">
              <span className="text-foreground/20">✦</span>
              <span>{t}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ i, value, label }: { i: number; value: string; label: string }) {
  const { editing } = useEdit();
  return (
    <div className="px-3 py-2 sm:px-5 sm:py-4">
      <div className="text-[22px] sm:text-[28px] leading-none tracking-tightest font-bold">
        {editing ? (
          <EditableText page="home" path={["site", "heroStats", i, "value"]} value={value} />
        ) : (
          <CountUp value={value} />
        )}
      </div>
      <EditableText
        page="home"
        path={["site", "heroStats", i, "label"]}
        value={label}
        as="div"
        className="mt-1 text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-foreground/45"
      />
    </div>
  );
}

/* Counts numeric values up from 0 when scrolled into view; non-numeric values render as-is */
function CountUp({ value, duration = 900 }: { value: string; duration?: number }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : "";
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(target === null ? value : "0");

  useEffect(() => {
    if (target === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(`${target}${suffix}`);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
          setDisplay(`${Math.round(eased * target)}${t === 1 ? suffix : ""}`);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, suffix, duration]);

  return <span ref={ref}>{display}</span>;
}

/* ───────── TICKER ───────── */
function Ticker() {
  const { data: home } = useHome();
  const items = home.site.ticker;
  return (
    <div className="overflow-hidden border-y border-border bg-secondary/40 py-3">
      <div className="ticker flex gap-12 whitespace-nowrap text-[13px] tracking-tight text-foreground/70">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            <span>● {t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────── TOOLS SHOWCASE ───────── */

const TOOLS = [
  // ── Creative ──
  {
    name: "Photoshop",
    category: "Photo editing",
    group: "Creative",
    how: "I use Photoshop for retouching campaign photos, building social media templates, and creating high-quality thumbnails and promotional visuals that stop the scroll.",
    usedFor: ["Campaign visuals", "Photo retouching", "Thumbnail design", "Ad creatives"],
    lineX: -70, lineY: 38, labelAlign: "right" as const,
    icon: <img src={photoshopLogo} alt="Photoshop" className="w-full h-full object-cover rounded-[16px]" />,
  },
  {
    name: "Illustrator",
    category: "Vector design",
    group: "Creative",
    how: "Illustrator is my go-to for building brand identities from scratch — logos, icon sets, brand guidelines, and print-ready assets that scale perfectly at any size.",
    usedFor: ["Logo design", "Brand identity", "Icon sets", "Print assets"],
    lineX: 70, lineY: -38, labelAlign: "left" as const,
    icon: <img src={illustratorLogo} alt="Illustrator" className="w-full h-full object-cover rounded-[16px]" />,
  },
  {
    name: "Canva",
    category: "Brand visuals",
    group: "Creative",
    how: "Canva is where I build fast, on-brand content at scale — social posts, stories, decks, and client-ready presentations. I use it to maintain visual consistency across all platforms.",
    usedFor: ["Social posts", "Stories", "Pitch decks", "Brand templates"],
    lineX: 70, lineY: 44, labelAlign: "left" as const,
    icon: <img src={canvaLogo} alt="Canva" className="w-full h-full object-cover rounded-[16px]" />,
  },
  {
    name: "CapCut",
    category: "Video editing",
    group: "Creative",
    how: "CapCut is my primary video editor for Reels and short-form content. I use it for freeze-frame edits, motion captions, sound design, and cinematic cuts that drive replays.",
    usedFor: ["Reels editing", "Motion captions", "Vlogs", "Promo videos"],
    lineX: -70, lineY: 44, labelAlign: "right" as const,
    icon: <img src={capcutLogo} alt="CapCut" className="w-full h-full object-cover rounded-[16px]" />,
  },
  // ── Marketing ──
  {
    name: "Meta Ads",
    category: "Paid social",
    group: "Marketing",
    how: "I use Meta Ads Manager to plan, launch, and optimize paid campaigns on Facebook and Instagram — from audience targeting and creative testing to budget management and performance reporting.",
    usedFor: ["Campaign setup", "Audience targeting", "A/B testing", "Performance reports"],
    lineX: -70, lineY: -38, labelAlign: "right" as const,
    icon: <img src={metaLogo} alt="Meta Ads" className="w-full h-full object-cover rounded-[16px]" />,
  },
  {
    name: "Google Ads",
    category: "Paid search & shopping",
    group: "Marketing",
    how: "I run Google Ads for fashion e-commerce brands — search and shopping campaigns that capture buyers who are already looking. Keyword strategy, campaign structure, conversion tracking, and budget optimization.",
    usedFor: ["Search campaigns", "Shopping ads", "Conversion tracking", "Budget optimization"],
    lineX: 70, lineY: 38, labelAlign: "left" as const,
    icon: <svg viewBox="0 0 100 100" className="w-full h-full"><rect width="100" height="100" rx="16" fill="#fff" stroke="#e5e5e5" strokeWidth="2"/><g transform="translate(22,26)"><rect x="0" y="14" width="16" height="34" rx="8" transform="rotate(-30 8 31)" fill="#fbbc04"/><rect x="20" y="0" width="16" height="48" rx="8" transform="rotate(30 28 24)" fill="#4285f4"/><circle cx="10" cy="41" r="8" fill="#34a853"/></g></svg>,
  },
  {
    name: "SocialBlade",
    category: "Analytics & trends",
    group: "Marketing",
    how: "SocialBlade helps me track competitor growth, benchmark page performance, and spot trends before they peak. I use it to inform content strategy and identify what's working in a niche.",
    usedFor: ["Competitor tracking", "Growth benchmarking", "Trend spotting", "Niche research"],
    lineX: 70, lineY: -38, labelAlign: "left" as const,
    icon: <svg viewBox="0 0 100 100" className="w-full h-full"><rect width="100" height="100" rx="16" fill="#1a1a2e"/><text x="50" y="58" textAnchor="middle" fontSize="13" fontWeight="800" fill="#e94560" fontFamily="Arial, sans-serif">SB</text></svg>,
  },
  {
    name: "Klaviyo",
    category: "Email & SMS",
    group: "Marketing",
    how: "Klaviyo is my email & SMS engine for e-commerce — welcome and abandoned-cart flows, campaign sends, segmentation, and automations that turn subscribers into repeat buyers on autopilot.",
    usedFor: ["Email flows", "Abandoned cart", "Campaigns", "Segmentation"],
    lineX: -70, lineY: -38, labelAlign: "right" as const,
    icon: <svg viewBox="0 0 100 100" className="w-full h-full"><rect width="100" height="100" rx="16" fill="#232426"/><text x="50" y="60" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif">Klaviyo</text></svg>,
  },
  // ── Productivity ──
  {
    name: "Notion",
    category: "Planning & docs",
    group: "Productivity",
    how: "Notion is my content command center. I use it to build editorial calendars, track campaign briefs, manage client deliverables, and document brand guidelines — everything in one place.",
    usedFor: ["Content calendars", "Campaign briefs", "Client docs", "Brand guidelines"],
    lineX: -70, lineY: 44, labelAlign: "right" as const,
    icon: <svg viewBox="0 0 100 100" className="w-full h-full"><rect width="100" height="100" rx="16" fill="#fff" stroke="#e5e5e5" strokeWidth="2"/><text x="50" y="66" textAnchor="middle" fontSize="48" fontWeight="900" fill="#000" fontFamily="Arial, sans-serif">N</text></svg>,
  },
  // ── E-commerce ──
  {
    name: "PPSpy",
    category: "Ad intelligence",
    group: "E-commerce",
    how: "PPSpy is my ad research tool — I use it to spy on competitor ads and Shopify stores, spot winning products, and validate what's actually selling before I build campaigns around it.",
    usedFor: ["Competitor ad research", "Winning products", "Store analysis", "Trend validation"],
    lineX: -70, lineY: 38, labelAlign: "right" as const,
    icon: <svg viewBox="0 0 100 100" className="w-full h-full"><rect width="100" height="100" rx="16" fill="#1e3a8a"/><text x="50" y="62" textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif">PPSpy</text></svg>,
  },
  {
    name: "Poky",
    category: "Product importing",
    group: "E-commerce",
    how: "Poky handles product importing for the Shopify stores I manage — pulling products in fast with clean titles, images, and variants so fashion catalogs go live in hours, not days.",
    usedFor: ["Shopify imports", "Catalog setup", "Product listings", "Store operations"],
    lineX: 70, lineY: -38, labelAlign: "left" as const,
    icon: <svg viewBox="0 0 100 100" className="w-full h-full"><rect width="100" height="100" rx="16" fill="#15803d"/><text x="50" y="62" textAnchor="middle" fontSize="18" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif">Poky</text></svg>,
  },
  // ── AI ──
  {
    name: "Claude",
    category: "AI assistant",
    group: "AI",
    how: "Claude is my thinking partner for strategy and copy — campaign angles, long-form writing, brand voice refinement, and research. It handles the heavy reasoning so I can move faster on execution.",
    usedFor: ["Strategy drafts", "Long-form copy", "Brand voice", "Research"],
    lineX: -70, lineY: 44, labelAlign: "right" as const,
    icon: <svg viewBox="0 0 100 100" className="w-full h-full"><rect width="100" height="100" rx="16" fill="#d97757"/><text x="50" y="62" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif">Claude</text></svg>,
  },
  {
    name: "Claude Code",
    category: "AI coding",
    group: "AI",
    how: "Claude Code is how I build and maintain the web side of my work — this portfolio, client landing pages, and quick web tweaks — straight from the terminal, without needing a dev team.",
    usedFor: ["This portfolio", "Landing pages", "Web tweaks", "Automation"],
    lineX: 70, lineY: 38, labelAlign: "left" as const,
    icon: <svg viewBox="0 0 100 100" className="w-full h-full"><rect width="100" height="100" rx="16" fill="#1f1e1d"/><text x="30" y="60" textAnchor="middle" fontSize="22" fontWeight="800" fill="#d97757" fontFamily="Menlo, monospace">&gt;</text><rect x="42" y="52" width="26" height="7" rx="2" fill="#d97757"/></svg>,
  },
  {
    name: "Higgsfield AI",
    category: "AI video & image",
    group: "AI",
    how: "Higgsfield AI generates video and image content for campaigns — concept visuals, motion experiments, and AI-driven ad creatives that would be impossible to shoot on a small-brand budget.",
    usedFor: ["AI video", "Concept visuals", "Ad creatives", "Content experiments"],
    lineX: -70, lineY: -44, labelAlign: "right" as const,
    icon: <svg viewBox="0 0 100 100" className="w-full h-full"><rect width="100" height="100" rx="16" fill="#0f0f10"/><text x="50" y="66" textAnchor="middle" fontSize="40" fontWeight="800" fill="#fff" fontFamily="Arial, sans-serif">H</text></svg>,
  },
  {
    name: "ChatGPT",
    category: "AI writing",
    group: "AI",
    how: "I use ChatGPT to accelerate content creation — drafting captions, brainstorming campaign angles, writing ad copy variations, and refining brand voice. It's a creative partner, not a replacement.",
    usedFor: ["Caption writing", "Ad copy", "Campaign ideation", "Brand voice"],
    lineX: 70, lineY: 44, labelAlign: "left" as const,
    icon: <svg viewBox="0 0 100 100" className="w-full h-full"><rect width="100" height="100" rx="16" fill="#10a37f"/><text x="50" y="62" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">ChatGPT</text></svg>,
  },
  {
    name: "Adobe Firefly",
    category: "AI image gen",
    group: "AI",
    how: "Adobe Firefly lets me generate and edit visuals directly inside Photoshop and Illustrator — filling backgrounds, generating concept art, and creating on-brand imagery faster than traditional methods.",
    usedFor: ["Generative fill", "Concept visuals", "Background gen", "Creative exploration"],
    lineX: -70, lineY: -38, labelAlign: "right" as const,
    icon: <svg viewBox="0 0 100 100" className="w-full h-full"><rect width="100" height="100" rx="16" fill="#1c0a3a"/><text x="50" y="62" textAnchor="middle" fontSize="13" fontWeight="700" fill="#e040fb" fontFamily="Arial, sans-serif">Firefly</text></svg>,
  },
];


/* The TOOLS array above stays in code purely as the icon source (bespoke SVGs /
   logos can't live in the database). Text is CMS-managed and merged by name. */
const TOOL_ICON_BY_NAME: Record<string, React.ReactNode> = Object.fromEntries(
  TOOLS.map((t) => [t.name, t.icon]),
);

function toolIcon(name: string): React.ReactNode {
  return (
    TOOL_ICON_BY_NAME[name] ?? (
      <div className="flex h-full w-full items-center justify-center bg-secondary text-[13px] font-bold text-foreground/50">
        {name.charAt(0)}
      </div>
    )
  );
}

/* Tool icon with a CMS override: an uploaded image wins over the built-in
   artwork; in edit mode a hover overlay lets the admin replace/clear it. */
function ToolCmsIcon({ tool, ti }: { tool: { name: string; icon?: string }; ti: number }) {
  const { editing } = useEdit();
  const base = tool.icon ? (
    <img src={tool.icon} alt={tool.name} className="h-full w-full object-cover" />
  ) : (
    toolIcon(tool.name)
  );
  if (!editing) return <>{base}</>;
  return (
    <span className="relative block h-full w-full">
      {base}
      <EditableImage
        page="home"
        path={["tools", ti, "icon"]}
        src={tool.icon ?? ""}
        alt={tool.name}
        wrapperClassName="absolute inset-0 block"
        className="h-full w-full object-cover"
      />
    </span>
  );
}

function ToolsShowcase() {
  const { data: home } = useHome();
  const tools = home.tools;
  return (
    <div className="rounded-[16px] border border-border bg-card overflow-hidden">

      {/* ── Top: headline + single icon row ── */}
      <div className="relative px-4 sm:px-10 pt-8 sm:pt-12 pb-8 sm:pb-10 border-b border-border">
        {[
          { top: "14%", left: "3%" }, { top: "10%", left: "20%" },
          { top: "12%", right: "22%" }, { top: "14%", right: "4%" },
        ].map((pos, i) => (
          <span key={i} className="hidden sm:block absolute select-none pointer-events-none text-[11px]" style={{ ...pos as React.CSSProperties, color: "oklch(0.18 0.01 240 / 0.15)" }}>★</span>
        ))}

        <EditableText
          page="home"
          path={["site", "toolkitHeadline"]}
          value={home.site.toolkitHeadline}
          as="h2"
          className="text-center font-bold tracking-tightest leading-none block"
          style={{ fontSize: "clamp(28px, 5.5vw, 72px)", color: "oklch(0.38 0.22 255)" }}
        />

        {/* Single row of all icons */}
        <div className="mt-6 sm:mt-10 flex items-center justify-center gap-3 sm:gap-5 flex-wrap">
          {tools.map((tool, ti) => (
            <div key={ti} className="flex flex-col items-center gap-1.5 group">
              <div
                className="rounded-[12px] sm:rounded-[16px] overflow-hidden shadow-[0_4px_14px_-4px_oklch(0.2_0.02_240/0.18)] transition-transform duration-200 group-hover:-translate-y-1"
                style={{ width: 40, height: 40 }}
              >
                <ToolCmsIcon tool={tool} ti={ti} />
              </div>
              <span className="text-[8px] sm:text-[9px] tracking-tight text-foreground/40">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom: description cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y divide-border">
        {tools.map((tool, ti) => (
          <div
            key={tool.name}
            className="flex items-start gap-3 sm:gap-4 px-4 sm:px-7 py-4 sm:py-6 border-b border-border"
          >
            {/* Icon */}
            <div
              className="rounded-[10px] sm:rounded-[12px] overflow-hidden shrink-0 shadow-[0_3px_10px_-3px_oklch(0.2_0.02_240/0.18)]"
              style={{ width: 36, height: 36 }}
            >
              <ToolCmsIcon tool={tool} ti={ti} />
            </div>

            {/* Text */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <EditableText page="home" path={["tools", ti, "name"]} value={tool.name} as="p" className="text-[12px] sm:text-[13px] font-semibold tracking-tight text-foreground" />
                <EditableText page="home" path={["tools", ti, "category"]} value={tool.category} as="span" className="rounded-full bg-secondary px-2 py-0.5 text-[8px] sm:text-[9px] tracking-tight text-foreground/40" />
              </div>
              <EditableText
                page="home"
                path={["tools", ti, "how"]}
                value={tool.how}
                as="p"
                className="mt-1 sm:mt-1.5 text-[11px] sm:text-[12px] leading-relaxed tracking-tight text-foreground/55"
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

/* ───────── ABOUT ───────── */

function About() {
  const { data: home } = useHome();
  const about = home.about;
  return (
    <section id="about" className="mt-16 sm:mt-20">
      <SectionHeader si={0} />

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* ── LEFT: editorial layout ── */}
        <div className="flex flex-col rounded-[16px] border border-border bg-card overflow-hidden">

          {/* Punchy statement */}
          <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-6 border-b border-border">
            <EditableText page="home" path={["about", "kickerWho"]} value={about.kickerWho} as="p" className="text-[10px] uppercase tracking-[0.26em] text-foreground/35 mb-3" />
            <p
              className="font-bold tracking-tightest text-foreground leading-[0.92]"
              style={{ fontSize: "clamp(22px, 3vw, 40px)" }}
            >
              {about.statement.map((line, i) => (
                <EditableText
                  key={i}
                  page="home"
                  path={["about", "statement", i]}
                  value={line}
                  as="span"
                  className="block"
                  style={i === 0 ? undefined : { color: "oklch(0.18 0.01 240 / 0.28)" }}
                />
              ))}
            </p>
            <EditableText
              page="home"
              path={["about", "paragraph"]}
              value={about.paragraph}
              as="p"
              className="mt-4 text-[13px] leading-relaxed tracking-tight text-foreground/55 max-w-sm"
            />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
            {about.stats.map((s, i) => (
              <div key={i} className="px-5 py-4">
                <EditableText page="home" path={["about", "stats", i, "value"]} value={s.value} as="p" className="text-[26px] font-bold tracking-tightest leading-none text-foreground" />
                <EditableText page="home" path={["about", "stats", i, "label"]} value={s.label} as="p" className="mt-1 text-[10px] uppercase tracking-[0.14em] text-foreground/40" />
              </div>
            ))}
          </div>

          {/* Clients */}
          <div className="px-5 sm:px-8 py-5 border-b border-border">
            <EditableText page="home" path={["about", "kickerClients"]} value={about.kickerClients} as="p" className="text-[10px] uppercase tracking-[0.26em] text-foreground/35 mb-4" />
            <div className="grid grid-cols-2 gap-2">
              {about.clients.map((c, i) => (
                <div key={i} className="rounded-[8px] border border-border bg-secondary/40 px-3 py-2.5">
                  <EditableText page="home" path={["about", "clients", i, "name"]} value={c.name} as="p" className="text-[12px] font-medium tracking-tight text-foreground/80" />
                  <EditableText page="home" path={["about", "clients", i, "sub"]} value={c.sub} as="p" className="text-[10px] tracking-tight text-foreground/40 mt-0.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="px-5 sm:px-8 py-5 flex-1">
            <EditableText page="home" path={["about", "kickerSkills"]} value={about.kickerSkills} as="p" className="text-[10px] uppercase tracking-[0.26em] text-foreground/35 mb-4" />
            <div className="space-y-3">
              {about.skills.map((g, gi) => (
                <div key={gi} className="flex items-start gap-4">
                  <EditableText page="home" path={["about", "skills", gi, "cat"]} value={g.cat} as="span" className="w-20 shrink-0 text-[10px] uppercase tracking-[0.12em] text-foreground/35 pt-0.5" />
                  <div className="flex flex-wrap gap-1.5">
                    {g.items.map((item, ii) => (
                      <EditableText key={ii} page="home" path={["about", "skills", gi, "items", ii]} value={item} as="span" className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] tracking-tight text-foreground/65" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── RIGHT: photo ── */}
        <div className="min-h-[400px] lg:min-h-0 lg:h-full">
          <AboutScene />
        </div>

      </div>
    </section>
  );
}

/* ───────── TOOLKIT ───────── */
function Toolkit() {
  return (
    <section id="toolkit" className="mt-20">
      <ToolsShowcase />
    </section>
  );
}

/* ───────── WORK ───────── */
function Work() {
  const { items: workItems } = useWork();
  const { data: home } = useHome();
  const site = home.site;
  const aside = home.workAside;
  return (
    <section id="work" className="mt-20">
      <SectionHeader si={1} />

      {/* Top bar */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between px-1 mb-6 gap-2">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--traffic-green)" }} />
          <EditableText page="home" path={["workAside", "availability"]} value={aside.availability} as="span" className="text-[11px] tracking-tight text-foreground/50" />
        </div>
        <EditableText page="home" path={["workAside", "stamp"]} value={aside.stamp} as="span" className="text-[11px] tracking-[0.18em] uppercase text-foreground/30" />
      </div>

      {/* 3-column layout — stacks on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] gap-6 lg:gap-8 items-start">

        {/* ── Left sidebar — hidden on mobile, shown on lg ── */}
        <div className="hidden lg:flex flex-col gap-6">

          <div className="rounded-[14px] border border-border bg-card p-5">
            <EditableText page="home" path={["workAside", "currentlyTitle"]} value={aside.currentlyTitle} as="p" className="text-[9px] uppercase tracking-[0.22em] text-foreground/35 mb-3" />
            <div className="space-y-3">
              {aside.currently.map((label, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ background: ["var(--traffic-green)", "var(--traffic-yellow)", "oklch(0.74 0.13 240)"][i % 3] }}
                  />
                  <EditableText page="home" path={["workAside", "currently", i]} value={label} as="span" className="text-[12px] tracking-tight text-foreground/65" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[14px] border border-border bg-card p-5">
            <EditableText page="home" path={["workAside", "numbersTitle"]} value={aside.numbersTitle} as="p" className="text-[9px] uppercase tracking-[0.22em] text-foreground/35 mb-4" />
            <div className="space-y-4">
              {aside.numbers.map((s, i) => (
                <div key={i}>
                  <EditableText page="home" path={["workAside", "numbers", i, "value"]} value={s.value} as="p" className="text-[24px] font-bold tracking-tightest leading-none text-foreground" />
                  <EditableText page="home" path={["workAside", "numbers", i, "label"]} value={s.label} as="p" className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-foreground/35" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[14px] border border-border bg-card p-5">
            <EditableText page="home" path={["workAside", "servicesTitle"]} value={aside.servicesTitle} as="p" className="text-[9px] uppercase tracking-[0.22em] text-foreground/35 mb-3" />
            <div className="flex flex-col gap-1.5">
              {aside.services.map((s, i) => (
                <EditableText key={i} page="home" path={["workAside", "services", i]} value={s} as="span" className="rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[10px] tracking-tight text-foreground/55 w-fit" />
              ))}
            </div>
          </div>

          {/* Sticky note */}
          <div
            className="rounded-[4px] p-5 -rotate-1 transition-transform duration-300 hover:rotate-0"
            style={{
              background: "oklch(0.93 0.09 100)",
              boxShadow: "0 8px 20px -8px oklch(0.2 0.02 240 / 0.25)",
            }}
          >
            <EditableText page="home" path={["site", "weeklyTitle"]} value={site.weeklyTitle} as="p" className="text-[9px] uppercase tracking-[0.22em] mb-2.5" style={{ color: "oklch(0.52 0.09 100)" }} />
            <div className="space-y-1.5 text-[12px] leading-relaxed tracking-tight" style={{ color: "oklch(0.34 0.06 100)" }}>
              {site.weeklyItems.map((it, i) => (
                <p key={i}>{it.done ? "☑" : "☐"} <EditableText page="home" path={["site", "weeklyItems", i, "text"]} value={it.text} /></p>
              ))}
              <EditableText page="home" path={["site", "weeklyNote"]} value={site.weeklyNote} as="p" className="pt-1.5 font-semibold" />
            </div>
          </div>
        </div>

        {/* ── Center: folder ── */}
        <div className="flex flex-col items-center overflow-hidden md:overflow-visible">
          <EditableText page="home" path={["workAside", "folderHint"]} value={aside.folderHint} as="p" className="text-[10px] uppercase tracking-[0.22em] text-foreground/30 mb-4 hidden sm:block" />
          <div className="w-full overflow-hidden md:overflow-visible">
            <WorkFolderScene items={workItems} />
          </div>
        </div>

        {/* ── Right sidebar — hidden on mobile, shown on lg ── */}
        <div className="hidden lg:flex flex-col gap-6">

          <div className="rounded-[14px] border border-border bg-card p-5">
            <EditableText page="home" path={["workAside", "clientsTitle"]} value={aside.clientsTitle} as="p" className="text-[9px] uppercase tracking-[0.22em] text-foreground/35 mb-4" />
            <div className="space-y-3">
              {aside.clients.map(({ name, tag }, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="h-7 w-7 rounded-[6px] shrink-0 border border-border bg-secondary flex items-center justify-center">
                    <span className="text-[9px] font-bold text-foreground/40">{name[0]}</span>
                  </div>
                  <div>
                    <EditableText page="home" path={["workAside", "clients", i, "name"]} value={name} as="p" className="text-[11px] font-medium tracking-tight text-foreground/75 leading-tight" />
                    <EditableText page="home" path={["workAside", "clients", i, "tag"]} value={tag} as="p" className="text-[9px] tracking-tight text-foreground/35" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[14px] border border-border bg-card p-5">
            <EditableText page="home" path={["workAside", "recentTitle"]} value={aside.recentTitle} as="p" className="text-[9px] uppercase tracking-[0.22em] text-foreground/35 mb-4" />
            <div className="space-y-3">
              {aside.recent.map(({ label, time }, i) => (
                <div key={i} className="flex items-start justify-between gap-2">
                  <EditableText page="home" path={["workAside", "recent", i, "label"]} value={label} as="p" className="text-[11px] tracking-tight text-foreground/60 leading-snug" />
                  <EditableText page="home" path={["workAside", "recent", i, "time"]} value={time} as="span" className="text-[9px] tracking-tight text-foreground/30 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[14px] border border-border bg-card p-5">
            <EditableText page="home" path={["workAside", "ctaText"]} value={aside.ctaText} as="p" className="text-[11px] tracking-tight text-foreground/45 leading-relaxed mb-4" />
            <a
              href="#contact"
              className="rounded-full bg-foreground px-4 py-2 text-[11px] tracking-tight text-background text-center block transition hover:opacity-85"
            >
              <EditableText page="home" path={["workAside", "ctaButton"]} value={aside.ctaButton} />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ───────── SERVICES ───────── */
function Services() {
  const { data: home } = useHome();
  const services = home.services;

  return (
    <section id="services" className="mt-20">
      <SectionHeader si={2} />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s, si) => (
          <div
            key={s.k}
            className="rounded-[14px] border border-border bg-card overflow-hidden mac-shadow flex flex-col"
          >
            {/* Title bar */}
            <div className="flex h-9 items-center justify-between border-b border-border bg-secondary/60 px-3 shrink-0">
              <div className="flex items-center gap-1.5">
                <TrafficLights size={11} />
              </div>
              <EditableText page="home" path={["services", si, "file"]} value={s.file} as="span" className="text-[11px] tracking-tight text-foreground/50" />
              <EditableText page="home" path={["services", si, "k"]} value={s.k} as="span" className="text-[10px] tracking-[0.14em] uppercase text-foreground/25" />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5 gap-4">
              <div>
                <EditableText page="home" path={["services", si, "title"]} value={s.title} as="h3" className="text-[16px] font-bold tracking-tightest text-foreground leading-tight" />
                <EditableText page="home" path={["services", si, "tagline"]} value={s.tagline} as="p" className="mt-0.5 text-[11px] tracking-tight text-foreground/40 italic" />
              </div>

              <EditableText page="home" path={["services", si, "description"]} value={s.description} as="p" className="text-[12px] leading-relaxed tracking-tight text-foreground/55" />

              {/* Includes */}
              <div>
                <EditableText page="home" path={["site", "servicesIncludesLabel"]} value={home.site.servicesIncludesLabel} as="p" className="text-[9px] uppercase tracking-[0.18em] text-foreground/30 mb-2" />
                <ul className="space-y-1.5">
                  {s.includes.map((item, ii) => (
                    <li key={ii} className="flex items-start gap-2 text-[11px] tracking-tight text-foreground/60">
                      <span className="mt-0.5 h-3.5 w-3.5 rounded-full shrink-0 flex items-center justify-center text-[7px] font-bold text-white" style={{ background: "oklch(0.62 0.18 255)" }}>✓</span>
                      <EditableText page="home" path={["services", si, "includes", ii]} value={item} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer */}
              <div className="mt-auto pt-3 border-t border-border space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {s.tools.map((t, ti) => (
                    <EditableText key={ti} page="home" path={["services", si, "tools", ti]} value={t} as="span" className="rounded-full bg-secondary border border-border px-2 py-0.5 text-[9.5px] tracking-tight text-foreground/45" />
                  ))}
                </div>
                <p className="text-[10px] tracking-tight text-foreground/35 leading-snug">
                  <EditableText page="home" path={["site", "servicesBestForLabel"]} value={home.site.servicesBestForLabel} as="span" className="font-medium text-foreground/50" />{" "}
                  <EditableText page="home" path={["services", si, "bestFor"]} value={s.bestFor} />
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-5 rounded-[14px] border border-border bg-card px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <EditableText page="home" path={["site", "servicesCtaTitle"]} value={home.site.servicesCtaTitle} as="p" className="text-[15px] font-semibold tracking-tight text-foreground" />
          <EditableText page="home" path={["site", "servicesCtaBody"]} value={home.site.servicesCtaBody} as="p" className="mt-0.5 text-[12px] tracking-tight text-foreground/50" />
        </div>
        <a href="#contact" className="rounded-full bg-foreground px-6 py-2.5 text-[12px] tracking-tight text-background transition hover:opacity-85 shrink-0">
          <EditableText page="home" path={["site", "servicesCtaButton"]} value={home.site.servicesCtaButton} />
        </a>
      </div>
    </section>
  );
}

/* ───────── CONTACT ───────── */
/* ───────── PROCESS ───────── */
function Process() {
  const { data: home } = useHome();
  const steps = home.process;

  return (
    <section id="process" className="mt-20">
      <SectionHeader si={3} />
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {steps.map((s, i) => (
          <div key={s.n} className="rounded-[14px] border border-border bg-card overflow-hidden mac-shadow flex flex-col">
            <div className="flex h-8 items-center justify-between border-b border-border bg-secondary/60 px-3">
              <div className="flex items-center gap-1">
                <TrafficLights size={9} />
              </div>
              <EditableText page="home" path={["process", i, "file"]} value={s.file} as="span" className="text-[9px] tracking-tight text-foreground/40" />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                  style={{ background: "oklch(0.62 0.18 255)" }}
                >
                  {s.n}
                </span>
                <EditableText page="home" path={["process", i, "title"]} value={s.title} as="h3" className="text-[14px] font-bold tracking-tightest text-foreground" />
              </div>
              <EditableText page="home" path={["process", i, "desc"]} value={s.desc} as="p" className="text-[11.5px] leading-relaxed tracking-tight text-foreground/55 mb-3" />
              <ul className="mt-auto space-y-1">
                {s.details.map((d, di) => (
                  <li key={di} className="flex items-center gap-1.5 text-[10.5px] tracking-tight text-foreground/45">
                    <span className="text-foreground/20">›</span>
                    <EditableText page="home" path={["process", i, "details", di]} value={d} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────── TESTIMONIALS ───────── */
function Testimonials() {
  const { data: home } = useHome();
  const testimonials = home.testimonials;

  return (
    <section id="testimonials" className="mt-20">
      <SectionHeader si={4} />
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t, i) => (
          <TestimonialCard key={i} t={t} index={i} />
        ))}
      </div>
    </section>
  );
}

/* iMessage bubble that "arrives": typing dots → message → Delivered */
function TestimonialCard({
  t,
  index,
}: {
  t: { quote: string; name: string; brand: string; platform: string; initials: string; color: string };
  index: number;
}) {
  const { data: home } = useHome();
  const { editing } = useEdit();
  const ref = useRef<HTMLDivElement>(null);
  const [rawStage, setStage] = useState<"idle" | "typing" | "shown">("idle");
  // Edit mode skips the typing animation so the quote is clickable right away.
  const stage = editing ? "shown" : rawStage;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage("shown");
      return;
    }
    const el = ref.current;
    if (!el) return;
    let t1 = 0, t2 = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        t1 = window.setTimeout(() => setStage("typing"), index * 400);
        t2 = window.setTimeout(() => setStage("shown"), index * 400 + 1100);
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [index]);

  return (
    <div ref={ref} className="rounded-[14px] border border-border bg-card p-6 flex flex-col gap-4 mac-shadow">
      {/* iMessage-style bubble */}
      <div
        className="rounded-[14px] rounded-tl-[4px] px-4 py-3"
        style={{ background: "oklch(0.62 0.18 255 / 0.1)", border: "1px solid oklch(0.62 0.18 255 / 0.2)" }}
      >
        {stage === "shown" ? (
          <p
            className="text-[13px] leading-relaxed tracking-tight text-foreground/70 italic"
            style={{ animation: "fade-up-in 0.35s cubic-bezier(.2,.8,.2,1) both" }}
          >
            "<EditableText page="home" path={["testimonials", index, "quote"]} value={t.quote} />"
          </p>
        ) : (
          <div className="flex items-center gap-1.5 py-1.5" aria-label="typing">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        )}
      </div>
      {stage === "shown" && (
        <p
          className="text-right text-[10px] tracking-tight text-foreground/30 -mt-2"
          style={{ animation: "fade-up-in 0.3s ease 0.15s both" }}
        >
          <EditableText page="home" path={["site", "deliveredLabel"]} value={home.site.deliveredLabel} />
        </p>
      )}
      {/* Sender */}
      <div className="flex items-center gap-3 mt-auto">
        <div
          className="h-9 w-9 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold text-white"
          style={{ background: t.color }}
        >
          <EditableText page="home" path={["testimonials", index, "initials"]} value={t.initials} />
        </div>
        <div>
          <EditableText page="home" path={["testimonials", index, "name"]} value={t.name} as="p" className="text-[12px] font-semibold tracking-tight text-foreground/80" />
          <p className="text-[10px] tracking-tight text-foreground/40">
            <EditableText page="home" path={["testimonials", index, "brand"]} value={t.brand} /> ·{" "}
            <EditableText page="home" path={["testimonials", index, "platform"]} value={t.platform} />
          </p>
        </div>
      </div>
    </div>
  );
}

/* ───────── SOCIAL FEED ───────── */
function SocialFeed() {
  const { data: home } = useHome();
  const posts = home.posts;

  return (
    <section id="latest" className="mt-20">
      <SectionHeader si={5} />
      <div className="mt-6 rounded-[16px] border border-border bg-card overflow-hidden mac-shadow">
        {/* Title bar */}
        <div className="flex h-9 items-center justify-between border-b border-border bg-secondary/60 px-4">
          <div className="flex items-center gap-1.5">
            <TrafficLights size={11} />
          </div>
          <EditableText page="home" path={["site", "latestWindowTitle"]} value={home.site.latestWindowTitle} as="span" className="text-[11px] tracking-tight text-foreground/50" />
          <span className="text-[10px] tracking-tight text-foreground/30">{posts.length} items</span>
        </div>
        {/* Grid */}
        <div className="grid grid-cols-3 gap-px bg-border">
          {posts.map((post, i) => (
            <div
              key={post.id}
              className="aspect-square bg-secondary/40 relative group overflow-hidden"
            >
              <EditableImage
                page="home"
                path={["posts", i, "image"]}
                src={post.image}
                alt={post.alt}
                wrapperClassName="absolute inset-0"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
        <div className="px-6 py-4 flex items-center justify-between border-t border-border">
          <EditableText page="home" path={["site", "latestFooterNote"]} value={home.site.latestFooterNote} as="p" className="text-[11px] tracking-tight text-foreground/40" />
          <a
            href="https://instagram.com/shanzster.zip"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] tracking-tight text-foreground/50 hover:text-foreground transition"
          >
            <EditableText page="home" path={["site", "latestFooterLink"]} value={home.site.latestFooterLink} />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────── FAQ ───────── */
function FAQ() {
  const { data: home } = useHome();
  const faqs = home.faqs;

  return (
    <section id="faq" className="mt-20">
      <SectionHeader si={6} />
      <div className="mt-6 rounded-[16px] border border-border bg-card overflow-hidden mac-shadow">
        <div className="flex h-9 items-center justify-between border-b border-border bg-secondary/60 px-4">
          <div className="flex items-center gap-1.5">
            <TrafficLights size={11} />
          </div>
          <EditableText page="home" path={["site", "faqWindowTitle"]} value={home.site.faqWindowTitle} as="span" className="text-[11px] tracking-tight text-foreground/50" />
          <div className="w-10" />
        </div>
        <div className="divide-y divide-border">
          {faqs.map((f, i) => (
            <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4 px-4 sm:px-7 py-4 sm:py-5">
              <EditableText page="home" path={["faqs", i, "q"]} value={f.q} as="p" className="text-[12px] sm:text-[13px] font-semibold tracking-tight text-foreground" />
              <EditableText page="home" path={["faqs", i, "a"]} value={f.a} as="p" className="text-[12px] sm:text-[13px] leading-relaxed tracking-tight text-foreground/60" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── CONTACT ───────── */
function Contact() {
  const { data: home } = useHome();
  const site = home.site;
  return (
    <section id="contact" className="mt-20">
      <SectionHeader si={7} />
      <div className="mt-6 grid gap-4 sm:gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <MacWindow label="Mail —" title="New message">
            <div className="p-5 sm:p-8 lg:p-10">
              <h2 className="text-[clamp(26px,4.5vw,60px)] leading-[0.95] tracking-tightest font-bold">
                <EditableText page="home" path={["site", "contactHeadlineTop"]} value={site.contactHeadlineTop} /><br />
                <span className="selected-text">
                  <EditableText page="home" path={["site", "contactHeadlineAccent"]} value={site.contactHeadlineAccent} />
                </span>
              </h2>
              <EditableText
                page="home"
                path={["site", "contactBlurb"]}
                value={site.contactBlurb}
                as="p"
                className="mt-4 text-[12px] sm:text-[13px] leading-relaxed tracking-tight text-foreground/55 max-w-md"
              />
              <div className="mt-6 sm:mt-8 space-y-4 text-[12px] sm:text-[13px] tracking-tight">
                <Field labelPath={["site", "contactToLabel"]} label={site.contactToLabel} valuePath={["site", "contactEmail"]} value={site.contactEmail} />
                <Field labelPath={["site", "contactFromLabel"]} label={site.contactFromLabel} valuePath={["site", "contactFromValue"]} value={site.contactFromValue} />
                <Field labelPath={["site", "contactSubjectLabel"]} label={site.contactSubjectLabel} valuePath={["site", "contactSubjectValue"]} value={site.contactSubjectValue} />
              </div>
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${site.contactEmail}`}
                  className="inline-flex rounded-full bg-foreground px-4 sm:px-5 py-2 sm:py-2.5 text-[12px] sm:text-[13px] tracking-tight text-background transition hover:opacity-90"
                >
                  <EditableText page="home" path={["site", "contactSendButton"]} value={site.contactSendButton} />
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(site.contactEmail).then(
                      () => toast("Email copied to clipboard", { description: site.contactEmail }),
                      () => toast(`Couldn't copy — email is ${site.contactEmail}`)
                    );
                  }}
                  className="inline-flex rounded-full border border-border bg-card px-4 sm:px-5 py-2 sm:py-2.5 text-[12px] sm:text-[13px] tracking-tight text-foreground/70 transition hover:bg-secondary hover:text-foreground"
                >
                  <EditableText page="home" path={["site", "contactCopyButton"]} value={site.contactCopyButton} />
                </button>
              </div>
            </div>
          </MacWindow>
        </div>
        <div className="lg:col-span-4 grid gap-4 content-start">
          <MacWindow title="availability.md">
            <div className="p-5 text-[13px] tracking-tight">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full" style={{ background: "var(--traffic-green)" }} />
                <EditableText page="home" path={["site", "availabilityTitle"]} value={site.availabilityTitle} className="font-medium text-foreground/80" />
              </div>
              <EditableText page="home" path={["site", "availabilityBody"]} value={site.availabilityBody} as="p" className="text-foreground/50 text-[12px]" />
            </div>
          </MacWindow>
          <MacWindow title="socials.url">
            <ul className="p-5 text-[13px] tracking-tight space-y-2.5">
              {site.socials.map(({ label, href, handle }, i) => (
                <li key={i} className="flex items-center justify-between">
                  <EditableText page="home" path={["site", "socials", i, "label"]} value={label} as="span" className="text-foreground/60" />
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-foreground/40 hover:text-foreground transition text-[11px]">
                    <EditableText page="home" path={["site", "socials", i, "handle"]} value={handle ?? ""} /> ↗
                  </a>
                </li>
              ))}
            </ul>
          </MacWindow>
          <MacWindow title="location.txt">
            <div className="p-5 text-[13px] tracking-tight">
              <EditableText page="home" path={["site", "basedInLabel"]} value={site.basedInLabel} as="p" className="text-foreground/40 text-[10px] uppercase tracking-[0.18em] mb-1" />
              <EditableText page="home" path={["site", "locationCity"]} value={site.locationCity} as="p" className="text-foreground/70" />
              <EditableText page="home" path={["site", "locationNote"]} value={site.locationNote} as="p" className="text-foreground/40 text-[11px] mt-1" />
            </div>
          </MacWindow>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  labelPath,
  valuePath,
}: {
  label: string;
  value: string;
  labelPath: (string | number)[];
  valuePath: (string | number)[];
}) {
  return (
    <div className="flex gap-4 border-b border-border pb-3">
      <EditableText page="home" path={labelPath} value={label} as="span" className="w-16 text-foreground/40" />
      <EditableText page="home" path={valuePath} value={value} as="span" className="text-foreground" />
    </div>
  );
}

function SectionHeader({ si }: { si: number }) {
  const { data: home } = useHome();
  const s = home.site.sections[si] ?? { index: "", title: "" };
  return (
    <div className="flex items-end justify-between">
      <div className="flex items-baseline gap-4">
        <EditableText page="home" path={["site", "sections", si, "index"]} value={s.index} as="span" className="text-[12px] tracking-[0.2em] uppercase text-foreground/40" />
        <EditableText page="home" path={["site", "sections", si, "title"]} value={s.title} as="h2" className="text-[clamp(28px,3.4vw,44px)] tracking-tightest font-semibold" />
      </div>
      {s.subtitle !== undefined && (
        <EditableText page="home" path={["site", "sections", si, "subtitle"]} value={s.subtitle} as="span" className="text-[12px] tracking-tight text-foreground/50" />
      )}
    </div>
  );
}

function Footer() {
  const { data: home } = useHome();
  const site = home.site;
  return (
    <footer className="mt-20 border-t border-border pt-8 pb-4 text-[12px] tracking-tight text-foreground/50">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-8">
        <div>
          <EditableText page="home" path={["site", "footerBrand"]} value={site.footerBrand} as="p" className="font-semibold text-foreground/80 mb-1" />
          <EditableText page="home" path={["site", "footerBlurb"]} value={site.footerBlurb} as="p" className="text-foreground/45 leading-relaxed max-w-[240px]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <EditableText page="home" path={["site", "exploreTitle"]} value={site.exploreTitle} as="p" className="text-[10px] uppercase tracking-[0.2em] text-foreground/30 mb-1" />
          {site.footerExplore.map(({ label, href }, i) => (
            <a key={i} href={href} className="w-fit text-foreground/50 hover:text-foreground transition">
              <EditableText page="home" path={["site", "footerExplore", i, "label"]} value={label} />
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          <EditableText page="home" path={["site", "connectTitle"]} value={site.connectTitle} as="p" className="text-[10px] uppercase tracking-[0.2em] text-foreground/30 mb-1" />
          {site.footerConnect.map(({ label, href }, i) => (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-fit text-foreground/50 hover:text-foreground transition">
              <EditableText page="home" path={["site", "footerConnect", i, "label"]} value={label} />
            </a>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-4">
        <EditableText page="home" path={["site", "footerCopyright"]} value={site.footerCopyright} />
        <span className="flex items-center gap-4">
          <EditableText page="home" path={["site", "searchHint"]} value={site.searchHint} as="span" className="hidden sm:inline text-foreground/35" />
          <EditableText page="home" path={["site", "footerTagline"]} value={site.footerTagline} />
        </span>
      </div>
    </footer>
  );
}
