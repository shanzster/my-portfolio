import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import {
  idKeyOf,
  saveItem,
  savePage,
  useHome,
  useAbout,
  useSkim,
  useClientsMeta,
  useChrome,
  type CollectionName,
  type PageId,
} from "@/lib/content";
import { cloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";

/* eslint-disable @typescript-eslint/no-explicit-any */

type Path = (string | number)[];

/* A binding points an editable field at either a page document or one item in
   a collection. */
export type Binding =
  | { page: PageId }
  | { collection: CollectionName; id: string; item: Record<string, unknown> };

type EditState = {
  editing: boolean;
  setEditing: (v: boolean) => void;
  busy: boolean;
  dirtyCount: number;
  getOverride: (b: Binding, path: Path) => unknown;
  setValue: (b: Binding, path: Path, value: unknown) => void;
  save: () => Promise<void>;
  discard: () => void;
};

const EditContext = createContext<EditState | null>(null);

export function useEdit(): EditState {
  const ctx = useContext(EditContext);
  if (!ctx) throw new Error("useEdit must be used within <EditProvider>");
  return ctx;
}

function deepSet(obj: Record<string, unknown>, path: Path, value: unknown) {
  let cur: any = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (cur[key] === undefined || cur[key] === null) cur[key] = typeof path[i + 1] === "number" ? [] : {};
    cur = cur[key];
  }
  cur[path[path.length - 1]] = value;
}

const isPage = (b: Binding): b is { page: PageId } => "page" in b;
const itemKey = (b: { collection: CollectionName; id: string }) => `${b.collection}:${b.id}`;

export function EditProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { data: home } = useHome();
  const { data: about } = useAbout();
  const { data: skim } = useSkim();
  const { data: clientsMeta } = useClientsMeta();
  const { data: chrome } = useChrome();

  const [editing, setEditingState] = useState(false);
  const [busy, setBusy] = useState(false);
  // page edits: pageOv[pageId][JSON(path)] = value
  const [pageOv, setPageOv] = useState<Record<string, Record<string, unknown>>>({});
  // collection-item edits, captured with a base snapshot on first touch
  const [itemOv, setItemOv] = useState<
    Record<string, { collection: CollectionName; base: Record<string, unknown>; patches: Record<string, unknown> }>
  >({});

  useEffect(() => {
    if (!user && editing) setEditingState(false);
  }, [user, editing]);

  const bases: Partial<Record<PageId, any>> = { home, about, skim, clientsMeta, chrome };

  const dirtyCount =
    Object.values(pageOv).reduce((n, m) => n + Object.keys(m).length, 0) +
    Object.values(itemOv).reduce((n, r) => n + Object.keys(r.patches).length, 0);

  const getOverride = (b: Binding, path: Path) => {
    const k = JSON.stringify(path);
    if (isPage(b)) return pageOv[b.page]?.[k];
    const rec = itemOv[itemKey(b)];
    return rec && k in rec.patches ? rec.patches[k] : undefined;
  };

  const setValue = (b: Binding, path: Path, value: unknown) => {
    const k = JSON.stringify(path);
    if (isPage(b)) {
      setPageOv((prev) => ({ ...prev, [b.page]: { ...(prev[b.page] ?? {}), [k]: value } }));
    } else {
      setItemOv((prev) => {
        const key = itemKey(b);
        const ex = prev[key];
        return {
          ...prev,
          [key]: {
            collection: b.collection,
            base: ex?.base ?? b.item,
            patches: { ...(ex?.patches ?? {}), [k]: value },
          },
        };
      });
    }
  };

  const save = async () => {
    setBusy(true);
    try {
      for (const page of Object.keys(pageOv) as PageId[]) {
        const patch = pageOv[page];
        if (!patch || !Object.keys(patch).length || !bases[page]) continue;
        const next = JSON.parse(JSON.stringify(bases[page]));
        for (const [pstr, val] of Object.entries(patch)) deepSet(next, JSON.parse(pstr), val);
        await savePage(page, next);
      }
      for (const rec of Object.values(itemOv)) {
        if (!Object.keys(rec.patches).length) continue;
        const next = JSON.parse(JSON.stringify(rec.base));
        for (const [pstr, val] of Object.entries(rec.patches)) deepSet(next, JSON.parse(pstr), val);
        // Ensure the id field survives the merge.
        await saveItem(rec.collection, next);
      }
      setPageOv({});
      setItemOv({});
      setEditingState(false);
      toast.success("Changes saved");
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      toast.error(code.includes("permission-denied") ? "Permission denied — check Firestore rules." : "Couldn't save changes.");
    } finally {
      setBusy(false);
    }
  };

  const discard = () => {
    setPageOv({});
    setItemOv({});
    setEditingState(false);
  };

  const value: EditState = { editing, setEditing: setEditingState, busy, dirtyCount, getOverride, setValue, save, discard };
  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
}

