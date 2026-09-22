import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SOCIALS, type Social } from "@/lib/socials-data";
import { WORK_ITEMS, type WorkItem } from "@/lib/work-data";
import { ADS, GRAPHICS, CALENDARS, type Media } from "@/lib/media-data";
import { VIDEOS, type Video } from "@/lib/videos-data";
import { CLIENTS, CLIENTS_META, type Client, type ClientsMeta } from "@/lib/clients-data";
import { SERVICES, type Service } from "@/lib/services-data";
import { FOLDERS, type Folder } from "@/lib/gallery-data";
import { ABOUT, type AboutContent } from "@/lib/about-data";
import { HOME, type HomeContent } from "@/lib/home-data";
import { SKIM, type SkimContent } from "@/lib/skim-data";
import { CHROME, type ChromeContent } from "@/lib/chrome-data";

/* Every CMS item carries an internal `_order` sort key the admin controls; it
   never leaks into the public UI. The identifying field is `id` for most
   collections, but configurable per collection via `idKey` (Services uses `k`). */
export type WithMeta = Record<string, unknown> & { _order?: number };

type CollectionConfig = { seed: WithMeta[]; label: string; idKey: string };

export const COLLECTIONS = {
  socials: { seed: SOCIALS as WithMeta[], label: "Socials", idKey: "id" },
  work: { seed: WORK_ITEMS as WithMeta[], label: "Projects", idKey: "id" },
  ads: { seed: ADS as WithMeta[], label: "Ads", idKey: "id" },
  graphics: { seed: GRAPHICS as WithMeta[], label: "Graphics", idKey: "id" },
  calendars: { seed: CALENDARS as WithMeta[], label: "Calendars", idKey: "id" },
  videos: { seed: VIDEOS as WithMeta[], label: "Videos", idKey: "id" },
  clients: { seed: CLIENTS as WithMeta[], label: "Clients", idKey: "id" },
  services: { seed: SERVICES as WithMeta[], label: "Services", idKey: "k" },
  gallery: { seed: FOLDERS as WithMeta[], label: "Gallery", idKey: "id" },
} satisfies Record<string, CollectionConfig>;

export type CollectionName = keyof typeof COLLECTIONS;

export const idKeyOf = (name: CollectionName): string => COLLECTIONS[name].idKey;

export type Source = "loading" | "db" | "seed";

/* Firestore rejects `undefined`. Deep-clone the value, dropping any undefined
   fields (and undefined array entries), so writes never throw. */
export function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.filter((v) => v !== undefined).map((v) => stripUndefined(v)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined) out[k] = stripUndefined(v);
    }
    return out as T;
  }
  return value;
}

function byOrder(a: WithMeta, b: WithMeta) {
  return (a._order ?? 0) - (b._order ?? 0);
}

/**
 * Subscribe to a Firestore collection with a built-in fallback to the seed
 * defaults. While the first snapshot is in flight, or if the collection is
 * empty, or if the read errors (offline / rules), the seed data is returned so
 * the public site always renders something.
 */
export function useCollection<T extends WithMeta>(
  name: CollectionName,
  seed: T[],
): { items: T[]; loading: boolean; source: Source } {
  const [state, setState] = useState<{ items: T[]; loading: boolean; source: Source }>({
    items: seed,
    loading: true,
    source: "loading",
  });

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, name),
      (snap) => {
        if (snap.empty) {
          setState({ items: seed, loading: false, source: "seed" });
          return;
        }
        const items = snap.docs.map((d) => d.data() as T).sort(byOrder);
        setState({ items, loading: false, source: "db" });
      },
      () => {
        // Permission error / offline — fall back to seed, don't crash the page.
        setState({ items: seed, loading: false, source: "seed" });
      },
    );
    return unsub;
    // seed is a module-level constant per collection; safe to omit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return state;
}

