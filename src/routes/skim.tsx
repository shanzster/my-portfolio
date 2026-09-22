import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { TrafficLights } from "@/components/TrafficLights";
import logoImage from "@/image_reference/logos/Shanzster_Logo.png";
import photoshopLogo from "@/image_reference/logos/PS.png";
import illustratorLogo from "@/image_reference/logos/AI.png";
import canvaLogo from "@/image_reference/logos/canva.png";
import capcutLogo from "@/image_reference/logos/capcut.png";
import metaLogo from "@/image_reference/logos/meta.png";
import { type SkimClient as Client } from "@/lib/skim-data";
import { useSkim } from "@/lib/content";
import { EditableText, EditableImage, useEdit } from "@/lib/edit-mode";

export const Route = createFileRoute("/skim")({
  component: SkimPage,
  head: () => ({
    meta: [
      { title: "Skim — Shanzster" },
      { name: "description", content: "The whole portfolio in one screen — visuals, analytics, and the essentials." },
    ],
  }),
});

/* ─── Condensed data (essentials + proof) ─── */


const TOOL_LOGOS = [
  { src: photoshopLogo, name: "Photoshop" },
  { src: illustratorLogo, name: "Illustrator" },
  { src: canvaLogo, name: "Canva" },
  { src: capcutLogo, name: "CapCut" },
  { src: metaLogo, name: "Meta Ads" },
];








/* ─── Section registry ─── */

type SectionId = "overview" | "work" | "results" | "services" | "socials" | "contact";

const SECTIONS: { id: SectionId; label: string; glyph: string; color: string }[] = [
  { id: "overview", label: "Overview", glyph: "✦", color: "oklch(0.62 0.16 255)" },
  { id: "work", label: "Work", glyph: "▣", color: "oklch(0.68 0.14 238)" },
  { id: "results", label: "Results", glyph: "▲", color: "oklch(0.58 0.15 145)" },
  { id: "services", label: "Services", glyph: "≣", color: "oklch(0.60 0.16 170)" },
  { id: "socials", label: "Socials", glyph: "◎", color: "oklch(0.62 0.20 350)" },
  { id: "contact", label: "Contact", glyph: "✉", color: "oklch(0.68 0.18 27)" },
];

type OpenImg = (img: { src: string; label: string }) => void;

/* ─── Shared bits ─── */

type HeaderKey = "work" | "results" | "services" | "socials" | "contact";

function ScreenHeader({ hk }: { hk: HeaderKey }) {
  const { data: skim } = useSkim();
  const h = skim.headers[hk];
  return (
    <div className="mb-5">
      <EditableText page="skim" path={["headers", hk, "title"]} value={h.title} as="h2" className="text-[22px] font-bold tracking-tightest text-foreground leading-none block" />
      {h.sub && <EditableText page="skim" path={["headers", hk, "sub"]} value={h.sub} as="p" className="mt-1.5 text-[12px] tracking-tight text-foreground/45" />}
    </div>
  );
}

/* `path` points at the {src,label} object inside the skim doc so both the
   image and its caption are editable in place. */