/* ─────────────── Inline-editable primitives ─────────────── */

const EDIT_RING = "outline outline-2 outline-dashed outline-sky-500/60 rounded-[3px] outline-offset-2 cursor-text focus:outline-sky-500";

export function EditableText({
  as = "span",
  className = "",
  style,
  value,
  path,
  ...binding
}: Binding & {
  path: Path;
  value: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { editing, getOverride, setValue } = useEdit();
  const b = binding as Binding;
  const ref = useRef<HTMLElement>(null);
  const override = getOverride(b, path);
  const shown = (override === undefined ? value : (override as string)) ?? "";

  useEffect(() => {
    if (editing && ref.current) ref.current.textContent = shown;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  if (!editing) return createElement(as, { className, style }, shown);

  return createElement(as, {
    ref,
    contentEditable: true,
    suppressContentEditableWarning: true,
    className: `${className} ${EDIT_RING}`,
    style,
    title: "Click to edit",
    // Don't let clicks bubble to a parent <button>/link (many cards are buttons).
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
    onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
    onBlur: (e: React.FocusEvent<HTMLElement>) => setValue(b, path, e.currentTarget.textContent ?? ""),
  });
}

export function EditableImage({
  src,
  alt = "",
  className = "",
  style,
  wrapperClassName = "relative inline-block",
  path,
  ...binding
}: Binding & {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  wrapperClassName?: string;
  path: Path;
}) {
  const { editing, getOverride, setValue } = useEdit();
  const b = binding as Binding;
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  // Skeleton pulse until the image has actually painted (slow connections).
  const [loaded, setLoaded] = useState(false);
  const override = getOverride(b, path);
  const shown = (override === undefined ? src : (override as string)) || "";

  const img = shown ? (
    <img
      src={shown}
      alt={alt}
      className={`${className}${loaded ? "" : " img-skeleton"}`}
      style={style}
      loading="lazy"
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
      ref={(el) => {
        // Cached images can finish before hydration attaches onLoad.
        if (el?.complete) setLoaded(true);
      }}
    />
  ) : (
    <span className={className} style={style} />
  );
  if (!editing) return shown ? img : null;

  return (
    <span
      className={`group/edit ${wrapperClassName}`}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {img}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setBusy(true);
          try {
            const url = await uploadToCloudinary(file);
            setValue(b, path, url);
            toast.success("Image updated");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Upload failed");
          } finally {
            setBusy(false);
          }
        }}
      />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 rounded-[inherit] bg-black/45 opacity-0 transition group-hover/edit:opacity-100">
        <button
          type="button"
          disabled={busy || !cloudinaryConfigured()}
          title={cloudinaryConfigured() ? "Upload a new image" : "Set up Cloudinary to upload"}
          onClick={() => fileRef.current?.click()}
          className="pointer-events-auto rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-black hover:bg-white disabled:opacity-50"
        >
          {busy ? "Uploading…" : "⬆ Replace"}
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("Paste an image URL", shown);
            if (url !== null) setValue(b, path, url);
          }}
          className="pointer-events-auto rounded-full bg-white/20 px-3 py-1 text-[11px] font-medium text-white hover:bg-white/30"
        >
          URL
        </button>
      </span>
    </span>
  );
}

/* ─────────────── Floating toolbar ─────────────── */

// Routes with inline-editable content wired up.
const INLINE_EDIT_ROUTES = ["/", "/about", "/ads", "/graphics", "/calendars", "/videos", "/socials", "/services", "/clients", "/skim", "/gallery"];
const isEditableRoute = (pathname: string) => INLINE_EDIT_ROUTES.includes(pathname) || pathname.startsWith("/work/");

export function EditToolbar() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { editing, setEditing, dirtyCount, save, discard, busy } = useEdit();
  if (!user || !isEditableRoute(pathname)) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-[400] -translate-x-1/2">
      {!editing ? (
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[12px] font-medium tracking-tight text-foreground shadow-lg transition hover:border-foreground/30"
        >
          ✎ Edit this page
        </button>
      ) : (
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5 shadow-lg">
          <span className="px-2 text-[11px] tracking-tight text-foreground/50">
            {dirtyCount > 0 ? `${dirtyCount} change${dirtyCount === 1 ? "" : "s"}` : "Editing — click text or images"}
          </span>
          <button
            onClick={save}
            disabled={busy || dirtyCount === 0}
            className="rounded-full bg-primary px-4 py-1.5 text-[12px] font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save"}
          </button>
          <button
            onClick={discard}
            disabled={busy}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-[12px] tracking-tight text-foreground/60 transition hover:text-foreground disabled:opacity-50"
          >
            {dirtyCount > 0 ? "Discard" : "Done"}
          </button>
        </div>
      )}
    </div>
  );
}
