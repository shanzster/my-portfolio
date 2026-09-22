import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { type Media as Graphic } from "@/lib/media-data";
import { useGraphics, useChrome } from "@/lib/content";
import { EditableText, EditableImage, useEdit } from "@/lib/edit-mode";

export const Route = createFileRoute("/graphics")({
  component: GraphicsPage,
  head: () => ({
    meta: [
      { title: "Graphics — Shanzster" },
      { name: "description", content: "Brand posts, story templates, promo graphics and more." },
    ],
  }),
});


/* ─── GRAPHIC CARD ─── */
function GraphicCard({ graphic, onClick }: { graphic: Graphic; onClick: () => void }) {
  const { editing } = useEdit();
  const { data: chrome } = useChrome();
  return (
    <button
      onClick={() => { if (!editing) onClick(); }}
      className="group relative w-full text-left cursor-pointer"
    >
      {/* Graphic Preview */}
      <div
        className="relative w-full rounded-lg overflow-hidden border border-border/20 transition-all duration-300 hover:border-border/40 hover:shadow-lg hover:scale-[1.02]"
        style={{ aspectRatio: "1 / 1", background: graphic.bg }}
      >
        <EditableImage collection="graphics" id={graphic.id} item={graphic} path={["src"]} src={graphic.src ?? ""} alt={graphic.title} wrapperClassName="absolute inset-0" className="w-full h-full object-contain" />
        {!graphic.src && !editing && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-white/10 text-[32px]">✦</span>
            <p className="text-white/12 text-[10px] tracking-[0.14em] uppercase">
              {chrome.graphics.addLabel}
            </p>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <EditableText collection="graphics" id={graphic.id} item={graphic} path={["category"]} value={graphic.category} className="inline-block px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm text-[9px] uppercase tracking-[0.2em] text-foreground/60 border border-border/30" />
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/10 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm border border-border text-[11px] tracking-tight text-foreground">
              {chrome.graphics.viewFullSize}
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3">
        <EditableText collection="graphics" id={graphic.id} item={graphic} path={["title"]} value={graphic.title} as="h3" className="text-[13px] font-semibold tracking-tight text-foreground leading-snug group-hover:text-foreground/70 transition-colors" />
        <EditableText collection="graphics" id={graphic.id} item={graphic} path={["client"]} value={graphic.client} as="p" className="text-[11px] tracking-tight text-foreground/50 mt-1" />
      </div>
    </button>
  );
}

/* ─── FULL VIEW MODAL ─── */
function FullViewModal({ 
  graphic, 
  onClose, 
  onNext, 
  onPrev,
  currentIndex,
  total
}: { 
  graphic: Graphic; 
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
        className="relative max-w-5xl max-h-[85vh] w-full mx-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Graphic Display */}
        <div 
          className="relative w-full rounded-xl overflow-hidden border border-border shadow-2xl"
          style={{ aspectRatio: "1 / 1", background: graphic.bg }}
        >
          {graphic.src ? (
            <img 
              src={graphic.src} 
              alt={graphic.title} 
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <span className="text-white/10 text-[48px]">✦</span>
              <p className="text-white/12 text-[12px] tracking-[0.14em] uppercase">
                Add Graphic
              </p>
            </div>
          )}
        </div>

        {/* Info Bar */}
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-2.5 py-1 rounded-full bg-card border border-border text-[9px] uppercase tracking-[0.2em] text-foreground/60">
                {graphic.category}
              </span>
              <span className="text-[10px] text-foreground/30">
                {currentIndex + 1} / {total}
              </span>
            </div>
            <h2 className="text-[18px] font-semibold tracking-tight text-foreground leading-snug">
              {graphic.title}
            </h2>
            <p className="text-[13px] tracking-tight text-foreground/50 mt-1">
              {graphic.client}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── PAGE ─── */
function GraphicsPage() {
  const { items: GRAPHICS } = useGraphics();
  const { data: chrome } = useChrome();
  const c = chrome.graphics;
  const [selectedGraphic, setSelectedGraphic] = useState<Graphic | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const openGraphic = (graphic: Graphic, index: number) => {
    setSelectedGraphic(graphic);
    setSelectedIndex(index);
  };

  const closeGraphic = () => {
    setSelectedGraphic(null);
  };

  const goToNext = () => {
    if (selectedIndex < GRAPHICS.length - 1) {
      const nextIndex = selectedIndex + 1;
      setSelectedIndex(nextIndex);
      setSelectedGraphic(GRAPHICS[nextIndex]);
    }
  };

  const goToPrev = () => {
    if (selectedIndex > 0) {
      const prevIndex = selectedIndex - 1;
      setSelectedIndex(prevIndex);
      setSelectedGraphic(GRAPHICS[prevIndex]);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedGraphic) return;
    
    if (e.key === "Escape") closeGraphic();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "ArrowLeft") goToPrev();
  };

  // Add keyboard listener
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeyDown);
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <NavBar />
      <main className="mx-auto max-w-[1200px] px-6 pt-10 sm:px-10">
        <Link 
          to="/gallery" 
          className="inline-flex items-center gap-2 text-[12px] tracking-tight text-foreground/40 hover:text-foreground transition mb-10"
        >
          <EditableText page="chrome" path={["graphics", "back"]} value={c.back} />
        </Link>

        {/* Header */}
        <div className="mb-12">
          <EditableText page="chrome" path={["graphics", "kicker"]} value={c.kicker} as="p" className="text-[10px] uppercase tracking-[0.26em] text-foreground/35 mb-3" />
          <EditableText
            page="chrome"
            path={["graphics", "title"]}
            value={c.title}
            as="h1"
            className="font-bold tracking-tightest text-foreground leading-[0.88] block"
            style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
          />
          <p className="mt-3 text-[13px] tracking-tight text-foreground/40 max-w-md">
            <EditableText page="chrome" path={["graphics", "blurb"]} value={c.blurb} /> — {GRAPHICS.length}{" "}
            <EditableText page="chrome" path={["graphics", "countSuffix"]} value={c.countSuffix} />
          </p>
        </div>

        {/* Graphics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {GRAPHICS.map((graphic, index) => (
            <GraphicCard 
              key={graphic.id} 
              graphic={graphic} 
              onClick={() => openGraphic(graphic, index)}
            />
          ))}
        </div>
      </main>

      {/* Full View Modal */}
      {selectedGraphic && (
        <FullViewModal
          graphic={selectedGraphic}
          onClose={closeGraphic}
          onNext={goToNext}
          onPrev={goToPrev}
          currentIndex={selectedIndex}
          total={GRAPHICS.length}
        />
      )}
    </div>
  );
}