export const useSocials = () => useCollection<Social & WithMeta>("socials", COLLECTIONS.socials.seed as (Social & WithMeta)[]);
export const useWork = () => useCollection<WorkItem & WithMeta>("work", COLLECTIONS.work.seed as (WorkItem & WithMeta)[]);
export const useAds = () => useCollection<Media & WithMeta>("ads", COLLECTIONS.ads.seed as (Media & WithMeta)[]);
export const useGraphics = () => useCollection<Media & WithMeta>("graphics", COLLECTIONS.graphics.seed as (Media & WithMeta)[]);
export const useCalendars = () => useCollection<Media & WithMeta>("calendars", COLLECTIONS.calendars.seed as (Media & WithMeta)[]);
export const useVideos = () => useCollection<Video & WithMeta>("videos", COLLECTIONS.videos.seed as (Video & WithMeta)[]);
export const useClients = () => useCollection<Client & WithMeta>("clients", COLLECTIONS.clients.seed as (Client & WithMeta)[]);
export const useServices = () => useCollection<Service & WithMeta>("services", COLLECTIONS.services.seed as (Service & WithMeta)[]);
export const useGallery = () => useCollection<Folder & WithMeta>("gallery", COLLECTIONS.gallery.seed as (Folder & WithMeta)[]);

/* ─────────── Writes (admin only; gated by Firestore rules) ─────────── */

export async function saveItem(name: CollectionName, item: WithMeta): Promise<void> {
  const id = String(item[idKeyOf(name)]);
  await setDoc(doc(db, name, id), stripUndefined(item));
}

export async function removeItem(name: CollectionName, id: string): Promise<void> {
  await deleteDoc(doc(db, name, id));
}

/** Push the seed defaults into an empty collection (one-time bootstrap). */
export async function seedCollection(name: CollectionName): Promise<number> {
  const { seed, idKey } = COLLECTIONS[name];
  const batch = writeBatch(db);
  seed.forEach((item, i) => {
    batch.set(doc(db, name, String(item[idKey])), stripUndefined({ ...item, _order: i }));
  });
  await batch.commit();
  return seed.length;
}

/* ─────────── Page singletons (pages/{id} documents) ─────────── */

export const PAGES = {
  about: { seed: ABOUT as unknown as Record<string, unknown>, label: "About page" },
  home: { seed: HOME as unknown as Record<string, unknown>, label: "Home page" },
  skim: { seed: SKIM as unknown as Record<string, unknown>, label: "Skim page" },
  clientsMeta: { seed: CLIENTS_META as unknown as Record<string, unknown>, label: "Clients — stats & filters" },
  chrome: { seed: CHROME as unknown as Record<string, unknown>, label: "Page headers & labels" },
} as const;

export type PageId = keyof typeof PAGES;

/** Subscribe to a single Firestore document (pages/{id}) with seed fallback. */
export function useDoc<T>(pageId: PageId, seed: T): { data: T; loading: boolean; source: Source } {
  const [state, setState] = useState<{ data: T; loading: boolean; source: Source }>({
    data: seed,
    loading: true,
    source: "loading",
  });

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "pages", pageId),
      (snap) => {
        if (!snap.exists()) {
          setState({ data: seed, loading: false, source: "seed" });
          return;
        }
        // Merge over the seed so a doc saved before a new section existed still
        // has every top-level key (prevents `home.site` etc. being undefined).
        const merged = { ...(seed as object), ...(snap.data() as object) } as T;
        setState({ data: merged, loading: false, source: "db" });
      },
      () => setState({ data: seed, loading: false, source: "seed" }),
    );
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  return state;
}

export const useAbout = () => useDoc<AboutContent>("about", ABOUT);
export const useHome = () => useDoc<HomeContent>("home", HOME);
export const useSkim = () => useDoc<SkimContent>("skim", SKIM);
export const useClientsMeta = () => useDoc<ClientsMeta>("clientsMeta", CLIENTS_META);
export const useChrome = () => useDoc<ChromeContent>("chrome", CHROME);

export async function savePage(pageId: PageId, data: Record<string, unknown>): Promise<void> {
  await setDoc(doc(db, "pages", pageId), stripUndefined(data));
}

/** Write the seed content into a page doc (one-time bootstrap). */
export async function seedPage(pageId: PageId): Promise<void> {
  await setDoc(doc(db, "pages", pageId), stripUndefined(PAGES[pageId].seed));
}
