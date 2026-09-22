import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import profileImage from "@/image_reference/profile.png";
import { TrafficLights } from "@/components/TrafficLights";
import { Reveal } from "@/hooks/useScrollReveal";
import { useAbout, useHome } from "@/lib/content";
import { type JourneyStep, type VideoIntro } from "@/lib/about-data";
import { EditableText, EditableImage } from "@/lib/edit-mode";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Shanzster" },
      { name: "description", content: "The story behind Shanzster — full-stack marketing for fashion e-commerce brands, built from cold DMs and consistency. Subic Bay, Philippines." },
    ],
  }),
});

/* ─────────────────────────────────────────────
   PHILIPPINE CLOCK
───────────────────────────────────────────── */

function PHClock() {
  const { data: about } = useAbout();
  const pg = about.page;
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => {
      setTime(new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  const h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;

  // Clock hand angles
  const secDeg  = s * 6;
  const minDeg  = m * 6 + s * 0.1;
  const hourDeg = (h12 % 12) * 30 + m * 0.5;

  const pad = (n: number) => String(n).padStart(2, "0");

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayName = dayNames[time.getDay()];
  const dateStr = `${dayName}, ${monthNames[time.getMonth()]} ${time.getDate()}`;

  return (
    <div className="rounded-[16px] border border-border bg-card overflow-hidden">
      {/* Mac title bar */}
      <div className="flex h-9 items-center gap-1.5 border-b border-border bg-secondary/60 px-4">
        <TrafficLights size={11} />
        <EditableText page="about" path={["page", "clockTitle"]} value={pg.clockTitle} as="span" className="ml-auto text-[11px] tracking-tight text-foreground/40" />
      </div>

      <div className="p-6 flex items-center gap-8">
        {/* Analog clock */}
        <div className="shrink-0 relative" style={{ width: 100, height: 100 }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            {/* Face */}
            <circle cx="50" cy="50" r="46" fill="var(--card)" stroke="var(--border)" strokeWidth="1.5" />
            {/* Hour ticks */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180);
              const x1 = 50 + 38 * Math.cos(angle);
              const y1 = 50 + 38 * Math.sin(angle);
              const x2 = 50 + 43 * Math.cos(angle);
              const y2 = 50 + 43 * Math.sin(angle);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="oklch(0.18 0.01 240 / 0.2)" strokeWidth="1.5" strokeLinecap="round" />;
            })}
            {/* Hour hand */}
            <line
              x1="50" y1="50"
              x2={50 + 24 * Math.cos((hourDeg - 90) * Math.PI / 180)}
              y2={50 + 24 * Math.sin((hourDeg - 90) * Math.PI / 180)}
              stroke="oklch(0.18 0.01 240)" strokeWidth="3" strokeLinecap="round"
            />
            {/* Minute hand */}
            <line
              x1="50" y1="50"
              x2={50 + 32 * Math.cos((minDeg - 90) * Math.PI / 180)}
              y2={50 + 32 * Math.sin((minDeg - 90) * Math.PI / 180)}
              stroke="oklch(0.18 0.01 240)" strokeWidth="2" strokeLinecap="round"
            />
            {/* Second hand */}
            <line
              x1="50" y1="50"
              x2={50 + 34 * Math.cos((secDeg - 90) * Math.PI / 180)}
              y2={50 + 34 * Math.sin((secDeg - 90) * Math.PI / 180)}
              stroke="oklch(0.62 0.20 27)" strokeWidth="1.2" strokeLinecap="round"
            />
            {/* Center dot */}
            <circle cx="50" cy="50" r="3" fill="oklch(0.18 0.01 240)" />
            <circle cx="50" cy="50" r="1.5" fill="oklch(0.62 0.20 27)" />
          </svg>
        </div>

        {/* Digital readout */}
        <div>
          <p
            className="font-bold tracking-tightest leading-none text-foreground"
            style={{ fontSize: "clamp(32px, 4vw, 48px)", fontVariantNumeric: "tabular-nums" }}
          >
            {pad(h12)}:{pad(m)}:{pad(s)}
            <span className="text-foreground/30 ml-2" style={{ fontSize: "0.45em" }}>{ampm}</span>
          </p>
          <p className="mt-2 text-[12px] tracking-tight text-foreground/40">{dateStr}</p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--traffic-green)" }} />
            <EditableText page="about" path={["page", "clockStatus"]} value={pg.clockStatus} as="p" className="text-[11px] tracking-tight text-foreground/40" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */




/* ─────────────────────────────────────────────
   STORY — macOS Terminal window
───────────────────────────────────────────── */


function StoryTerminal({ story }: { story: string[] }) {
  const { data: about } = useAbout();
  const pg = about.page;
  return (
    <div
      className="rounded-[16px] overflow-hidden mac-shadow border"
      style={{ background: "oklch(0.17 0.015 250)", borderColor: "oklch(0.30 0.015 250)" }}
    >
      {/* Title bar */}
      <div
        className="flex h-9 items-center justify-between px-4 border-b"
        style={{ background: "oklch(0.23 0.015 250)", borderColor: "oklch(0.30 0.015 250)" }}
      >
        <TrafficLights size={11} />
        <EditableText page="about" path={["page", "terminalTitle"]} value={pg.terminalTitle} as="span" className="text-[11px] tracking-tight text-white/40" />
        <div className="w-10" />
      </div>

      {/* Body */}
      <div className="px-6 sm:px-8 py-6 sm:py-7" style={{ fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace" }}>
        <p className="text-[12px] tracking-tight">
          <EditableText page="about" path={["page", "terminalPrompt"]} value={pg.terminalPrompt} as="span" style={{ color: "oklch(0.75 0.15 145)" }} />
          <span className="text-white/40"> ~ % </span>
          <EditableText page="about" path={["page", "terminalCommand"]} value={pg.terminalCommand} as="span" className="text-white/85" />
        </p>
        <div className="mt-4 space-y-4 max-w-2xl">
          {story.map((p, i) => (
            <EditableText key={i} page="about" path={["story", i]} value={p} as="p" className="text-[13px] leading-relaxed tracking-tight text-white/70" />
          ))}
        </div>
        <p className="mt-5 text-[12px] tracking-tight">
          <EditableText page="about" path={["page", "terminalPrompt"]} value={pg.terminalPrompt} as="span" style={{ color: "oklch(0.75 0.15 145)" }} />
          <span className="text-white/40"> ~ % </span>
          <span className="blink text-white/70">▊</span>
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   JOURNEY — timeline
───────────────────────────────────────────── */


function Journey({ journey }: { journey: JourneyStep[] }) {
  const { data: about } = useAbout();
  const pg = about.page;
  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className="absolute left-[7px] top-2 bottom-2 w-px"
        style={{ background: "var(--border)" }}
      />
      <div className="space-y-6">
        {journey.map((step, i) => (
          <div key={step.year} className="relative pl-9">
            {/* Node */}
            <span
              className="absolute left-0 top-1 h-[15px] w-[15px] rounded-full border-2"
              style={{ background: step.color, borderColor: "var(--background)", boxShadow: `0 0 0 3px ${step.color.replace(")", " / 0.18)")}` }}
            />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <EditableText page="about" path={["journey", i, "year"]} value={step.year} as="span" className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: step.color }} />
              <EditableText page="about" path={["journey", i, "title"]} value={step.title} as="p" className="text-[15px] font-bold tracking-tightest text-foreground" />
            </div>
            <p className="mt-1 text-[13px] leading-relaxed tracking-tight text-foreground/55 max-w-xl">
              <EditableText page="about" path={["journey", i, "detail"]} value={step.detail} />
              {step.cta && (
                <>
                  {" "}
                  <Link to="/" hash="contact" className="font-semibold text-foreground underline underline-offset-2 hover:opacity-70 transition">
                    <EditableText page="about" path={["page", "journeyCta"]} value={pg.journeyCta} />
                  </Link>
                </>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   BELIEFS — how I work
───────────────────────────────────────────── */


/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

/* Turn a YouTube/Vimeo link into an embeddable URL; null if it's a direct file. */
function embedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

function VideoIntroSection({ intro }: { intro: VideoIntro }) {
  const { data: about } = useAbout();
  const pg = about.page;
  const [open, setOpen] = useState(false);
  if (!intro?.enabled || !intro.url) return null;

  const embed = embedUrl(intro.url);

  return (
    <Reveal>
      <div className="mb-8">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-3 rounded-[14px] border border-border bg-card px-5 py-4 text-left transition hover:border-foreground/25"
        >
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white"
            style={{ background: "oklch(0.62 0.18 255)" }}
          >
            {open ? "▾" : "▶"}
          </span>
          <span className="min-w-0 flex-1">
            <EditableText page="about" path={["videoIntro", "buttonLabel"]} value={intro.buttonLabel || "Video introduction"} as="span" className="block text-[14px] font-semibold tracking-tight text-foreground" />
            {intro.caption && <EditableText page="about" path={["videoIntro", "caption"]} value={intro.caption} as="span" className="block text-[12px] tracking-tight text-foreground/45" />}
          </span>
          <span className="text-[11px] tracking-tight text-foreground/40">{open ? pg.videoHide : pg.videoWatch}</span>
        </button>

        {open && (
          <div className="mt-4 overflow-hidden rounded-[16px] border border-border bg-black">
            {intro.title && (
              <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2">
                <TrafficLights size={11} />
                <span className="ml-1 text-[11px] tracking-tight text-white/50">{intro.title}</span>
              </div>
            )}
            <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
              {embed ? (
                <iframe
                  src={embed}
                  title={intro.title || "Video introduction"}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={intro.url} controls className="absolute inset-0 h-full w-full bg-black" />
              )}
            </div>
          </div>
        )}
      </div>
    </Reveal>
  );
}

function AboutPage() {
  const { data: about } = useAbout();
  const { data: home } = useHome();
  const pg = about.page;
  return (
    <div className="min-h-screen bg-background pb-32">
      <NavBar />

      <main className="mx-auto max-w-[1100px] px-6 pt-10 sm:px-10">

        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-[12px] tracking-tight text-foreground/40 hover:text-foreground transition mb-10">
          <EditableText page="about" path={["page", "back"]} value={pg.back} />
        </Link>

        {/* ── HERO ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Left — identity */}
          <div className="rounded-[16px] border border-border bg-card overflow-hidden">
            {/* Profile photo placeholder */}
            <div
              className="relative w-full flex items-end"
              style={{
                height: 280,
                background: "linear-gradient(160deg, oklch(0.70 0.14 238), oklch(0.62 0.16 244))",
              }}
            >
              <EditableImage
                page="home"
                path={["profileImage"]}
                src={home.profileImage || profileImage}
                alt="Shanzster"
                wrapperClassName="absolute inset-0"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: "linear-gradient(to top, oklch(1 0 0 / 0.95), transparent)" }} />
              <div className="relative z-10 px-7 pb-6">
                <EditableText page="about" path={["page", "basedInLabel"]} value={pg.basedInLabel} as="p" className="text-[10px] uppercase tracking-[0.26em] text-foreground/35 mb-1" />
                <EditableText page="about" path={["page", "basedIn"]} value={pg.basedIn} as="p" className="text-[14px] font-semibold tracking-tight text-foreground" />
              </div>
            </div>

            <div className="px-7 py-6">
              <EditableText page="about" path={["page", "helloKicker"]} value={pg.helloKicker} as="p" className="text-[10px] uppercase tracking-[0.26em] text-foreground/35 mb-2" />
              <EditableText page="about" path={["page", "name"]} value={pg.name} as="h1" className="font-bold tracking-tightest text-foreground leading-[0.9] block" style={{ fontSize: "clamp(32px, 4vw, 52px)" }} />
              <EditableText page="about" path={["page", "role"]} value={pg.role} as="p" className="mt-1 text-[13px] tracking-tight text-foreground/50" />
              <EditableText page="about" path={["page", "paragraph"]} value={pg.paragraph} as="p" className="mt-4 text-[13px] leading-relaxed tracking-tight text-foreground/60 max-w-sm" />

              {/* Socials */}
              <div className="mt-4 flex flex-wrap gap-2">
                {pg.socialChips.map(({ label, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-[11px] tracking-tight text-foreground/55 hover:text-foreground hover:bg-secondary transition"
                  >
                    <EditableText page="about" path={["page", "socialChips", i, "label"]} value={label} /> ↗
                  </a>
                ))}
              </div>

              {/* Quick stats */}
              <div className="mt-5 grid grid-cols-3 divide-x divide-border border border-border rounded-[10px] overflow-hidden">
                {pg.quickStats.map(({ v, l }, i) => (
                  <div key={i} className="px-4 py-3 text-center">
                    <EditableText page="about" path={["page", "quickStats", i, "v"]} value={v} as="p" className="text-[22px] font-bold tracking-tightest leading-none text-foreground" />
                    <EditableText page="about" path={["page", "quickStats", i, "l"]} value={l} as="p" className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-foreground/35" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — clock + availability */}
          <div className="flex flex-col gap-4">
            <PHClock />

            {/* Availability card */}
            <div className="rounded-[16px] border border-border bg-card px-6 py-5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="pulse-dot h-2 w-2 rounded-full" style={{ background: "var(--traffic-green)" }} />
                  <EditableText page="about" path={["page", "availabilityTitle"]} value={pg.availabilityTitle} as="p" className="text-[12px] font-semibold tracking-tight text-foreground" />
                </div>
                <EditableText page="about" path={["page", "availabilitySub"]} value={pg.availabilitySub} as="p" className="text-[12px] tracking-tight text-foreground/45" />
              </div>
              <Link
                to="/"
                hash="contact"
                className="cta-primary rounded-full px-5 py-2 text-[12px] font-medium tracking-tight shrink-0"
              >
                <EditableText page="about" path={["page", "availabilityButton"]} value={pg.availabilityButton} />
              </Link>
            </div>

            {/* Platforms */}
            <div className="rounded-[16px] border border-border bg-card px-6 py-5">
              <EditableText page="about" path={["page", "platformsTitle"]} value={pg.platformsTitle} as="p" className="text-[10px] uppercase tracking-[0.22em] text-foreground/35 mb-4" />
              <div className="flex flex-wrap gap-2">
                {pg.platforms.map((p, i) => (
                  <EditableText key={i} page="about" path={["page", "platforms", i]} value={p} as="span" className="rounded-full bg-secondary border border-border px-3 py-1 text-[11px] tracking-tight text-foreground/60" />
                ))}
              </div>
            </div>

            {/* Currently */}
            <div className="rounded-[16px] border border-border bg-card px-6 py-5">
              <EditableText page="about" path={["page", "currentlyTitle"]} value={pg.currentlyTitle} as="p" className="text-[10px] uppercase tracking-[0.22em] text-foreground/35 mb-4" />
              <div className="space-y-2.5">
                {pg.currently.map((label, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: ["var(--traffic-green)", "var(--traffic-yellow)", "oklch(0.62 0.18 255)"][i % 3] }} />
                    <EditableText page="about" path={["page", "currently", i]} value={label} as="span" className="text-[12px] tracking-tight text-foreground/65" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── VIDEO INTRO ── */}
        <VideoIntroSection intro={about.videoIntro} />

        {/* ── STORY ── */}
        <Reveal>
          <div className="mb-8">
            <EditableText page="about" path={["page", "kickerStory"]} value={pg.kickerStory} as="p" className="text-[10px] uppercase tracking-[0.26em] text-foreground/35 mb-5" />
            <StoryTerminal story={about.story} />
          </div>
        </Reveal>

        {/* ── JOURNEY ── */}
        <Reveal delay={50}>
          <div className="mb-8 rounded-[16px] border border-border bg-card px-7 sm:px-9 py-7">
            <EditableText page="about" path={["page", "kickerJourney"]} value={pg.kickerJourney} as="p" className="text-[10px] uppercase tracking-[0.26em] text-foreground/35 mb-6" />
            <Journey journey={about.journey} />
          </div>
        </Reveal>

        {/* ── BELIEFS ── */}
        <Reveal delay={50}>
          <div className="mb-8">
            <EditableText page="about" path={["page", "kickerBeliefs"]} value={pg.kickerBeliefs} as="p" className="text-[10px] uppercase tracking-[0.26em] text-foreground/35 mb-5" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {about.beliefs.map((b, i) => (
                <div
                  key={b.title}
                  className="rounded-[16px] border border-border bg-card px-5 py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-10px_oklch(0.2_0.02_240/0.2)]"
                >
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-[10px] text-[16px] text-white mb-3"
                    style={{ background: "oklch(0.62 0.18 255)" }}
                  >
                    {b.icon}
                  </span>
                  <EditableText page="about" path={["beliefs", i, "title"]} value={b.title} as="p" className="text-[13px] font-bold tracking-tight text-foreground leading-snug" />
                  <EditableText page="about" path={["beliefs", i, "detail"]} value={b.detail} as="p" className="mt-1.5 text-[12px] leading-relaxed tracking-tight text-foreground/55" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>



        {/* ── CREDENTIALS ── */}
        <div className="mb-8">
          <EditableText page="about" path={["page", "kickerCredentials"]} value={pg.kickerCredentials} as="p" className="text-[10px] uppercase tracking-[0.26em] text-foreground/35 mb-5" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {about.credentials.map((section, si) => (
              <div key={section.type} className="rounded-[16px] border border-border bg-card overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-secondary/40 flex items-center gap-2">
                  <span className="text-foreground/40">{section.icon}</span>
                  <EditableText page="about" path={["credentials", si, "type"]} value={section.type} as="p" className="text-[11px] uppercase tracking-[0.2em] text-foreground/50 font-medium" />
                </div>
                <div className="divide-y divide-border">
                  {section.items.map((item, i) => (
                    <div key={i} className="px-6 py-4">
                      <EditableText page="about" path={["credentials", si, "items", i, "title"]} value={item.title} as="p" className="text-[13px] font-semibold tracking-tight text-foreground" />
                      <EditableText page="about" path={["credentials", si, "items", i, "sub"]} value={item.sub} as="p" className="text-[11px] tracking-tight text-foreground/40 mt-0.5" />
                      <EditableText page="about" path={["credentials", si, "items", i, "detail"]} value={item.detail} as="p" className="text-[12px] tracking-tight text-foreground/55 mt-2 leading-relaxed" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TOOLS STACK ── */}
        <div className="mb-8 rounded-[16px] border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-secondary/40">
            <EditableText page="about" path={["page", "kickerTools"]} value={pg.kickerTools} as="p" className="text-[11px] uppercase tracking-[0.2em] text-foreground/50 font-medium" />
          </div>
          <div className="p-6 flex flex-wrap gap-2">
            {about.tools.map((tool, ti) => (
              <div
                key={ti}
                className="flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1.5"
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ background: tool.color }}
                />
                <EditableText page="about" path={["tools", ti, "name"]} value={tool.name} as="span" className="text-[12px] tracking-tight text-foreground/70" />
                <EditableText page="about" path={["tools", ti, "category"]} value={tool.category} as="span" className="text-[10px] tracking-tight text-foreground/30" />
              </div>
            ))}
          </div>
        </div>

        {/* ── DEVICES ── */}
        <div className="mb-8">
          <EditableText page="about" path={["page", "kickerDevices"]} value={pg.kickerDevices} as="p" className="text-[10px] uppercase tracking-[0.26em] text-foreground/35 mb-5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {about.devices.map((device, di) => (
              <div key={di} className="rounded-[16px] border border-border bg-card px-5 py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-10px_oklch(0.2_0.02_240/0.2)]">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-[12px] mb-4 overflow-hidden"
                  style={{ background: "var(--secondary)" }}
                >
                  <img 
                    src={device.image} 
                    alt={device.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback to a generic icon if image fails to load
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).parentElement!.innerHTML = "🖥";
                    }}
                  />
                </div>
                <EditableText page="about" path={["devices", di, "name"]} value={device.name} as="p" className="text-[13px] font-semibold tracking-tight text-foreground" />
                <EditableText page="about" path={["devices", di, "role"]} value={device.role} as="p" className="text-[11px] tracking-tight text-foreground/40 mt-0.5 mb-3" />
                <div className="space-y-1">
                  {device.specs.map((spec, spi) => (
                    <div key={spi} className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-foreground/20 shrink-0" />
                      <EditableText page="about" path={["devices", di, "specs", spi]} value={spec} as="span" className="text-[11px] tracking-tight text-foreground/50" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="rounded-[14px] border border-border bg-card px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <EditableText page="about" path={["page", "ctaTitle"]} value={pg.ctaTitle} as="p" className="text-[15px] font-semibold tracking-tight text-foreground" />
            <EditableText page="about" path={["page", "ctaBody"]} value={pg.ctaBody} as="p" className="mt-1 text-[12px] tracking-tight text-foreground/50" />
          </div>
          <div className="flex items-center gap-3">
            <Link to="/clients" className="rounded-full border border-border bg-secondary px-5 py-2 text-[12px] tracking-tight text-foreground/60 hover:bg-card transition shrink-0">
              <EditableText page="about" path={["page", "ctaClients"]} value={pg.ctaClients} />
            </Link>
            <Link to="/" hash="contact" className="cta-primary rounded-full px-5 py-2 text-[12px] font-medium tracking-tight shrink-0">
              <EditableText page="about" path={["page", "ctaHire"]} value={pg.ctaHire} />
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
