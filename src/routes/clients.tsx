﻿import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { NavBar } from "@/components/NavBar";
import { TrafficLights } from "@/components/TrafficLights";
import { Reveal } from "@/hooks/useScrollReveal";
import { type Client } from "@/lib/clients-data";
import { useClients, useClientsMeta, useChrome } from "@/lib/content";
import { EditableText, EditableImage, useEdit } from "@/lib/edit-mode";

export const Route = createFileRoute("/clients")({
  component: ClientsPage,
  head: () => ({
    meta: [
      { title: "Clients – Shanzster" },
      { name: "description", content: "Brands and businesses I've worked with." },
    ],
  }),
});




/* ─── Image placeholder ─── */
function ImgSlot({ src, caption, color, client, path }: { src?: string; caption: string; color: string; client?: Client; path?: (string | number)[] }) {
  const { data: chrome } = useChrome();
  return (
    <div className="flex flex-col gap-2">
      <div
        className="w-full rounded-[12px] border border-border/40 overflow-hidden flex items-center justify-center"
        style={{ height: 200, background: color }}
      >
        {client && path ? (
          <EditableImage collection="clients" id={client.id} item={client} path={[...path, "src"]} src={src ?? ""} alt={caption} wrapperClassName="block w-full h-full" className="w-full h-full object-cover" />
        ) : src
          ? <img src={src} alt={caption} className="w-full h-full object-cover" />
          : (
            <div className="text-center p-4">
              <p className="text-white/10 text-[24px]">✦</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-white/20">{chrome.clientsPage.addScreenshotLabel}</p>
            </div>
          )
        }
      </div>
      {client && path ? (
        <EditableText collection="clients" id={client.id} item={client} path={[...path, "caption"]} value={caption} as="p" className="text-[11px] tracking-tight text-foreground/45 leading-snug" />
      ) : (
        <p className="text-[11px] tracking-tight text-foreground/45 leading-snug">{caption}</p>
      )}
    </div>
  );
}

