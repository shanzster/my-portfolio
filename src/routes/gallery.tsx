import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Reveal } from "@/hooks/useScrollReveal";
import { type Folder, type MediaItem } from "@/lib/gallery-data";
import { useGallery, useChrome } from "@/lib/content";
import { EditableText, EditableImage } from "@/lib/edit-mode";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({
    meta: [
      { title: "Gallery — Shanzster" },
      { name: "description", content: "All creative work — graphics, videos, content calendars, and campaign ads." },
    ],
  }),
});




/* ─── FOLDER SVG — exact hero folder style ─── */

function FolderIcon({ color, tabColor, size = 72 }: { color: string; tabColor: string; size?: number }) {
  const h = Math.round(size * 0.8125);
  const tabH = Math.round(size * 0.09);
  const tabW = Math.round(size * 0.42);
  return (
    <div className="relative" style={{ width: size, height: h + tabH, paddingTop: tabH }}>
      {/* Tab */}
      <div className="absolute rounded-t-[6px]" style={{ top: 0, left: Math.round(size * 0.013), width: tabW, height: tabH, background: `linear-gradient(90deg, ${tabColor}, ${color})` }} />
      {/* Back */}
      <div className="absolute rounded-[10px]" style={{ top: tabH, left: 0, right: 0, bottom: 0, background: `linear-gradient(160deg, ${color}, ${tabColor})` }} />
      {/* Flap */}
      <div className="absolute rounded-[10px]" style={{
        top: tabH, left: 0, right: 0, bottom: 0,
        background: "linear-gradient(160deg, oklch(0.78 0.12 232) 0%, oklch(0.68 0.15 242) 100%)",
        boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.25)",
      }} />
      {/* Shine */}
      <div className="absolute rounded-full" style={{ top: tabH + Math.round(h * 0.18), left: "10%", right: "10%", height: 1, background: "oklch(1 0 0 / 0.20)" }} />
    </div>
  );
}

/* ─── FOLDER CARD (2×2 grid) ─── */

