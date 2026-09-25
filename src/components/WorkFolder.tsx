import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "@tanstack/react-router";
import { type WorkItem } from "@/lib/work-data";
import { useIsClient } from "@/hooks/useIsClient";
import { TrafficLights } from "@/components/TrafficLights";
import { useHome } from "@/lib/content";
import { EditableText } from "@/lib/edit-mode";

/* Pre-launch projects: card shows in the folder but opens the Coming Soon
   modal instead of the empty case study. Remove the id once it has content. */
const LOCKED_IDS: string[] = ["snappy-nomad"];

/* ─── Coming Soon Modal ─── */
function ComingSoonModal({ title, onClose }: { title: string; onClose: () => void }) {
  const { data: home } = useHome();
  const wf = home.workFolder;
  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      style={{ background: "oklch(0.1 0.01 240 / 0.65)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <div
        className="w-full overflow-hidden rounded-[20px] border border-border bg-card shadow-[0_32px_80px_-16px_oklch(0.2_0.02_240/0.5)]"
        style={{ maxWidth: 380 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="flex h-10 items-center justify-between border-b border-border bg-secondary/60 px-4" style={{ borderRadius: "20px 20px 0 0" }}>
          <TrafficLights onClose={onClose} />
          <span className="text-[11px] tracking-tight text-foreground/45">{title}</span>
          <button onClick={onClose} className="text-[11px] tracking-tight text-foreground/35 hover:text-foreground transition">✕ close</button>
        </div>

        {/* Body */}
        <div className="px-8 py-8 text-center">
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[18px]"
            style={{ background: "oklch(0.62 0.16 255 / 0.12)", border: "1px solid oklch(0.62 0.16 255 / 0.25)" }}
          >
            <span className="text-[30px]">🏗️</span>
          </div>
          <EditableText page="home" path={["workFolder", "comingSoonKicker"]} value={wf.comingSoonKicker} as="p" className="text-[10px] uppercase tracking-[0.22em] text-foreground/35 mb-2" />
          <EditableText page="home" path={["workFolder", "comingSoonTitle"]} value={wf.comingSoonTitle} as="h3" className="text-[20px] font-bold tracking-tightest text-foreground leading-tight mb-3" />
          <p className="text-[13px] leading-relaxed tracking-tight text-foreground/55 mb-6">
            <EditableText page="home" path={["workFolder", "comingSoonBody"]} value={wf.comingSoonBody} />{" "}
            <a
              href="https://instagram.com/shanzster.zip"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground/80 underline underline-offset-2 hover:text-foreground transition"
            >
              <EditableText page="home" path={["workFolder", "comingSoonHandle"]} value={wf.comingSoonHandle} />
            </a>{" "}
            <EditableText page="home" path={["workFolder", "comingSoonBodyEnd"]} value={wf.comingSoonBodyEnd} />
          </p>
          <div className="flex flex-col gap-2.5">
            <a
              href="https://instagram.com/shanzster.zip"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-[12px] tracking-tight text-background transition hover:opacity-85"
            >
              <EditableText page="home" path={["workFolder", "comingSoonFollow"]} value={wf.comingSoonFollow} />
            </a>
            <button
              onClick={onClose}
              className="rounded-full border border-border px-6 py-2.5 text-[12px] tracking-tight text-foreground/50 transition hover:bg-secondary"
            >
              <EditableText page="home" path={["workFolder", "comingSoonGotIt"]} value={wf.comingSoonGotIt} />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Cards flank the folder in two columns, assigned alternately (1st left,
// 2nd right, 3rd left, …) so any number of projects stays balanced. Each
// column spreads its cards evenly between y −240 and 240.
type FanPos = { x: number; y: number; rot: number; side: "left" | "right" };

function fanPositions(count: number): FanPos[] {
  const leftRows = Math.ceil(count / 2);
  const rightRows = Math.floor(count / 2);
  const rowY = (row: number, rows: number) => (rows <= 1 ? 0 : -240 + (480 * row) / (rows - 1));
  const rots = [5, 3, 6, 4, 2];
  return Array.from({ length: count }, (_, i) => {
    const side: "left" | "right" = i % 2 === 0 ? "left" : "right";
    const row = Math.floor(i / 2);
    const rows = side === "left" ? leftRows : rightRows;
    const rot = rots[row % rots.length] * (side === "left" ? -1 : 1);
    return { x: side === "left" ? -380 : 380, y: rowY(row, rows), rot, side };
  });
}

/* ─── Paper card ─── */
function WorkPaper({
  item,
  index,
  open,
  hoveredIndex,
  onHover,
  onLeave,
  onSelect,
  onCancelClose,
  onScheduleClose,
  isMobile,
  openBadge,
  pos,
}: {
  item: WorkItem;
  index: number;
  open: boolean;
  hoveredIndex: number | null;
  onHover: (i: number) => void;
  onLeave: () => void;
  onSelect: (item: WorkItem) => void;
  onCancelClose: () => void;
  onScheduleClose: () => void;
  isMobile: boolean;
  openBadge: string;
  pos: FanPos;
}) {
  const navigate = useNavigate();
  const isHovered = hoveredIndex === index;

  const scaleX = isMobile ? 0.3 : 1;
  const scaleY = isMobile ? 0.3 : 1;

  const cardWidth = isMobile ? 110 : 200;
  const cardHeight = isMobile ? 148 : 260;
  const halfW = cardWidth / 2;
  const halfH = cardHeight / 2;

  return (
    <div
      className="absolute cursor-pointer select-none"
      style={{
        top: "50%",
        left: "50%",
        width: cardWidth,
        height: cardHeight,
        marginTop: -halfH,
        marginLeft: -halfW,
        transform: open
          ? `translate(${pos.x * scaleX}px, ${pos.y * scaleY + (isHovered ? -14 : 0)}px) rotate(${isHovered ? 0 : pos.rot}deg) scale(${isHovered ? 1.05 : 1})`
          : `translate(0px, 30px) rotate(0deg) scale(${isMobile ? 0.72 : 0.8})`,
        opacity: open ? 1 : 0,
        transition: `transform 0.65s cubic-bezier(.2,.8,.2,1) ${index * 60}ms, opacity 0.4s ease ${index * 60}ms`,
        zIndex: isHovered ? 40 : 20 + index,
        pointerEvents: open ? "auto" : "none",
      }}
      onMouseEnter={() => { if (!open || isMobile) return; onCancelClose(); onHover(index); }}
      onMouseLeave={() => { if (!open || isMobile) return; onLeave(); onScheduleClose(); }}
      onClick={() => {
        if (!open) return;
        onSelect(item);
        if (!isMobile && !LOCKED_IDS.includes(item.id)) {
          navigate({ to: "/work/$id", params: { id: item.id } });
        }
      }}
    >
      <div
        className="w-full h-full rounded-[14px] border overflow-hidden transition-all duration-300"
        style={{
          borderColor: isHovered
            ? "oklch(0.74 0.13 240 / 0.55)"
            : "oklch(0.88 0.005 240)",
          boxShadow: isHovered
            ? "0 28px 60px -10px oklch(0.2 0.02 240 / 0.35), 0 0 0 1.5px oklch(0.74 0.13 240 / 0.2)"
            : "0 8px 28px -6px oklch(0.2 0.02 240 / 0.22)",
        }}
      >
        {/* Visual */}
        <div
          className="w-full relative flex items-center justify-center"
          style={{ height: isMobile ? 96 : 165, background: item.color }}
        >
          {item.logo
            ? <img src={item.logo} alt={item.client} className="w-full h-full object-cover" />
            : <span className="text-white/10 text-[40px]">✦</span>
          }
          {isHovered && (
            <div className="absolute top-2.5 right-2.5 rounded-full bg-black/25 px-2 py-0.5">
              <p className="text-[9px] tracking-tight text-white/80 font-medium">{openBadge}</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-paper px-3 py-2.5 border-t border-border/40">
          <p className="text-[8px] uppercase tracking-[0.14em] text-foreground/35">{item.tag}</p>
          <p className="mt-0.5 text-[12px] font-semibold tracking-tight text-foreground/85 leading-snug">
            {item.title}
          </p>
          <p className="mt-1 text-[9.5px] tracking-tight text-foreground/45 leading-snug line-clamp-2">
            {item.overview.slice(0, 72)}…
          </p>
        </div>
      </div>
    </div>
  );
}

function MobileWorkPreviewModal({
  item,
  onClose,
  onCheckout,
}: {
  item: WorkItem;
  onClose: () => void;
  onCheckout: () => void;
}) {
  const { data: home } = useHome();
  const wf = home.workFolder;
  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 p-3"
      onClick={onClose}
      style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
    >
      <div
        className="w-full overflow-hidden rounded-[16px] border border-border bg-card shadow-[0_30px_80px_-20px_oklch(0.2_0.02_240/0.5)]"
        style={{ maxWidth: 340, boxSizing: "border-box" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-9 items-center justify-between border-b border-border bg-secondary/60 px-3">
          <div className="flex items-center gap-1.5">
            <TrafficLights size={11} />
          </div>
          <button onClick={onClose} className="text-[11px] tracking-tight text-foreground/50 hover:text-foreground transition">
            Close
          </button>
        </div>

        <div className="p-3">
          <div className="overflow-hidden rounded-[14px] border border-border/40 relative" style={{ background: item.color }}>
            <div className="flex aspect-[4/5] flex-col justify-end p-4 relative z-10">
              {item.logo && (
                <img src={item.logo} alt={item.client} className="absolute inset-0 w-full h-full object-cover opacity-40 -z-10" />
              )}
              <EditableText page="home" path={["workFolder", "selectedWorkKicker"]} value={wf.selectedWorkKicker} as="p" className="text-[9px] uppercase tracking-[0.18em] text-white/55" />
              <h3 className="mt-1 text-[18px] font-bold leading-tight tracking-tightest text-white">
                {item.title}
              </h3>
              <p className="mt-1 text-[11px] leading-snug text-white/78">{item.tag}</p>
              <p className="mt-2 text-[10px] leading-relaxed text-white/70 line-clamp-3">
                {item.overview}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-tight text-foreground">{item.client}</p>
              <EditableText page="home" path={["workFolder", "checkoutHint"]} value={wf.checkoutHint} as="p" className="mt-0.5 text-[10px] tracking-tight text-foreground/45" />
            </div>
            <button
              onClick={onCheckout}
              className="shrink-0 rounded-full bg-foreground px-4 py-2 text-[11px] tracking-tight text-background transition hover:opacity-85"
            >
              <EditableText page="home" path={["workFolder", "checkoutButton"]} value={wf.checkoutButton} />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ─── Big folder ─── */
function BigFolder({ open, isMobile }: { open: boolean; isMobile?: boolean }) {
  // Folder renders at full width of its container (which is clamped by the parent)
  // Height is derived from the natural aspect ratio: 480×390 ≈ 1.23:1
  const aspectRatio = isMobile ? (238 / 212) : (480 / 390);

  return (
    <div
      className="relative select-none w-full"
      style={{
        // paddingBottom maintains aspect ratio: height = width / aspectRatio
        paddingBottom: `${(1 / aspectRatio) * 100}%`,
        perspective: 1400,
      }}
    >
      {/* Inner absolutely-positioned content fills the aspect-ratio box */}
      <div className="absolute inset-0">
        {/* Shadow */}
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: "80%",
            height: 32,
            background: "oklch(0.55 0.12 240 / 0.22)",
            filter: "blur(20px)",
            opacity: open ? 0.3 : 0.65,
            transition: "opacity 0.4s",
          }}
        />
        {/* Back */}
        <div
          className="absolute inset-0 rounded-[28px]"
          style={{ background: "linear-gradient(160deg, oklch(0.70 0.14 238), oklch(0.62 0.16 244))" }}
        />
        {/* Tab */}
        <div
          className="absolute -top-7 left-6 h-10 w-[38%] rounded-t-[16px]"
          style={{ background: "linear-gradient(90deg, oklch(0.68 0.14 238), oklch(0.64 0.15 242))" }}
        />
        {/* Front flap */}
        <div
          className="absolute inset-0 rounded-[28px] origin-bottom"
          style={{
            background: "linear-gradient(160deg, oklch(0.82 0.10 230) 0%, oklch(0.72 0.13 242) 100%)",
            boxShadow:
              "inset 0 2.5px 0 oklch(1 0 0 / 0.30), inset 0 -1px 0 oklch(0.5 0.1 240 / 0.12), 0 20px 60px -14px oklch(0.3 0.1 240 / 0.5)",
            transform: open ? "rotateX(46deg)" : "rotateX(0deg)",
            transition: "transform 0.55s cubic-bezier(.2,.8,.2,1)",
          }}
        >
          <div className="absolute inset-x-10 top-6 h-px rounded-full" style={{ background: "oklch(1 0 0 / 0.24)" }} />
          <div className="absolute inset-x-16 top-9 h-px rounded-full" style={{ background: "oklch(1 0 0 / 0.12)" }} />
          {!open && (
            <p className="absolute bottom-[15%] right-[6%] text-[clamp(8px,2vw,13px)] tracking-[0.24em] uppercase text-white/35 font-medium">
              selected work
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main export ─── */
export function WorkFolderScene({ items }: { items: WorkItem[] }) {
  const { data: home } = useHome();
  const wf = home.workFolder;
  const [open, setOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isCompactDevice, setIsCompactDevice] = useState(false);
  const [activeMobileItem, setActiveMobileItem] = useState<WorkItem | null>(null);
  const [showComingSoon, setShowComingSoon] = useState<string | null>(null);
  const navigate = useNavigate();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isClient = useIsClient();

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setHoveredIndex(null);
    }, 120); // 120ms grace period — enough to move from folder to card
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const touchQuery = window.matchMedia("(pointer: coarse)");
    const updateIsMobile = () => {
      const hasTouch = navigator.maxTouchPoints > 0;
      const isKnownMobile = /Android|iPhone|iPad|iPod|Mobile|CriOS|FxiOS|OPiOS|EdgA|SamsungBrowser/i.test(navigator.userAgent);
      setIsCompactDevice(mediaQuery.matches || touchQuery.matches || hasTouch || isKnownMobile);
    };

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);
    touchQuery.addEventListener("change", updateIsMobile);
    window.addEventListener("orientationchange", updateIsMobile);

    return () => {
      mediaQuery.removeEventListener("change", updateIsMobile);
      touchQuery.removeEventListener("change", updateIsMobile);
      window.removeEventListener("orientationchange", updateIsMobile);
    };
  }, []);

  useEffect(() => {
    if (!activeMobileItem) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeMobileItem]);

  useEffect(() => {
    const resetScene = () => {
      setOpen(false);
      setHoveredIndex(null);
    };

    const handleVisibilityChange = () => {
      // Only reset when tab becomes hidden (user navigated away), not on visible
      if (document.visibilityState === "hidden") {
        resetScene();
      }
    };

    // Don't listen to focus/pageshow — these fire during SSR hydration on Vercel
    // and kill the open state before the user can interact
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelClose();
    };
  }, []);

  // Every non-hidden project gets a card, fanned alternately left/right.
  const visible = items.filter((w) => !w.hidden);
  const positions = fanPositions(visible.length);

  // Before client hydration, treat as desktop to match SSR output exactly
  const isMobile = isClient && isCompactDevice;

  return (
    <div className="flex flex-col items-center w-full">
      {showComingSoon && <ComingSoonModal title={showComingSoon} onClose={() => setShowComingSoon(null)} />}
      {activeMobileItem && isMobile && (
        <MobileWorkPreviewModal
          item={activeMobileItem}
          onClose={() => setActiveMobileItem(null)}
          onCheckout={() => navigate({ to: "/work/$id", params: { id: activeMobileItem.id } })}
        />
      )}

      <div
        className="relative flex items-center justify-center w-full"
        style={{ height: isMobile ? 320 : 780 }}
      >
        {/* Cards */}
        {visible.map((item, i) => (
          <WorkPaper
            key={item.id}
            item={item}
            index={i}
            open={open}
            hoveredIndex={hoveredIndex}
            onHover={(idx) => { cancelClose(); setHoveredIndex(idx); }}
            onLeave={() => setHoveredIndex(null)}
            onCancelClose={cancelClose}
            onScheduleClose={scheduleClose}
            onSelect={(selectedItem) => {
              if (LOCKED_IDS.includes(selectedItem.id)) {
                setShowComingSoon(selectedItem.title);
                setOpen(false);
                setHoveredIndex(null);
                return;
              }
              if (isMobile) {
                setActiveMobileItem(selectedItem);
              }
              setOpen(false);
              setHoveredIndex(null);
            }}
            isMobile={isMobile}
            openBadge={wf.openBadge}
            pos={positions[i]}
          />
        ))}

        {/* Folder — center, above cards in z */}
        <div
          className="relative z-10"
          style={{
            width: isMobile ? 238 : 480,
            maxWidth: "calc(100vw - 32px)",
          }}
          onMouseEnter={isMobile ? undefined : () => { cancelClose(); setOpen(true); }}
          onMouseLeave={isMobile ? undefined : scheduleClose}
        >
          <button
            type="button"
            className="w-full cursor-pointer"
            style={{ background: "transparent", border: 0, padding: 0 }}
            onClick={() => {
              setOpen((prev) => !prev);
              setHoveredIndex(null);
            }}
            aria-label="Toggle selected work folder"
          >
            <BigFolder open={open} isMobile={isMobile} />
          </button>
        </div>
      </div>

      {isMobile ? (
        <EditableText page="home" path={["workFolder", "hintMobile"]} value={wf.hintMobile} as="p" className="mt-2 text-[10px] uppercase tracking-[0.2em] text-foreground/25" />
      ) : (
        <EditableText page="home" path={["workFolder", "hintDesktop"]} value={wf.hintDesktop} as="p" className="mt-2 text-[10px] uppercase tracking-[0.2em] text-foreground/25" />
      )}
    </div>
  );
}