/* ─── Client modal – full-page sheet from bottom ─── */
function ClientModal({ client, onClose }: { client: Client; onClose: () => void }) {
  const { data: chrome } = useChrome();
  const cp = chrome.clientsPage;
  const { editing } = useEdit();
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const sections = [
    { key: "screenshots", label: "Work & Content",             items: client.screenshots },
    { key: "interviews",  label: "Discovery & Interviews",     items: client.interviews  },
    { key: "meetings",    label: "Meetings & Briefs",          items: client.meetings    },
    { key: "replies",     label: "Client Replies & Feedback",  items: client.replies     },
  ].filter((s) => s.items && s.items.length > 0);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-end"
      style={{ background: "oklch(0.1 0.01 240 / 0.5)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full bg-card"
        style={{
          borderRadius: "20px 20px 0 0",
          maxHeight: "92vh",
          animation: "sheet-up 0.45s cubic-bezier(.2,.8,.2,1) both",
          boxShadow: "0 -8px 48px -8px oklch(0.2 0.02 240 / 0.22), 0 0 0 0.5px oklch(0.5 0.01 240 / 0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* macOS title bar – sticky */}
        <div
          className="flex h-10 items-center justify-between border-b border-border bg-secondary/60 px-5 sticky top-0 z-10"
          style={{ borderRadius: "20px 20px 0 0" }}
        >
          <TrafficLights onClose={onClose} />
          <EditableText collection="clients" id={client.id} item={client} path={["handle"]} value={client.handle} as="span" className="text-[11px] tracking-tight text-foreground/50" />
          <button onClick={onClose} className="text-[11px] tracking-tight text-foreground/35 hover:text-foreground transition">✕ close</button>
        </div>

        {/* Scrollable body */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(92vh - 40px)" }}
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Hero cover */}
          <div className="w-full relative flex items-end" style={{ height: 320, background: client.color }}>
            {client.coverImg
              ? <img src={client.coverImg} alt={client.name} className="absolute inset-0 w-full h-full object-cover" />
              : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white/10 text-[72px] font-bold tracking-tightest">{client.name[0]}</p>
                </div>
              )
            }
            {/* Scrim */}
            <div className="absolute inset-x-0 bottom-0" style={{ height: "55%", background: "linear-gradient(to top, oklch(1 0 0 / 0.95), transparent)" }} />
            {/* Info overlay */}
            <div className="relative z-10 px-10 pb-8 w-full">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <EditableText collection="clients" id={client.id} item={client} path={["category"]} value={client.category} as="p" className="text-[10px] uppercase tracking-[0.24em] text-foreground/40 mb-1" />
                  <EditableText collection="clients" id={client.id} item={client} path={["name"]} value={client.name} as="h2" className="text-[clamp(28px,4vw,52px)] font-bold tracking-tightest text-foreground leading-tight block" />
                  <p className="mt-1 text-[13px] tracking-tight text-foreground/50">
                    <EditableText collection="clients" id={client.id} item={client} path={["platform"]} value={client.platform} /> ·{" "}
                    <EditableText collection="clients" id={client.id} item={client} path={["handle"]} value={client.handle} />
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.14em]"
                    style={client.status === "Coming Soon"
                      ? { background: "oklch(0.62 0.16 255 / 0.15)", color: "oklch(0.62 0.16 255)" }
                      : { background: "oklch(0.78 0.17 145 / 0.15)", color: "oklch(0.55 0.17 145)" }
                    }
                  >{client.status}</span>
                  <a
                    href={client.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border bg-card/80 px-4 py-1.5 text-[11px] tracking-tight text-foreground/60 hover:bg-card transition"
                  >
                    <EditableText page="chrome" path={["clientsPage", "viewPage"]} value={cp.viewPage} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Description + services */}
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border border-b border-border">
            <div className="px-8 py-7 lg:col-span-2">
              <EditableText page="chrome" path={["clientsPage", "aboutLabel"]} value={cp.aboutLabel} as="p" className="text-[10px] uppercase tracking-[0.2em] text-foreground/30 mb-3" />
              <EditableText collection="clients" id={client.id} item={client} path={["description"]} value={client.description} as="p" className="text-[14px] leading-relaxed tracking-tight text-foreground/65" />
            </div>
            <div className="px-8 py-7">
              <EditableText page="chrome" path={["clientsPage", "servicesLabel"]} value={cp.servicesLabel} as="p" className="text-[10px] uppercase tracking-[0.2em] text-foreground/30 mb-3" />
              <div className="flex flex-wrap gap-2">
                {client.services.map((s, si) => (
                  <EditableText key={si} collection="clients" id={client.id} item={client} path={["services", si]} value={s} as="span" className="rounded-full bg-secondary border border-border px-3 py-1 text-[11px] tracking-tight text-foreground/55" />
                ))}
              </div>
              <div className="mt-5">
                {client.status === "Coming Soon" ? (
                  <span className="inline-flex rounded-full border border-border px-4 py-2 text-[11px] tracking-tight text-foreground/30 cursor-default">
                    {cp.caseStudySoon}
                  </span>
                ) : (
                  <Link
                    to="/work/$id"
                    params={{ id: client.id }}
                    className="inline-flex rounded-full bg-foreground px-4 py-2 text-[11px] tracking-tight text-background hover:opacity-85 transition"
                    onClick={onClose}
                  >
                    <EditableText page="chrome" path={["clientsPage", "fullCaseStudy"]} value={cp.fullCaseStudy} />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Content sections */}
          {sections.map((section) => (
            <div key={section.key} className="px-8 py-8 border-b border-border">
              <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/30 mb-6">{section.label}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {section.items!.map((item, i) => (
                  <ImgSlot key={i} src={item.src} caption={item.caption} color={`${client.color}${i % 2 === 0 ? "cc" : "99"}`} client={client} path={[section.key, i]} />
                ))}
              </div>
            </div>
          ))}

          {/* Bottom padding */}
          <div className="h-12" />
        </div>
      </div>
    </div>
  );
}


/* ─── Count-up stat value ─── */
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
          const eased = 1 - Math.pow(1 - t, 3);
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

