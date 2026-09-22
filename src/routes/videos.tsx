import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { TrafficLights } from "@/components/TrafficLights";
import { type Video } from "@/lib/videos-data";
import { useVideos, useChrome } from "@/lib/content";
import { EditableText, useEdit } from "@/lib/edit-mode";

/* ─── Coming Soon Modal ─── */
function ComingSoonModal({ onClose }: { onClose: () => void }) {
  const { data: chrome } = useChrome();
  const cs = chrome.videos.comingSoon;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
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
          <EditableText page="chrome" path={["videos", "comingSoon", "windowTitle"]} value={cs.windowTitle} as="span" className="text-[11px] tracking-tight text-foreground/45" />
          <button onClick={onClose} className="text-[11px] tracking-tight text-foreground/35 hover:text-foreground transition">✕ close</button>
        </div>

        {/* Body */}
        <div className="px-8 py-8 text-center">
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[18px]"
            style={{ background: "oklch(0.28 0.04 240 / 0.12)", border: "1px solid oklch(0.28 0.04 240 / 0.25)" }}
          >
            <span className="text-[30px]">🎬</span>
          </div>
          <EditableText page="chrome" path={["videos", "comingSoon", "kicker"]} value={cs.kicker} as="p" className="text-[10px] uppercase tracking-[0.22em] text-foreground/35 mb-2" />
          <EditableText page="chrome" path={["videos", "comingSoon", "title"]} value={cs.title} as="h3" className="text-[20px] font-bold tracking-tightest text-foreground leading-tight mb-3 block" />
          <p className="text-[13px] leading-relaxed tracking-tight text-foreground/55 mb-6">
            <EditableText page="chrome" path={["videos", "comingSoon", "body"]} value={cs.body} />{" "}
            <a
              href="https://instagram.com/shanzster.zip"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground/80 underline underline-offset-2 hover:text-foreground transition"
            >
              <EditableText page="chrome" path={["videos", "comingSoon", "handle"]} value={cs.handle} />
            </a>{" "}
            <EditableText page="chrome" path={["videos", "comingSoon", "bodyEnd"]} value={cs.bodyEnd} />
          </p>
          <div className="flex flex-col gap-2.5">
            <a
              href="https://instagram.com/shanzster.zip"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-[12px] tracking-tight text-background transition hover:opacity-85"
            >
              <EditableText page="chrome" path={["videos", "comingSoon", "follow"]} value={cs.follow} />
            </a>
            <button
              onClick={onClose}
              className="rounded-full border border-border px-6 py-2.5 text-[12px] tracking-tight text-foreground/50 transition hover:bg-secondary"
            >
              <EditableText page="chrome" path={["videos", "comingSoon", "gotIt"]} value={cs.gotIt} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/videos")({
  component: VideosPage,
  head: () => ({
    meta: [
      { title: "Videos & Reels — Shanzster" },
      { name: "description", content: "Reels, vlogs, promo videos, motion captions, and collection launches." },
    ],
  }),
});


/* ─── VIDEO CARD ─── */
function VideoCard({ video, onClick }: { video: Video; onClick: () => void }) {
  const { editing } = useEdit();
  return (
    <button
      onClick={() => { if (!editing) onClick(); }}
      className="group relative w-full text-left cursor-pointer"
    >
      {/* Video Preview */}
      <div 
        className="relative w-full rounded-lg overflow-hidden border border-border/20 transition-all duration-300 hover:border-border/40 hover:shadow-lg hover:scale-[1.02]"
        style={{ aspectRatio: "9 / 16", background: video.bg }}
      >
        {video.src ? (
          <video 
            src={video.src} 
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-white/10 text-[32px]">▶</span>
            <p className="text-white/12 text-[10px] tracking-[0.14em] uppercase">
              Add Video
            </p>
          </div>
        )}
        
        {/* Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
          <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-foreground ml-1">
              <path d="M5 3L17 10L5 17V3Z" />
            </svg>
          </div>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <EditableText collection="videos" id={video.id} item={video} path={["category"]} value={video.category} className="inline-block px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm text-[9px] uppercase tracking-[0.2em] text-foreground/60 border border-border/30" />
        </div>
      </div>

      {/* Info */}
      <div className="mt-3">
        <EditableText collection="videos" id={video.id} item={video} path={["title"]} value={video.title} as="h3" className="text-[13px] font-semibold tracking-tight text-foreground leading-snug group-hover:text-foreground/70 transition-colors" />
        <EditableText collection="videos" id={video.id} item={video} path={["client"]} value={video.client} as="p" className="text-[11px] tracking-tight text-foreground/50 mt-1" />
      </div>
    </button>
  );
}