function Thumb({ img, onOpen, ratio = "aspect-[4/3]", path }: { img: { src: string; label: string }; onOpen: OpenImg; ratio?: string; path?: (string | number)[] }) {
  return (
    <button onClick={() => onOpen(img)} className="group text-left focus:outline-none">
      <div className={`relative w-full overflow-hidden rounded-[10px] border border-border bg-secondary ${ratio}`}>
        {path ? (
          <EditableImage
            page="skim"
            path={[...path, "src"]}
            src={img.src}
            alt={img.label}
            wrapperClassName="absolute inset-0"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <img src={img.src} alt={img.label} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]" />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end p-2 pointer-events-none">
          <span className="opacity-0 group-hover:opacity-100 transition text-white text-[9px] tracking-[0.14em] uppercase">Open →</span>
        </div>
      </div>
      {path ? (
        <EditableText page="skim" path={[...path, "label"]} value={img.label} as="p" className="mt-1.5 text-[10px] tracking-tight text-foreground/45 leading-snug" />
      ) : (
        <p className="mt-1.5 text-[10px] tracking-tight text-foreground/45 leading-snug">{img.label}</p>
      )}
    </button>
  );
}

/* ─── Sections ─── */

function Overview() {
  const { data: skim } = useSkim();
  const { editing } = useEdit();
  const STATS = skim.stats;
  const ov = skim.overview;
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border border-border bg-secondary overflow-hidden">
          <img src={logoImage} alt="Shanzster" className="h-8 w-auto object-contain" />
        </div>
        <div>
          <EditableText page="skim" path={["overview", "name"]} value={ov.name} as="h2" className="text-[22px] font-bold tracking-tightest text-foreground leading-none block" />
          <EditableText page="skim" path={["overview", "subtitle"]} value={ov.subtitle} as="p" className="mt-1 text-[12px] tracking-tight text-foreground/45" />
        </div>
      </div>

      <EditableText page="skim" path={["overview", "paragraph"]} value={ov.paragraph} as="p" className="text-[13px] leading-relaxed tracking-tight text-foreground/70 max-w-md" />

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {STATS.map((s, i) => (
          <div key={i} className="rounded-[10px] border border-border bg-secondary/40 px-3 py-3">
            <EditableText page="skim" path={["stats", i, "v"]} value={s.v} as="p" className="text-[22px] font-bold tracking-tightest leading-none text-foreground" />
            <EditableText page="skim" path={["stats", i, "l"]} value={s.l} as="p" className="mt-1 text-[9px] uppercase tracking-[0.1em] text-foreground/45 leading-tight" />
          </div>
        ))}
      </div>

      <div className="mt-5">
        <EditableText page="skim" path={["overview", "toolkitLabel"]} value={ov.toolkitLabel} as="p" className="text-[9px] uppercase tracking-[0.2em] text-foreground/30 mb-2" />
        <div className="flex items-center gap-2 flex-wrap">
          {TOOL_LOGOS.map((t, i) => (
            <div key={i} className="relative h-9 w-9 rounded-[9px] overflow-hidden border border-border shadow-[0_2px_8px_-3px_oklch(0.2_0.02_240/0.25)]">
              <img src={ov.toolIcons?.[i] || t.src} alt={t.name} className="h-full w-full object-cover" />
              {editing && (
                <EditableImage
                  page="skim"
                  path={["overview", "toolIcons", i]}
                  src={ov.toolIcons?.[i] ?? ""}
                  alt={t.name}
                  wrapperClassName="absolute inset-0 block"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          ))}
          <EditableText page="skim" path={["overview", "toolkitExtra"]} value={ov.toolkitExtra} as="span" className="text-[10px] tracking-tight text-foreground/40" />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--traffic-green)" }} />
        <EditableText page="skim" path={["overview", "availability"]} value={ov.availability} as="span" className="text-[11px] tracking-tight text-foreground/55" />
      </div>
    </div>
  );
}

function Work({ onImage, onClient }: { onImage: OpenImg; onClient: (c: Client, i: number) => void }) {
  const { data: skim } = useSkim();
  const CLIENTS = skim.clients;
  const VISUALS = skim.visuals;
  return (
    <div>
      <ScreenHeader hk="work" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {CLIENTS.map((c, i) => (
          <button
            key={i}
            onClick={() => onClient(c, i)}
            className="flex items-center gap-3 rounded-[10px] border border-border bg-secondary/40 px-3 py-2.5 text-left hover:bg-secondary transition"
          >
            <div className="h-9 w-9 shrink-0 rounded-[8px] overflow-hidden flex items-center justify-center" style={{ background: c.color }}>
              {c.logo ? (
                <img src={c.logo} alt={c.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-white text-[13px] font-bold">{c.name[0]}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <EditableText page="skim" path={["clients", i, "name"]} value={c.name} as="p" className="text-[12px] font-medium tracking-tight text-foreground/85 leading-tight truncate" />
              <EditableText page="skim" path={["clients", i, "result"]} value={c.result} as="p" className="text-[10px] tracking-tight text-foreground/45 truncate" />
            </div>
            <span className="text-[11px] text-foreground/25">→</span>
          </button>
        ))}
      </div>

      <EditableText page="skim" path={["recentVisualsLabel"]} value={skim.recentVisualsLabel} as="p" className="mt-5 text-[9px] uppercase tracking-[0.2em] text-foreground/30 mb-2" />
      <div className="grid grid-cols-3 gap-2">
        {VISUALS.map((v, i) => (
          <Thumb key={i} img={v} onOpen={onImage} ratio="aspect-square" path={["visuals", i]} />
        ))}
      </div>
    </div>
  );
}

function Results({ onImage }: { onImage: OpenImg }) {
  const { data: skim } = useSkim();
  const RESULT_TILES = skim.resultTiles;
  const ANALYTICS = skim.analytics;
  return (
    <div>
      <ScreenHeader hk="results" />

      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {RESULT_TILES.map((r, i) => (
          <div key={i} className="rounded-[10px] border border-border bg-secondary/40 px-3 py-3">
            <EditableText page="skim" path={["resultTiles", i, "v"]} value={r.v} as="p" className="text-[20px] font-bold tracking-tightest leading-none text-foreground" />
            <EditableText page="skim" path={["resultTiles", i, "l"]} value={r.l} as="p" className="mt-1 text-[9px] uppercase tracking-[0.08em] text-foreground/45 leading-tight" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {ANALYTICS.map((a, i) => (
          <Thumb key={i} img={a} onOpen={onImage} ratio="aspect-[4/3]" path={["analytics", i]} />
        ))}
      </div>
    </div>
  );
}

function Services() {
  const { data: skim } = useSkim();
  const SERVICES = skim.services;
  return (
    <div>
      <ScreenHeader hk="services" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {SERVICES.map((s, i) => (
          <div key={i} className="rounded-[10px] border border-border bg-secondary/40 px-3 py-2.5">
            <EditableText page="skim" path={["services", i, "t"]} value={s.t} as="p" className="text-[12px] font-medium tracking-tight text-foreground/85" />
            <EditableText page="skim" path={["services", i, "d"]} value={s.d} as="p" className="text-[10.5px] tracking-tight text-foreground/45 leading-snug mt-0.5" />
          </div>
        ))}
      </div>
      <Link to="/services" className="mt-4 inline-block text-[11px] tracking-tight text-foreground/50 hover:text-foreground transition">
        <EditableText page="skim" path={["seeServicesLink"]} value={skim.seeServicesLink} />
      </Link>
    </div>
  );
}

function Socials() {
  const { data: skim } = useSkim();
  const SOCIALS = skim.socials;
  return (
    <div>
      <ScreenHeader hk="socials" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {SOCIALS.map((s, i) => (
          <a
            key={i}
            href={s.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-[10px] border border-border bg-secondary/40 px-3 py-2.5 hover:bg-secondary transition"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-[12px]" style={{ background: s.color }}>◎</span>
            <EditableText page="skim" path={["socials", i, "h"]} value={s.h} as="span" className="text-[12px] font-medium tracking-tight text-foreground/85 flex-1 truncate" />
            <span className="text-[10px] tracking-tight text-foreground/40">↗</span>
          </a>
        ))}
      </div>
      <Link to="/socials" className="mt-4 inline-block text-[11px] tracking-tight text-foreground/50 hover:text-foreground transition">
        <EditableText page="skim" path={["openSocialsLink"]} value={skim.openSocialsLink} />
      </Link>
    </div>
  );
}

function Contact() {
  const { data: skim } = useSkim();
  const actions = skim.contactActions;
  return (
    <div>
      <ScreenHeader hk="contact" />
      <div className="flex flex-col gap-2 max-w-sm">
        {actions.map((a, i) => (
          <a
            key={i}
            href={a.href}
            target={a.href.startsWith("http") || a.href.endsWith(".pdf") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-[10px] border border-border bg-secondary/40 px-4 py-3 hover:bg-secondary transition"
          >
            <EditableText page="skim" path={["contactActions", i, "label"]} value={a.label} as="span" className="text-[12px] font-medium tracking-tight text-foreground/85" />
            <EditableText page="skim" path={["contactActions", i, "sub"]} value={a.sub} as="span" className="text-[10px] tracking-tight text-foreground/40" />
          </a>
        ))}
        <a
          href="mailto:seanthetechyyy@gmail.com"
          className="mt-1 rounded-full bg-foreground px-5 py-2.5 text-center text-[12px] tracking-tight text-background transition hover:opacity-85"
        >
          <EditableText page="skim" path={["hireButton"]} value={skim.hireButton} />
        </a>
      </div>
    </div>
  );
}

function SectionContent({ id, onImage, onClient }: { id: SectionId; onImage: OpenImg; onClient: (c: Client, i: number) => void }) {
  switch (id) {
    case "overview": return <Overview />;
    case "work": return <Work onImage={onImage} onClient={onClient} />;
    case "results": return <Results onImage={onImage} />;
    case "services": return <Services />;
    case "socials": return <Socials />;
    case "contact": return <Contact />;
  }
}

/* ─── Client overview modal ─── */

function ClientModal({ client, index, onClose, onImage }: { client: Client; index: number; onClose: () => void; onImage: OpenImg }) {
  const { data: skim } = useSkim();
  const { editing } = useEdit();
  const cm = skim.clientModal;
  const graphics = client.graphics ?? [];
  return (
    <div
      className="fixed inset-0 z-[350] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-[16px] border border-border bg-card mac-shadow"
        style={{ animation: "modal-in 0.32s cubic-bezier(.2,.8,.2,1) both" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="flex h-9 shrink-0 items-center justify-between border-b border-border bg-secondary/60 px-3">
          <TrafficLights size={11} onClose={onClose} />
          <span className="text-[11px] tracking-tight text-foreground/55">{client.name}</span>
          <div className="w-[44px]" />
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[10px] flex items-center justify-center" style={{ background: client.color }}>
              {client.logo || editing ? (
                <EditableImage
                  page="skim"
                  path={["clients", index, "logo"]}
                  src={client.logo ?? ""}
                  alt={client.name}
                  wrapperClassName="relative block h-full w-full"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-white text-[18px] font-bold">{client.name[0]}</span>
              )}
            </div>
            <div>
              <EditableText page="skim" path={["clients", index, "name"]} value={client.name} as="h3" className="text-[18px] font-bold tracking-tightest text-foreground leading-tight block" />
              <p className="text-[11px] tracking-tight text-foreground/45">
                <EditableText page="skim" path={["clients", index, "tag"]} value={client.tag} /> ·{" "}
                <EditableText page="skim" path={["clients", index, "result"]} value={client.result} />
              </p>
            </div>
          </div>

          <EditableText page="skim" path={["clients", index, "overview"]} value={client.overview} as="p" className="mt-4 text-[13px] leading-relaxed tracking-tight text-foreground/70" />

          {graphics.length > 0 ? (
            <>
              <EditableText page="skim" path={["clientModal", "sampleGraphics"]} value={cm.sampleGraphics} as="p" className="mt-5 text-[9px] uppercase tracking-[0.2em] text-foreground/30 mb-2" />
              <div className="grid grid-cols-3 gap-2">
                {graphics.map((g, gi) => (
                  <Thumb key={gi} img={g} onOpen={onImage} ratio="aspect-square" path={["clients", index, "graphics", gi]} />
                ))}
              </div>
            </>
          ) : (
            <EditableText page="skim" path={["clientModal", "moreVisuals"]} value={cm.moreVisuals} as="p" className="mt-5 rounded-[10px] border border-border bg-secondary/40 px-3 py-2.5 text-[11px] tracking-tight text-foreground/45" />
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border p-3">
          <button onClick={onClose} className="px-2 text-[11px] tracking-tight text-foreground/50 transition hover:text-foreground">
            <EditableText page="skim" path={["clientModal", "close"]} value={cm.close} />
          </button>
          <Link
            to={client.to}
            className="rounded-full bg-foreground px-4 py-2 text-[11px] tracking-tight text-background transition hover:opacity-85"
          >
            <EditableText page="skim" path={["clientModal", "fullCaseStudy"]} value={cm.fullCaseStudy} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── Image lightbox ─── */

function ImageLightbox({ img, onClose }: { img: { src: string; label: string }; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center p-6"
      style={{ background: "oklch(0.04 0.01 240 / 0.94)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
      onClick={onClose}
    >
      <div className="relative max-w-3xl w-full" style={{ animation: "modal-in 0.3s cubic-bezier(.2,.8,.2,1) both" }} onClick={(e) => e.stopPropagation()}>
        <img src={img.src} alt={img.label} className="w-full max-h-[80vh] object-contain rounded-[14px] border border-white/10" />
        <div className="mt-3 flex items-center justify-between gap-4">
          <p className="text-white/70 text-[12px] tracking-tight">{img.label}</p>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 border border-white/15 text-white/60 hover:bg-white/20 hover:text-white transition text-[13px]" aria-label="Close">✕</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Button (sidebar on desktop, tab on mobile) ─── */

function NavButton({
  section,
  index,
  label,
  active,
  onClick,
}: {
  section: (typeof SECTIONS)[number];
  index: number;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 md:flex-none md:w-full flex-col md:flex-row items-center md:gap-3 gap-1 rounded-[10px] px-2 py-2 md:px-3 md:py-2.5 transition-colors ${
        active ? "bg-secondary" : "hover:bg-secondary/50"
      }`}
      aria-label={label}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] text-[15px] text-white"
        style={{ background: section.color, opacity: active ? 1 : 0.55 }}
      >
        {section.glyph}
      </span>
      <span
        className={`text-[10px] md:text-[13px] tracking-tight ${
          active ? "text-foreground font-medium" : "text-foreground/50"
        }`}
      >
        <EditableText page="skim" path={["chrome", "sectionLabels", index]} value={label} />
      </span>
    </button>
  );
}

/* ─── Page ─── */

function SkimPage() {
  const { data: skim } = useSkim();
  const chrome = skim.chrome;
  const [active, setActive] = useState<SectionId>("overview"); // selected button (updates instantly)
  const [display, setDisplay] = useState<SectionId>("overview"); // content on screen
  const [anim, setAnim] = useState<"" | "genie-down" | "genie-up">("");
  const [lightbox, setLightbox] = useState<{ src: string; label: string } | null>(null);
  const [client, setClient] = useState<{ c: Client; i: number } | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), []);

  function go(id: SectionId) {
    if (id === active) return;
    setActive(id);
    setAnim("genie-down"); // current screen sucks down
    const t1 = window.setTimeout(() => {
      setDisplay(id); // swap content at the bottom…
      setAnim("genie-up"); // …then it rises up
    }, 260);
    const t2 = window.setTimeout(() => setAnim(""), 260 + 420);
    timers.current.push(t1, t2);
  }

  const shownIdx = SECTIONS.findIndex((s) => s.id === display);
  const shown = SECTIONS[shownIdx];
  const shownLabel = chrome.sectionLabels[shownIdx] ?? shown.label;

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-background">
      {client && <ClientModal client={client.c} index={client.i} onClose={() => setClient(null)} onImage={setLightbox} />}
      {lightbox && <ImageLightbox img={lightbox} onClose={() => setLightbox(null)} />}

      {/* macOS menu bar / status bar (also reads as the phone status bar on mobile) */}
      <div className="flex h-8 shrink-0 items-center justify-between border-b border-border bg-card/70 px-4 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--traffic-green)" }} />
          <EditableText page="skim" path={["chrome", "menuName"]} value={chrome.menuName} as="span" className="text-[11px] font-medium tracking-tight text-foreground/70" />
          <EditableText page="skim" path={["chrome", "menuSub"]} value={chrome.menuSub} as="span" className="hidden sm:inline text-[11px] tracking-tight text-foreground/35" />
        </div>
        <Link to="/" className="text-[11px] tracking-tight text-foreground/50 transition hover:text-foreground">
          <EditableText page="skim" path={["chrome", "fullSiteLink"]} value={chrome.fullSiteLink} />
        </Link>
      </div>

      {/* Body: 1/4 buttons + 3/4 screen (desktop) · buttons on the bottom (mobile) */}
      <div className="flex min-h-0 flex-1 flex-col-reverse md:flex-row">
        {/* Buttons — 1/4 */}
        <nav className="flex shrink-0 items-stretch gap-1 border-t border-border bg-card/50 p-2 md:w-1/4 md:max-w-[300px] md:flex-col md:gap-1.5 md:border-r md:border-t-0 md:p-4">
          <p className="hidden md:block px-2 pb-2 text-[9px] uppercase tracking-[0.2em] text-foreground/30">Sections</p>
          {SECTIONS.map((s, i) => (
            <NavButton key={s.id} section={s} index={i} label={chrome.sectionLabels[i] ?? s.label} active={s.id === active} onClick={() => go(s.id)} />
          ))}
        </nav>

        {/* Screen — 3/4 */}
        <main className="flex min-h-0 flex-1 p-3 md:p-6">
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[16px] border border-border bg-card mac-shadow">
            {/* Screen title bar */}
            <div className="flex h-9 shrink-0 items-center justify-between border-b border-border bg-secondary/60 px-3">
              <TrafficLights size={11} />
              <span className="flex items-center gap-1.5 text-[11px] tracking-tight text-foreground/55">
                <span style={{ color: shown.color }}>{shown.glyph}</span>
                {shownLabel}
              </span>
              <div className="w-[44px]" />
            </div>

            {/* Animated screen content (genie) */}
            <div
              className={`min-h-0 flex-1 overflow-y-auto p-6 sm:p-8 ${anim}`}
              style={{ transformOrigin: "bottom center" }}
            >
              <SectionContent id={display} onImage={setLightbox} onClient={(c, i) => setClient({ c, i })} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
