import { useEffect, useState } from "react";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);
  return now;
}

const MENU_LINKS = [
  { label: "Work",     href: "/#work"     },
  { label: "Services", href: "/#services" },
  // { label: "Clients",  href: "/clients"   },
  { label: "About",    href: "/about"     },
  { label: "Contact",  href: "/#contact"  },
];

export function MenuBar() {
  const now = useClock();
  const time = now
    ? now.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className="sticky top-0 z-50 w-full border-b border-border/70"
      style={{
        background: "oklch(0.97 0.005 240 / 0.72)",
        backdropFilter: "blur(20px) saturate(1.6)",
        WebkitBackdropFilter: "blur(20px) saturate(1.6)",
      }}
    >
      <div className="mx-auto flex h-7 max-w-[1400px] items-center justify-between px-4 text-[12px] tracking-tight">
        {/* Left — identity + menus */}
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-1.5 font-semibold text-foreground hover:opacity-80 transition" aria-label="Shanzster — home">
            <span aria-hidden style={{ color: "oklch(0.55 0.20 265)" }}>✦</span>
            Shanzster
          </a>
          {MENU_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="hidden sm:inline rounded-[4px] px-1.5 py-0.5 text-foreground/70 hover:text-foreground hover:bg-foreground/6 transition"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Right — status + system glyphs + clock */}
        <div className="flex items-center gap-3 text-foreground/70">
          <a
            href="/#contact"
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-2 py-0.5 text-[10px] tracking-tight text-foreground/65 hover:text-foreground hover:bg-card transition"
          >
            <span className="pulse-dot h-1.5 w-1.5 rounded-full" style={{ background: "var(--traffic-green)" }} />
            Available for work
          </a>
          <BatteryIcon />
          <WifiIcon />
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-spotlight"))}
            className="flex items-center gap-1.5 rounded-[5px] px-1.5 py-0.5 hover:bg-foreground/6 transition"
            aria-label="Open Spotlight search"
          >
            <SpotlightIcon />
            <span className="hidden sm:inline text-[10px] tracking-tight text-foreground/40">⌘K</span>
          </button>
          <span className="tabular-nums text-foreground/75" suppressHydrationWarning>{time || "—"}</span>
        </div>
      </div>
    </div>
  );
}

function WifiIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 16 12" fill="currentColor" aria-hidden>
      <path d="M8 11l1.5-1.5a2.1 2.1 0 00-3 0L8 11zm-3-3l1.2 1.2a3.8 3.8 0 015.6 0L13 8a5.6 5.6 0 00-8 0zm-3-3l1.2 1.2a8 8 0 0111.6 0L16 5A9.8 9.8 0 002 5z"/>
    </svg>
  );
}
function BatteryIcon() {
  return (
    <svg width="22" height="10" viewBox="0 0 26 12" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
      <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" />
      <rect x="2" y="2" width="14" height="8" rx="1" fill="currentColor" />
      <rect x="22.5" y="4" width="2" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}
function SpotlightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="7" cy="7" r="5" />
      <path d="M11 11l3.5 3.5" />
    </svg>
  );
}
