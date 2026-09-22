import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "@tanstack/react-router";

type SpotItem = {
  label: string;
  sub: string;
  glyph: string;
  keywords?: string;
  hash?: string;        // scroll to a home-page section
  to?: string;          // navigate to a route
  href?: string;        // external link
};

const SECTIONS: SpotItem[] = [
  { label: "About",          sub: "Home section", glyph: "◉", hash: "about" },
  { label: "My Toolkit",     sub: "Home section", glyph: "✦", hash: "toolkit", keywords: "tools photoshop canva capcut" },
  { label: "Selected Work",  sub: "Home section", glyph: "▤", hash: "work", keywords: "portfolio projects folder" },
  { label: "Services",       sub: "Home section", glyph: "◈", hash: "services", keywords: "pricing offers" },
  { label: "How I Work",     sub: "Home section", glyph: "⬡", hash: "process" },
  { label: "Testimonials",   sub: "Home section", glyph: "❝", hash: "testimonials", keywords: "reviews clients say" },
  { label: "Latest Work",    sub: "Home section", glyph: "▦", hash: "latest", keywords: "posts feed" },
  { label: "FAQ",            sub: "Home section", glyph: "?", hash: "faq", keywords: "questions" },
  { label: "Contact",        sub: "Home section", glyph: "✉", hash: "contact", keywords: "hire email message" },
];

const PAGES: SpotItem[] = [
  { label: "Clients",            sub: "Page", glyph: "▣", to: "/clients" },
  { label: "About Me",           sub: "Page", glyph: "◉", to: "/about", keywords: "story journey bio" },
  { label: "Gallery",            sub: "Page", glyph: "▦", to: "/gallery" },
  { label: "Graphics",           sub: "Page", glyph: "✦", to: "/graphics" },
  { label: "Videos & Reels",     sub: "Page", glyph: "▶", to: "/videos" },
  { label: "Content Calendars",  sub: "Page", glyph: "▤", to: "/calendars" },
  { label: "Campaign Analytics", sub: "Page", glyph: "⬡", to: "/ads", keywords: "ads meta google" },
];

const CLIENTS: SpotItem[] = [
  { label: "Oaklynwear",             sub: "Client · Fashion",         glyph: "O", to: "/work/oaklynwear" },
  { label: "Roselyn Atelier",        sub: "Client · Fashion",         glyph: "R", to: "/work/roselyn-atelier" },
  { label: "Lirenne Wear",           sub: "Client · Fashion",         glyph: "L", to: "/work/lirenne-wear" },
  { label: "Bella Monza",            sub: "Client · Fashion",         glyph: "B", to: "/work/bella-monza" },
  { label: "StealandStyle",          sub: "Client · Fashion",         glyph: "S", to: "/work/stealandstyle" },
  { label: "Nova Noir",              sub: "Client · Fashion",         glyph: "N", to: "/work/novanoir" },
  { label: "Masinloc Tourism",       sub: "Client · Creative Strategy", glyph: "M", to: "/work/masinloc-tourism" },
  { label: "Fast Snaking Services",  sub: "Client · Local Service",   glyph: "F", to: "/work/fast-snaking" },
  { label: "The Snappy Nomad",       sub: "Client · Personal Brand",  glyph: "S", to: "/work/snappy-nomad" },
];

const ACTIONS: SpotItem[] = [
  { label: "Email me",     sub: "seanthetechyyy@gmail.com", glyph: "✉", href: "mailto:seanthetechyyy@gmail.com", keywords: "contact hire" },
  { label: "Download CV",  sub: "PDF",                      glyph: "↓", href: "/ALARCON_SA_CV_MVA.pdf", keywords: "resume" },
  { label: "Instagram",    sub: "@shanzster.zip",           glyph: "◎", href: "https://instagram.com/shanzster.zip", keywords: "social follow" },
];

export function Spotlight() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // ⌘K / Ctrl+K to toggle, Esc to close, plus a window event for menu-bar triggers
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-spotlight", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-spotlight", onOpen);
    };
  }, []);

  const run = (item: SpotItem) => {
    setOpen(false);
    if (item.href) {
      if (item.href.startsWith("mailto:")) window.location.href = item.href;
      else window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (item.hash) {
      if (window.location.pathname === "/") {
        document.getElementById(item.hash)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate({ to: "/" });
        const id = item.hash;
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 400);
      }
      return;
    }
    if (item.to) navigate({ to: item.to });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center"
      style={{ background: "oklch(0.1 0.01 240 / 0.3)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
      onClick={() => setOpen(false)}
    >
      <div
        className="mt-[14vh] w-[580px] max-w-[calc(100vw-32px)] rounded-[16px] border border-border overflow-hidden mac-shadow"
        style={{
          background: "oklch(0.98 0.003 240 / 0.94)",
          backdropFilter: "blur(28px) saturate(1.6)",
          WebkitBackdropFilter: "blur(28px) saturate(1.6)",
          animation: "modal-in 0.25s cubic-bezier(.2,.8,.2,1) both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Spotlight search" loop>
          {/* Input row */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/35 shrink-0" aria-hidden>
              <circle cx="7" cy="7" r="5" />
              <path d="M11 11l3.5 3.5" />
            </svg>
            <Command.Input
              autoFocus
              placeholder="Spotlight Search"
              className="w-full bg-transparent text-[16px] tracking-tight text-foreground outline-none placeholder:text-foreground/30"
            />
            <span className="shrink-0 rounded-[5px] border border-border bg-secondary/60 px-1.5 py-0.5 text-[10px] tracking-tight text-foreground/40">esc</span>
          </div>

          <Command.List className="max-h-[340px] overflow-y-auto p-2">
            <Command.Empty>
              <div className="px-4 py-8 text-center text-[13px] tracking-tight text-foreground/40">
                No results — try "work", "clients", or "contact"
              </div>
            </Command.Empty>

            {[
              { heading: "Sections", items: SECTIONS },
              { heading: "Pages", items: PAGES },
              { heading: "Clients", items: CLIENTS },
              { heading: "Quick Actions", items: ACTIONS },
            ].map(({ heading, items }) => (
              <Command.Group key={heading} heading={heading}>
                {items.map((item) => (
                  <Command.Item
                    key={`${heading}-${item.label}`}
                    value={`${item.label} ${item.sub} ${item.keywords ?? ""}`}
                    onSelect={() => run(item)}
                    className="spot-item"
                  >
                    <span className="spot-glyph">{item.glyph}</span>
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    <span className="spot-sub shrink-0">{item.sub}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border px-4 py-2">
            <span className="text-[10px] tracking-tight text-foreground/30">↑↓ navigate · ↵ open · esc close</span>
            <span className="text-[10px] tracking-tight text-foreground/30">Shanzster Spotlight</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