function FolderCard({ folder, onClick, index }: { folder: Folder; onClick: () => void; index: number }) {
  const { data: chrome } = useChrome();
  const [hovered, setHovered] = useState(false);

  // Up to 3 previews peeking out of the folder — real files first
  const previews = [...(folder.items ?? [])].sort((a, b) => (b.src ? 1 : 0) - (a.src ? 1 : 0)).slice(0, 3);

  // Tucked inside the folder → fanned out on hover
  const tucked = "translate(-50%, 14px) rotate(0deg) scale(0.85)";
  const fanned = [
    "translate(-108%, -30px) rotate(-11deg)",
    "translate(-50%, -44px) rotate(0deg)",
    "translate(8%, -30px) rotate(11deg)",
  ];

  return (
    <button
      className="group relative flex flex-col items-center gap-3 focus:outline-none p-6 pt-12 rounded-[20px] border border-border bg-card transition-all duration-300 hover:shadow-[0_12px_40px_-10px_oklch(0.2_0.02_240/0.18)] hover:-translate-y-1 overflow-hidden"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Open ${folder.label}`}
      style={{ animation: `fade-up-in 0.5s cubic-bezier(.2,.8,.2,1) ${index * 80}ms both` }}
    >
      {/* Folder + peeking previews */}
      <div className="relative">
        {previews.map((it, i) => (
          <div
            key={it.id}
            className="absolute left-1/2 top-0 rounded-[6px] overflow-hidden border border-border/60 pointer-events-none"
            style={{
              width: 46,
              height: 58,
              background: it.bg,
              boxShadow: "0 4px 12px -4px oklch(0.2 0.02 240 / 0.3)",
              transform: hovered ? fanned[i] : tucked,
              opacity: hovered ? 1 : i === 1 ? 0.9 : 0,
              transition: `transform 0.4s cubic-bezier(.2,.8,.2,1) ${i * 40}ms, opacity 0.3s ease ${i * 40}ms`,
              zIndex: 0,
            }}
          >
            {it.src ? (
              <img src={it.src} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white/30 text-[13px]">{it.type === "video" ? "▶" : "✦"}</span>
              </div>
            )}
          </div>
        ))}
        <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5">
          <FolderIcon color={folder.color} tabColor={folder.tabColor} size={80} />
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <EditableText collection="gallery" id={folder.id} item={folder} path={["label"]} value={folder.label} as="p" className="text-[14px] font-semibold tracking-tight text-foreground" />
        <EditableText collection="gallery" id={folder.id} item={folder} path={["description"]} value={folder.description} as="p" className="mt-1 text-[11px] tracking-tight text-foreground/40 leading-snug max-w-[160px]" />
      </div>

      {/* Count badge */}
      <div
        className="rounded-full px-3 py-1 text-[10px] tracking-tight transition-colors duration-200"
        style={{
          background: hovered ? folder.color : "var(--secondary)",
          color: hovered ? "white" : "oklch(0.18 0.01 240 / 0.45)",
        }}
      >
        {(folder.items ?? []).length} <EditableText page="chrome" path={["galleryPage", "openSuffix"]} value={chrome.galleryPage.openSuffix} />
      </div>
    </button>
  );
}

/* ─── MEDIA CARD (inside open folder) ─── */

const ASPECT_CLASSES: Record<MediaItem["aspect"], string> = {
  square:    "aspect-square",
  portrait:  "aspect-[4/5]",
  landscape: "aspect-[16/9]",
};

function MediaCard({ item, onClick, binding }: { item: MediaItem; onClick: () => void; binding?: { folder: Folder; idx: number } }) {
  return (
    <button className="group relative focus:outline-none text-left" onClick={onClick} aria-label={`View ${item.title}`}>
      <div
        className={`relative w-full rounded-[10px] overflow-hidden border border-border/40 ${ASPECT_CLASSES[item.aspect]} transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_10px_30px_-8px_oklch(0.2_0.02_240/0.22)]`}
        style={{ background: item.bg }}
      >
        {item.src && item.type === "image" && (binding ? (
          <EditableImage collection="gallery" id={binding.folder.id} item={binding.folder} path={["items", binding.idx, "src"]} src={item.src} alt={item.title} wrapperClassName="absolute inset-0" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <img src={item.src} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
        ))}
        {!item.src && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white/10 text-[24px]">{item.type === "video" ? "▶" : "✦"}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/18 transition-colors duration-300 flex items-end p-2.5">
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 text-white text-[9px] tracking-[0.16em] uppercase font-medium">View →</span>
        </div>
        {item.type === "video" && (
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/40 px-1.5 py-0.5">
            <span className="text-white text-[8px]">▶</span>
          </div>
        )}
      </div>
      {binding ? (
        <>
          <EditableText collection="gallery" id={binding.folder.id} item={binding.folder} path={["items", binding.idx, "title"]} value={item.title} as="p" className="mt-1.5 text-[10px] font-medium tracking-tight text-foreground/60 leading-snug" />
          <EditableText collection="gallery" id={binding.folder.id} item={binding.folder} path={["items", binding.idx, "client"]} value={item.client} as="p" className="text-[9px] tracking-tight text-foreground/30 mt-0.5" />
        </>
      ) : (
        <>
          <p className="mt-1.5 text-[10px] font-medium tracking-tight text-foreground/60 leading-snug">{item.title}</p>
          <p className="text-[9px] tracking-tight text-foreground/30 mt-0.5">{item.client}</p>
        </>
      )}
    </button>
  );
}

/* ─── LIGHTBOX ─── */

function Lightbox({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-6"
      style={{ background: "oklch(0.04 0.01 240 / 0.96)", backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)", animation: "lb-bg-in 0.2s ease both" }}
      onClick={onClose}
    >
      <div className="relative max-w-2xl w-full" style={{ animation: "modal-in 0.35s cubic-bezier(.2,.8,.2,1) both" }} onClick={(e) => e.stopPropagation()}>
        <div
          className={`relative w-full rounded-[16px] overflow-hidden border border-white/10 ${ASPECT_CLASSES[item.aspect]}`}
          style={{ background: item.bg, boxShadow: "0 32px 80px -16px oklch(0.04 0.01 240 / 0.8)" }}
        >
          {item.src && item.type === "image" && <img src={item.src} alt={item.title} className="w-full h-full object-cover" />}
          {item.src && item.type === "video" && <video src={item.src} controls className="w-full h-full" />}
          {!item.src && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <span className="text-white/10 text-[48px]">{item.type === "video" ? "▶" : "✦"}</span>
              <p className="text-white/15 text-[11px] tracking-[0.2em] uppercase">add media</p>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-white font-semibold tracking-tight text-[15px]">{item.title}</p>
            <p className="text-white/40 text-[12px] tracking-tight mt-0.5">{item.client}</p>
          </div>
          <button onClick={onClose} className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 border border-white/15 text-white/50 hover:bg-white/20 hover:text-white transition-all text-[13px]" aria-label="Close">✕</button>
        </div>
      </div>
    </div>
  );
}

/* ─── OPEN FOLDER VIEW ─── */

function FolderView({ folder, onClose, onItemClick }: { folder: Folder; onClose: () => void; onItemClick: (i: MediaItem) => void }) {
  const { data: chrome } = useChrome();
  const c = chrome.galleryPage;
  return (
    <div style={{ animation: "modal-in 0.3s cubic-bezier(.2,.8,.2,1) both" }}>
      {/* Folder header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FolderIcon color={folder.color} tabColor={folder.tabColor} size={36} />
          <div>
            <EditableText collection="gallery" id={folder.id} item={folder} path={["label"]} value={folder.label} as="h2" className="text-[18px] font-bold tracking-tightest text-foreground block" />
            <p className="text-[11px] tracking-tight text-foreground/40">{(folder.items ?? []).length} <EditableText page="chrome" path={["galleryPage", "itemsLabel"]} value={c.itemsLabel} /></p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-4 py-1.5 text-[11px] tracking-tight text-foreground/50 hover:text-foreground transition"
        >
          <EditableText page="chrome" path={["galleryPage", "allFoldersButton"]} value={c.allFoldersButton} />
        </button>
      </div>

      {/* Grid */}
      <div style={{ columns: "3 160px", columnGap: "1rem" }}>
        {(folder.items ?? []).map((item, idx) => (
          <div key={item.id} className="mb-4 break-inside-avoid">
            <MediaCard item={item} binding={{ folder, idx }} onClick={() => onItemClick(item)} />
          </div>
        ))}
      </div>

      {/* Add media note */}
      <div className="mt-10 rounded-[12px] border border-border bg-secondary/40 px-5 py-4 flex items-start gap-3">
        <span className="text-foreground/25 text-[16px] mt-0.5">📁</span>
        <EditableText page="chrome" path={["galleryPage", "addNote"]} value={c.addNote} as="p" className="text-[11px] tracking-tight text-foreground/40 leading-relaxed" />
      </div>
    </div>
  );
}

/* ─── PAGE ─── */

function GalleryPage() {
  const { items: FOLDERS } = useGallery();
  const { data: chrome } = useChrome();
  const c = chrome.galleryPage;
  const RECENTS = FOLDERS.flatMap((f) => (f.items ?? []).map((item, idx) => ({ item, folder: f, idx })).filter((r) => r.item.src));
  const [openFolder, setOpenFolder] = useState<Folder | null>(null);
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);
  const navigate = useNavigate();

  function handleFolderClick(folder: Folder) {
    if (folder.id === "socials") {
      navigate({ to: "/socials" });
    } else if (folder.id === "graphics") {
      navigate({ to: "/graphics" });
    } else if (folder.id === "videos") {
      navigate({ to: "/videos" });
    } else if (folder.id === "ads") {
      navigate({ to: "/ads" });
    } else {
      setOpenFolder(folder);
    }
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <NavBar />
      {lightbox && <Lightbox item={lightbox} onClose={() => setLightbox(null)} />}

      <main className="mx-auto max-w-[1100px] px-6 pt-10 sm:px-10">

        <Link to="/" className="inline-flex items-center gap-2 text-[12px] tracking-tight text-foreground/40 hover:text-foreground transition mb-10">
          <EditableText page="chrome" path={["galleryPage", "back"]} value={c.back} />
        </Link>

        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <EditableText page="chrome" path={["galleryPage", "kicker"]} value={c.kicker} as="p" className="text-[10px] uppercase tracking-[0.26em] text-foreground/35 mb-3" />
            <h1 className="font-bold tracking-tightest text-foreground leading-[0.88]" style={{ fontSize: "clamp(44px, 6vw, 80px)" }}>
              <EditableText page="chrome" path={["galleryPage", "titleTop"]} value={c.titleTop} as="span" className="block" />
              <EditableText page="chrome" path={["galleryPage", "titleAccent"]} value={c.titleAccent} as="span" className="block" style={{ color: "oklch(0.18 0.01 240 / 0.22)" }} />
            </h1>
            <EditableText page="chrome" path={["galleryPage", "blurb"]} value={c.blurb} as="p" className="mt-5 text-[14px] leading-relaxed tracking-tight text-foreground/55 max-w-lg" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="rounded-full border border-border bg-card px-3 py-1 text-[11px] tracking-tight text-foreground/50">
              {FOLDERS.reduce((n, f) => n + (f.items ?? []).length, 0)} <EditableText page="chrome" path={["galleryPage", "filesSuffix"]} value={c.filesSuffix} />
            </span>
            <span className="rounded-full border border-border bg-card px-3 py-1 text-[11px] tracking-tight text-foreground/50">
              {FOLDERS.length} <EditableText page="chrome" path={["galleryPage", "foldersSuffix"]} value={c.foldersSuffix} />
            </span>
          </div>
        </div>

        {/* 3-folder grid OR open folder view */}
        {!openFolder ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FOLDERS.map((folder, i) => (
                <FolderCard key={folder.id} folder={folder} index={i} onClick={() => handleFolderClick(folder)} />
              ))}
            </div>

            {/* ── Recents — real work, visible immediately ── */}
            <Reveal>
              <div className="mt-14">
                <div className="flex items-end justify-between mb-5">
                  <div className="flex items-baseline gap-3">
                    <EditableText page="chrome" path={["galleryPage", "recentsLabel"]} value={c.recentsLabel} as="p" className="text-[10px] uppercase tracking-[0.26em] text-foreground/35" />
                    <EditableText page="chrome" path={["galleryPage", "clickToPreview"]} value={c.clickToPreview} as="p" className="text-[11px] tracking-tight text-foreground/30" />
                  </div>
                  <p className="text-[11px] tracking-tight text-foreground/35">{RECENTS.length} <EditableText page="chrome" path={["galleryPage", "filesSuffix"]} value={c.filesSuffix} /></p>
                </div>
                <div style={{ columns: "4 180px", columnGap: "1rem" }}>
                  {RECENTS.map((r, i) => (
                    <div
                      key={r.item.id}
                      className="mb-4 break-inside-avoid"
                      style={{ animation: `fade-up-in 0.45s cubic-bezier(.2,.8,.2,1) ${i * 40}ms both` }}
                    >
                      <MediaCard item={r.item} binding={{ folder: r.folder, idx: r.idx }} onClick={() => setLightbox(r.item)} />
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </>
        ) : (
          <FolderView
            folder={openFolder}
            onClose={() => setOpenFolder(null)}
            onItemClick={(item) => setLightbox(item)}
          />
        )}

      </main>
    </div>
  );
}