/* ─── FULL VIEW MODAL ─── */
function FullViewModal({ 
  video, 
  onClose, 
  onNext, 
  onPrev,
  currentIndex,
  total
}: { 
  video: Video; 
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  total: number;
}) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-card border border-border hover:bg-secondary transition-colors flex items-center justify-center text-foreground/60 hover:text-foreground z-10"
        aria-label="Close"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M2 2L14 14M14 2L2 14" />
        </svg>
      </button>

      {/* Navigation - Previous */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-6 w-12 h-12 rounded-full bg-card border border-border hover:bg-secondary transition-colors flex items-center justify-center text-foreground/60 hover:text-foreground z-10"
          aria-label="Previous"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4L6 10L12 16" />
          </svg>
        </button>
      )}

      {/* Navigation - Next */}
      {currentIndex < total - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-6 w-12 h-12 rounded-full bg-card border border-border hover:bg-secondary transition-colors flex items-center justify-center text-foreground/60 hover:text-foreground z-10"
          aria-label="Next"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 4L14 10L8 16" />
          </svg>
        </button>
      )}

      {/* Content */}
      <div 
        className="relative max-w-2xl max-h-[85vh] w-full mx-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Video Display */}
        <div 
          className="relative w-full rounded-xl overflow-hidden border border-border shadow-2xl"
          style={{ aspectRatio: "9 / 16", background: video.bg }}
        >
          {video.src ? (
            <video 
              src={video.src} 
              className="w-full h-full object-cover"
              controls
              autoPlay
              loop
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <span className="text-white/10 text-[48px]">▶</span>
              <p className="text-white/12 text-[12px] tracking-[0.14em] uppercase">
                Add Video
              </p>
            </div>
          )}
        </div>

        {/* Info Bar */}
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-2.5 py-1 rounded-full bg-card border border-border text-[9px] uppercase tracking-[0.2em] text-foreground/60">
                {video.category}
              </span>
              <span className="text-[10px] text-foreground/30">
                {currentIndex + 1} / {total}
              </span>
            </div>
            <h2 className="text-[18px] font-semibold tracking-tight text-foreground leading-snug">
              {video.title}
            </h2>
            <p className="text-[13px] tracking-tight text-foreground/50 mt-1">
              {video.client}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PAGE ─── */
function VideosPage() {
  const { items: VIDEOS } = useVideos();
  const { data: chrome } = useChrome();
  const c = chrome.videos;
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-32">
      <NavBar />
      
      {showComingSoon && <ComingSoonModal onClose={() => setShowComingSoon(false)} />}
      
      <main className="mx-auto max-w-[1200px] px-6 pt-10 sm:px-10">
        <Link 
          to="/gallery" 
          className="inline-flex items-center gap-2 text-[12px] tracking-tight text-foreground/40 hover:text-foreground transition mb-10"
        >
          <EditableText page="chrome" path={["videos", "back"]} value={c.back} />
        </Link>

        {/* Header */}
        <div className="mb-12">
          <EditableText page="chrome" path={["videos", "kicker"]} value={c.kicker} as="p" className="text-[10px] uppercase tracking-[0.26em] text-foreground/35 mb-3" />
          <EditableText
            page="chrome"
            path={["videos", "title"]}
            value={c.title}
            as="h1"
            className="font-bold tracking-tightest text-foreground leading-[0.88] block"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          />
          <EditableText page="chrome" path={["videos", "blurb"]} value={c.blurb} as="p" className="mt-3 text-[13px] tracking-tight text-foreground/40 max-w-md" />
        </div>

        {/* Locked Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {VIDEOS.map((video) => (
            <button 
              key={video.id}
              onClick={() => setShowComingSoon(true)}
              className="group relative w-full text-left cursor-pointer opacity-50"
            >
              {/* Video Preview */}
              <div 
                className="relative w-full rounded-lg overflow-hidden border border-border/20"
                style={{ aspectRatio: "9 / 16", background: video.bg }}
              >
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <span className="text-white/10 text-[32px]">▶</span>
                  <p className="text-white/12 text-[10px] tracking-[0.14em] uppercase">
                    {c.lockedTile}
                  </p>
                </div>
                
                {/* Lock overlay */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-1"
                  style={{ background: "oklch(0.1 0.01 240 / 0.6)", backdropFilter: "blur(3px)" }}
                >
                  <span className="text-[22px]">🎬</span>
                  <p className="text-[8px] uppercase tracking-[0.16em] text-white/60">{c.lockedBadge}</p>
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                  <EditableText collection="videos" id={video.id} item={video} path={["category"]} value={video.category} as="span" className="inline-block px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm text-[9px] uppercase tracking-[0.2em] text-foreground/60 border border-border/30" />
                </div>
              </div>

              {/* Info */}
              <div className="mt-3">
                <EditableText collection="videos" id={video.id} item={video} path={["title"]} value={video.title} as="h3" className="text-[13px] font-medium tracking-tight text-foreground leading-snug" />
                <EditableText collection="videos" id={video.id} item={video} path={["client"]} value={video.client} as="p" className="text-[11px] tracking-tight text-foreground/50 mt-1" />
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