/* ─── Desktop icon (grid view) ─── */
function ClientIcon({ client, index, onOpen }: { client: Client; index: number; onOpen: (c: Client) => void }) {
  const { editing } = useEdit();
  const { data: chrome } = useChrome();
  const isComingSoon = client.status === "Coming Soon";
  return (
    <button
      className="group flex flex-col items-center gap-2.5 cursor-default select-none"
      onClick={() => { if (!editing) onOpen(client); }}
      style={{ animation: `fade-up-in 0.45s cubic-bezier(.2,.8,.2,1) ${index * 45}ms both` }}
    >
      {/* Icon */}
      <div
        className="relative rounded-[20px] overflow-hidden transition-all duration-200 group-hover:scale-105 group-hover:shadow-[0_12px_32px_-8px_oklch(0.2_0.02_240/0.25)]"
        style={{ width: 120, height: 120 }}
      >
        {editing ? (
          <EditableImage collection="clients" id={client.id} item={client} path={["coverImg"]} src={client.coverImg ?? client.logo ?? ""} alt={client.name} wrapperClassName="block w-full h-full" className="w-full h-full object-cover" />
        ) : client.coverImg || client.logo ? (
          <img
            src={client.coverImg ?? client.logo}
            alt={client.name}
            className={`w-full h-full object-cover ${isComingSoon ? "opacity-50" : ""}`}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${isComingSoon ? "opacity-50" : ""}`}
            style={{ background: `linear-gradient(145deg, ${client.color}, ${client.color}88)` }}
          >
            <span className="text-[48px] font-bold text-white/25 tracking-tightest leading-none">
              {client.name[0]}
            </span>
          </div>
        )}
        {isComingSoon ? (
          <div
            className="absolute top-2 right-2 rounded-full px-1.5 py-0.5 text-[8px] uppercase tracking-[0.12em] font-medium border"
            style={{ background: "oklch(0.15 0.01 240 / 0.75)", color: "oklch(0.75 0.12 255)", borderColor: "oklch(0.62 0.16 255 / 0.4)", backdropFilter: "blur(4px)" }}
          >
            {chrome.clientsPage.soonLabel}
          </div>
        ) : (
          <div
            className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full border-2 border-white"
            style={{ background: "var(--traffic-green)" }}
          />
        )}
      </div>

      {/* Label — Finder selection highlight on hover */}
      <div className="px-2 py-0.5 rounded-[4px] text-center text-foreground transition-colors duration-150 group-hover:bg-[oklch(0.62_0.18_255)] group-hover:text-white">
        <EditableText collection="clients" id={client.id} item={client} path={["name"]} value={client.name} as="p" className="text-[12px] font-medium tracking-tight leading-tight" />
        <EditableText collection="clients" id={client.id} item={client} path={["platform"]} value={client.platform} as="p" className="text-[10px] tracking-tight opacity-60 mt-0.5" />
      </div>
    </button>
  );
}

/* ─── List row (list view) ─── */
function ClientRow({ client, index, onOpen }: { client: Client; index: number; onOpen: (c: Client) => void }) {
  const { editing } = useEdit();
  const { data: chrome } = useChrome();
  const isComingSoon = client.status === "Coming Soon";
  return (
    <button
      onClick={() => { if (!editing) onOpen(client); }}
      className="w-full grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_1.6fr_1.4fr_auto] gap-4 items-center px-6 py-3 text-left hover:bg-secondary/60 transition-colors"
      style={{ animation: `fade-up-in 0.35s cubic-bezier(.2,.8,.2,1) ${index * 35}ms both` }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="h-8 w-8 rounded-[8px] overflow-hidden shrink-0 flex items-center justify-center"
          style={{ background: `linear-gradient(145deg, ${client.color}, ${client.color}88)` }}
        >
          {editing
            ? <EditableImage collection="clients" id={client.id} item={client} path={["logo"]} src={client.logo ?? ""} alt={client.name} wrapperClassName="block w-full h-full" className="w-full h-full object-cover" />
            : client.logo
            ? <img src={client.logo} alt={client.name} className="w-full h-full object-cover" />
            : <span className="text-[13px] font-bold text-white/40">{client.name[0]}</span>
          }
        </div>
        <div className="min-w-0">
          <EditableText collection="clients" id={client.id} item={client} path={["name"]} value={client.name} as="p" className="text-[13px] font-medium tracking-tight text-foreground truncate" />
          <p className="sm:hidden text-[10px] tracking-tight text-foreground/40 truncate">{client.category}</p>
        </div>
      </div>
      <EditableText collection="clients" id={client.id} item={client} path={["category"]} value={client.category} as="span" className="hidden sm:block text-[12px] tracking-tight text-foreground/50 truncate" />
      <EditableText collection="clients" id={client.id} item={client} path={["platform"]} value={client.platform} as="span" className="hidden sm:block text-[12px] tracking-tight text-foreground/50 truncate" />
      <span className="flex items-center gap-1.5 justify-end">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: isComingSoon ? "oklch(0.62 0.16 255)" : "var(--traffic-green)" }}
        />
        <span className="text-[11px] tracking-tight text-foreground/45">{isComingSoon ? chrome.clientsPage.soonLabel : chrome.clientsPage.activeLabel}</span>
      </span>
    </button>
  );
}

/* ─── Main page ─── */
function ClientsPage() {
  const { items: CLIENTS } = useClients();
  const { data: clientsMeta } = useClientsMeta();
  const { data: chrome } = useChrome();
  const cp = chrome.clientsPage;
  const { editing } = useEdit();
  const STATS = clientsMeta.stats;
  const FILTERS = clientsMeta.filters;
  const [active, setActive] = useState<Client | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("All");

  const visibleClients = filter === "All" ? CLIENTS : CLIENTS.filter((c) => c.group === filter);
  const openClient = (c: Client) =>
    c.status === "Coming Soon" ? setShowComingSoon(true) : setActive(c);

  return (
    <div className="min-h-screen bg-background pb-32">
      <NavBar />

      {active && <ClientModal client={active} onClose={() => setActive(null)} />}

      {/* Coming Soon modal */}
      {showComingSoon && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "oklch(0.1 0.01 240 / 0.65)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
          onClick={() => setShowComingSoon(false)}
        >
          <div
            className="w-full overflow-hidden rounded-[20px] border border-border bg-card shadow-[0_32px_80px_-16px_oklch(0.2_0.02_240/0.5)]"
            style={{ maxWidth: 380 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-10 items-center justify-between border-b border-border bg-secondary/60 px-4" style={{ borderRadius: "20px 20px 0 0" }}>
              <TrafficLights onClose={() => setShowComingSoon(false)} />
              <EditableText page="chrome" path={["clientsPage", "comingSoon", "windowTitle"]} value={cp.comingSoon.windowTitle} as="span" className="text-[11px] tracking-tight text-foreground/45" />
              <button onClick={() => setShowComingSoon(false)} className="text-[11px] tracking-tight text-foreground/35 hover:text-foreground transition">✕ close</button>
            </div>
            <div className="px-8 py-8 text-center">
              <div
                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[18px]"
                style={{ background: "oklch(0.62 0.16 255 / 0.12)", border: "1px solid oklch(0.62 0.16 255 / 0.25)" }}
              >
                <span className="text-[30px]">🏗️</span>
              </div>
              <EditableText page="chrome" path={["clientsPage", "comingSoon", "kicker"]} value={cp.comingSoon.kicker} as="p" className="text-[10px] uppercase tracking-[0.22em] text-foreground/35 mb-2" />
              <EditableText page="chrome" path={["clientsPage", "comingSoon", "title"]} value={cp.comingSoon.title} as="h3" className="text-[20px] font-bold tracking-tightest text-foreground leading-tight mb-3 block" />
              <p className="text-[13px] leading-relaxed tracking-tight text-foreground/55 mb-6">
                <EditableText page="chrome" path={["clientsPage", "comingSoon", "body"]} value={cp.comingSoon.body} />{" "}
                <a
                  href="https://instagram.com/shanzster.zip"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-foreground/80 underline underline-offset-2 hover:text-foreground transition"
                >
                  <EditableText page="chrome" path={["clientsPage", "comingSoon", "handle"]} value={cp.comingSoon.handle} />
                </a>{" "}
                <EditableText page="chrome" path={["clientsPage", "comingSoon", "bodyEnd"]} value={cp.comingSoon.bodyEnd} />
              </p>
              <div className="flex flex-col gap-2.5">
                <a
                  href="https://instagram.com/shanzster.zip"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-[12px] tracking-tight text-background transition hover:opacity-85"
                >
                  <EditableText page="chrome" path={["clientsPage", "comingSoon", "follow"]} value={cp.comingSoon.follow} />
                </a>
                <button
                  onClick={() => setShowComingSoon(false)}
                  className="rounded-full border border-border px-6 py-2.5 text-[12px] tracking-tight text-foreground/50 transition hover:bg-secondary"
                >
                  <EditableText page="chrome" path={["clientsPage", "comingSoon", "gotIt"]} value={cp.comingSoon.gotIt} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-[1100px] px-6 pt-10 sm:px-10">

        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-[12px] tracking-tight text-foreground/40 hover:text-foreground transition mb-10">
          <EditableText page="chrome" path={["clientsPage", "back"]} value={cp.back} />
        </Link>

        {/* Header */}
        <div className="mb-10">
          <EditableText page="chrome" path={["clientsPage", "kicker"]} value={cp.kicker} as="p" className="text-[10px] uppercase tracking-[0.26em] text-foreground/35 mb-3" />
          <h1 className="font-bold tracking-tightest text-foreground leading-[0.88]" style={{ fontSize: "clamp(44px, 6vw, 80px)" }}>
            <EditableText page="chrome" path={["clientsPage", "titleTop"]} value={cp.titleTop} as="span" className="block" />
            <EditableText page="chrome" path={["clientsPage", "titleAccent"]} value={cp.titleAccent} as="span" className="block" style={{ color: "oklch(0.18 0.01 240 / 0.25)" }} />
          </h1>
          <EditableText page="chrome" path={["clientsPage", "blurb"]} value={cp.blurb} as="p" className="mt-5 text-[14px] leading-relaxed tracking-tight text-foreground/55 max-w-lg" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border border border-border rounded-[14px] overflow-hidden bg-card mb-10">
          {STATS.map(({ v, l }, i) => (
            <div key={i} className="px-6 py-5">
              <p className="text-[28px] font-bold tracking-tightest leading-none text-foreground">
                {editing ? (
                  <EditableText page="clientsMeta" path={["stats", i, "v"]} value={v} />
                ) : (
                  <CountUp value={v} />
                )}
              </p>
              <EditableText page="clientsMeta" path={["stats", i, "l"]} value={l} as="p" className="mt-1 text-[10px] uppercase tracking-[0.14em] text-foreground/40" />
            </div>
          ))}
        </div>

        {/* Client grid – macOS Finder window */}
        <Reveal>
        <div className="rounded-[16px] border border-border bg-card overflow-hidden mac-shadow">
          {/* Finder title bar */}
          <div className="flex h-9 items-center justify-between border-b border-border bg-secondary/60 px-4">
            <TrafficLights size={11} />
            <EditableText page="chrome" path={["clientsPage", "finderTitle"]} value={cp.finderTitle} as="span" className="text-[11px] tracking-tight text-foreground/50" />
            <span className="text-[10px] tracking-tight text-foreground/30">{visibleClients.length} <EditableText page="chrome" path={["clientsPage", "itemsSuffix"]} value={cp.itemsSuffix} /></span>
          </div>

          {/* Finder toolbar — filter tags + view toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/30 px-4 py-2.5">
            <div className="flex items-center gap-3">
              {/* Back / forward chrome */}
              <div className="hidden sm:flex items-center gap-2 text-foreground/25 select-none">
                <span className="text-[15px] leading-none">‹</span>
                <span className="text-[15px] leading-none">›</span>
              </div>
              {/* Filter tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                {FILTERS.map((f, fi) => {
                  const isActive = filter === f.label;
                  return (
                    <button
                      key={f.label}
                      onClick={() => setFilter(f.label)}
                      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] tracking-tight transition ${
                        isActive
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-card text-foreground/55 hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: f.dot }} />
                      <EditableText page="clientsMeta" path={["filters", fi, "label"]} value={f.label} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* View toggle — icon / list */}
            <div className="flex items-center rounded-[8px] border border-border bg-card overflow-hidden">
              <button
                onClick={() => setView("grid")}
                aria-label="Icon view"
                className={`px-2.5 py-1.5 transition ${view === "grid" ? "bg-secondary text-foreground" : "text-foreground/35 hover:text-foreground/70"}`}
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
                  <rect x="0" y="0" width="6" height="6" rx="1.5" />
                  <rect x="8" y="0" width="6" height="6" rx="1.5" />
                  <rect x="0" y="8" width="6" height="6" rx="1.5" />
                  <rect x="8" y="8" width="6" height="6" rx="1.5" />
                </svg>
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="List view"
                className={`px-2.5 py-1.5 border-l border-border transition ${view === "list" ? "bg-secondary text-foreground" : "text-foreground/35 hover:text-foreground/70"}`}
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
                  <rect x="0" y="1" width="14" height="2" rx="1" />
                  <rect x="0" y="6" width="14" height="2" rx="1" />
                  <rect x="0" y="11" width="14" height="2" rx="1" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Grid view ── */}
          {view === "grid" ? (
            <div className="p-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
              {visibleClients.map((client, i) => (
                <ClientIcon key={`${filter}-${client.id}`} client={client} index={i} onOpen={openClient} />
              ))}
            </div>
          ) : (
            /* ── List view ── */
            <div>
              <div className="hidden sm:grid grid-cols-[2fr_1.6fr_1.4fr_auto] gap-4 px-6 py-2 border-b border-border bg-secondary/20 text-[10px] uppercase tracking-[0.14em] text-foreground/35">
                <EditableText page="chrome" path={["clientsPage", "colName"]} value={cp.colName} as="span" />
                <EditableText page="chrome" path={["clientsPage", "colCategory"]} value={cp.colCategory} as="span" />
                <EditableText page="chrome" path={["clientsPage", "colPlatform"]} value={cp.colPlatform} as="span" />
                <EditableText page="chrome" path={["clientsPage", "colStatus"]} value={cp.colStatus} as="span" className="text-right" />
              </div>
              <div className="divide-y divide-border">
                {visibleClients.map((client, i) => (
                  <ClientRow key={`${filter}-${client.id}`} client={client} index={i} onOpen={openClient} />
                ))}
              </div>
            </div>
          )}

          {/* Finder status bar */}
          <div className="border-t border-border px-5 py-2 flex items-center justify-between bg-secondary/30">
            <p className="text-[10px] tracking-tight text-foreground/35">
              <EditableText page="chrome" path={["clientsPage", "statusPath"]} value={cp.statusPath} />{filter !== "All" ? ` ▸ ${filter}` : ""} · click to open
            </p>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--traffic-green)" }} />
              <p className="text-[10px] tracking-tight text-foreground/35">{visibleClients.length} of {CLIENTS.length} <EditableText page="chrome" path={["clientsPage", "shownSuffix"]} value={cp.shownSuffix} /></p>
            </div>
          </div>
        </div>
        </Reveal>

        {/* CTA */}
        <div className="mt-8 rounded-[14px] border border-border bg-card px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <EditableText page="chrome" path={["clientsPage", "ctaTitle"]} value={cp.ctaTitle} as="p" className="text-[15px] font-semibold tracking-tight text-foreground" />
            <EditableText page="chrome" path={["clientsPage", "ctaBody"]} value={cp.ctaBody} as="p" className="mt-1 text-[12px] tracking-tight text-foreground/50" />
          </div>
          <Link to="/" hash="contact" className="rounded-full bg-foreground px-6 py-2.5 text-[12px] tracking-tight text-background transition hover:opacity-85 shrink-0">
            <EditableText page="chrome" path={["clientsPage", "ctaButton"]} value={cp.ctaButton} />
          </Link>
        </div>

      </main>
    </div>
  );
}
