import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import {
  COLLECTIONS,
  PAGES,
  idKeyOf,
  removeItem,
  saveItem,
  savePage,
  seedCollection,
  seedPage,
  useCollection,
  useDoc,
  type CollectionName,
  type PageId,
  type WithMeta,
} from "@/lib/content";
import {
  SOCIAL_FIELDS,
  WORK_FIELDS,
  MEDIA_FIELDS,
  VIDEO_FIELDS,
  CLIENT_FIELDS,
  SERVICE_FIELDS,
  GALLERY_FIELDS,
  ABOUT_FIELDS,
  HOME_FIELDS,
  SKIM_FIELDS,
  CLIENTS_META_FIELDS,
  CHROME_FIELDS,
  type Field,
} from "@/lib/admin-schema";
import { AdminForm } from "@/components/AdminForm";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — Shanzster" }] }),
});

const SCHEMAS: Record<CollectionName, Field[]> = {
  socials: SOCIAL_FIELDS,
  work: WORK_FIELDS,
  ads: MEDIA_FIELDS,
  graphics: MEDIA_FIELDS,
  calendars: MEDIA_FIELDS,
  videos: VIDEO_FIELDS,
  clients: CLIENT_FIELDS,
  services: SERVICE_FIELDS,
  gallery: GALLERY_FIELDS,
};

const PAGE_SCHEMAS: Record<PageId, Field[]> = {
  about: ABOUT_FIELDS,
  home: HOME_FIELDS,
  skim: SKIM_FIELDS,
  clientsMeta: CLIENTS_META_FIELDS,
  chrome: CHROME_FIELDS,
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function blankFromSchema(fields: Field[]): Record<string, unknown> {
  const o: Record<string, unknown> = {};
  fields.forEach((f) => {
    if (f.kind === "stringList" || f.kind === "imageList" || f.kind === "objectList") o[f.key] = [];
    else if (f.kind === "bool") o[f.key] = false;
    else if (f.kind === "object") o[f.key] = undefined;
    else o[f.key] = "";
  });
  return o;
}

/* ─────────────────────── Auth gate ─────────────────────── */

function AdminPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-[13px] tracking-tight text-foreground/40">Loading…</p>
      </div>
    );
  }

  return user ? <Dashboard /> : <LoginForm />;
}

function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await signIn(email.trim(), password);
      toast.success("Signed in");
    } catch (err) {
      toast.error(authError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <form onSubmit={submit} className="w-full max-w-[360px] rounded-[16px] border border-border bg-card p-6 mac-shadow">
        <p className="text-[10px] uppercase tracking-[0.26em] text-foreground/35 mb-2">Admin</p>
        <h1 className="text-[22px] font-bold tracking-tight text-foreground mb-5">Sign in to manage content</h1>
        <label className="block text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/45 mb-1.5">Email</label>
        <input
          type="email"
          autoComplete="username"
          className="mb-4 w-full rounded-[8px] border border-border bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-foreground/30"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label className="block text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/45 mb-1.5">Password</label>
        <input
          type="password"
          autoComplete="current-password"
          className="mb-5 w-full rounded-[8px] border border-border bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-foreground/30"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-[10px] bg-primary px-4 py-2.5 text-[13px] font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <Link to="/" className="mt-4 block text-center text-[11px] tracking-tight text-foreground/40 hover:text-foreground">
          ← Back to site
        </Link>
      </form>
    </div>
  );
}

function authError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found"))
    return "Wrong email or password.";
  if (code.includes("too-many-requests")) return "Too many attempts — try again later.";
  if (code.includes("invalid-email")) return "That email doesn't look right.";
  return "Couldn't sign in. Check your connection and Firebase setup.";
}

/* ─────────────────────── Dashboard ─────────────────────── */

const isPageId = (t: string): t is PageId => t in PAGES;

function Dashboard() {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<CollectionName | PageId>("socials");

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-[1000px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-semibold tracking-tight text-foreground">Content Manager</span>
            <Link to="/" className="text-[11px] tracking-tight text-foreground/40 hover:text-foreground">
              View site ↗
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[11px] tracking-tight text-foreground/40">{user?.email}</span>
            <button
              onClick={() => signOut()}
              className="rounded-[8px] border border-border bg-background px-3 py-1.5 text-[11px] tracking-tight text-foreground/60 hover:text-foreground hover:border-foreground/25 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1000px] px-6 pt-8">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {(Object.keys(COLLECTIONS) as CollectionName[]).map((name) => (
            <button
              key={name}
              onClick={() => setTab(name)}
              className={`rounded-full px-4 py-1.5 text-[12px] font-medium tracking-tight transition ${
                tab === name
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground/55 hover:text-foreground"
              }`}
            >
              {COLLECTIONS[name].label}
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-border" />
          {(Object.keys(PAGES) as PageId[]).map((id) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`rounded-full px-4 py-1.5 text-[12px] font-medium tracking-tight transition ${
                tab === id
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground/55 hover:text-foreground"
              }`}
            >
              {PAGES[id].label}
            </button>
          ))}
        </div>

        {isPageId(tab) ? (
          <PageEditor key={tab} pageId={tab} fields={PAGE_SCHEMAS[tab]} />
        ) : (
          <CollectionEditor key={tab} name={tab} fields={SCHEMAS[tab]} />
        )}
      </main>
    </div>
  );
}

/* ─────────────────────── Editor ─────────────────────── */

type Draft = Record<string, unknown> & WithMeta;

function CollectionEditor({ name, fields }: { name: CollectionName; fields: Field[] }) {
  const { items, source } = useCollection(name, COLLECTIONS[name].seed as Draft[]);
  const [editing, setEditing] = useState<{ draft: Draft; isNew: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const label = COLLECTIONS[name].label;
  const idKey = idKeyOf(name);
  const idOf = (it: Record<string, unknown>) => String(it[idKey] ?? "");

  const titleOf = (it: Record<string, unknown>) =>
    (it.name as string) || (it.title as string) || idOf(it) || "Untitled";

  const startNew = () =>
    setEditing({ draft: { ...blankFromSchema(fields), [idKey]: "" } as Draft, isNew: true });

  const startEdit = (it: Draft) => setEditing({ draft: { ...it }, isNew: false });

  const existingIds = useMemo(() => new Set(items.map((i) => idOf(i))), [items]);

  async function save() {
    if (!editing) return;
    const id = editing.isNew ? slugify(idOf(editing.draft)) : idOf(editing.draft);
    if (!id) {
      toast.error("An ID (slug) is required.");
      return;
    }
    if (editing.isNew && existingIds.has(id)) {
      toast.error(`ID "${id}" already exists — choose another.`);
      return;
    }
    setBusy(true);
    try {
      const _order =
        typeof editing.draft._order === "number"
          ? editing.draft._order
          : Math.max(0, ...items.map((i) => i._order ?? 0)) + 1;
      await saveItem(name, { ...editing.draft, [idKey]: id, _order });
      toast.success(editing.isNew ? "Created" : "Saved");
      setEditing(null);
    } catch (err) {
      toast.error(writeError(err));
    } finally {
      setBusy(false);
    }
  }

  async function del(it: Draft) {
    if (!confirm(`Delete "${titleOf(it)}"? This can't be undone.`)) return;
    try {
      await removeItem(name, idOf(it));
      toast.success("Deleted");
    } catch (err) {
      toast.error(writeError(err));
    }
  }

  async function seed() {
    if (!confirm(`Load the ${items.length} built-in ${label.toLowerCase()} into the database as a starting point?`))
      return;
    setBusy(true);
    try {
      const n = await seedCollection(name);
      toast.success(`Loaded ${n} ${label.toLowerCase()}`);
    } catch (err) {
      toast.error(writeError(err));
    } finally {
      setBusy(false);
    }
  }

  if (editing) {
    return (
      <div className="rounded-[16px] border border-border bg-card p-6 mac-shadow">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold tracking-tight text-foreground">
            {editing.isNew ? `New ${label.replace(/s$/, "")}` : `Edit — ${titleOf(editing.draft)}`}
          </h2>
          <button
            onClick={() => setEditing(null)}
            className="text-[12px] tracking-tight text-foreground/45 hover:text-foreground"
          >
            Cancel
          </button>
        </div>

        <div className="mb-5">
          <label className="block text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/45 mb-1.5">
            ID (slug)
          </label>
          <input
            className="w-full rounded-[8px] border border-border bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-foreground/30 disabled:opacity-60"
            value={String(editing.draft[idKey] ?? "")}
            disabled={!editing.isNew}
            placeholder="e.g. snappy-nomad"
            onChange={(e) => setEditing({ ...editing, draft: { ...editing.draft, [idKey]: e.target.value } })}
          />
          <p className="mt-1 text-[10px] text-foreground/35">
            {editing.isNew ? "Lowercase, no spaces. Used in the page URL — can't be changed later." : "Fixed once created."}
          </p>
        </div>

        <AdminForm
          fields={fields}
          value={editing.draft}
          onChange={(next) => setEditing({ ...editing, draft: next as Draft })}
        />

        <div className="mt-6 flex gap-2">
          <button
            onClick={save}
            disabled={busy}
            className="rounded-[10px] bg-primary px-5 py-2.5 text-[13px] font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save"}
          </button>
          <button
            onClick={() => setEditing(null)}
            className="rounded-[10px] border border-border bg-background px-5 py-2.5 text-[13px] tracking-tight text-foreground/60 hover:text-foreground transition"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[12px] tracking-tight text-foreground/45">
          {items.length} {label.toLowerCase()}
          {source === "seed" && <span className="ml-2 text-foreground/30">· showing built-in defaults</span>}
          {source === "db" && <span className="ml-2 text-emerald-600/70">· live from database</span>}
        </p>
        <div className="flex gap-2">
          {source === "seed" && (
            <button
              onClick={seed}
              disabled={busy}
              className="rounded-[8px] border border-border bg-card px-3 py-1.5 text-[11px] tracking-tight text-foreground/60 hover:text-foreground hover:border-foreground/25 transition disabled:opacity-60"
            >
              Load defaults into DB
            </button>
          )}
          <button
            onClick={startNew}
            className="rounded-[8px] bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            + Add new
          </button>
        </div>
      </div>

      {source === "seed" && (
        <div className="mb-4 rounded-[10px] border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-[11px] leading-relaxed text-foreground/55">
          The database is empty, so the site is showing the built-in defaults. Click{" "}
          <span className="font-medium text-foreground/75">Load defaults into DB</span> once to start managing this content
          — after that, your edits here go live.
        </div>
      )}

      <div className="space-y-2">
        {items.map((it) => (
          <div
            key={idOf(it)}
            className="flex items-center gap-3 rounded-[12px] border border-border bg-card px-4 py-3"
          >
            <div
              className="h-9 w-9 shrink-0 rounded-full ring-1 ring-border"
              style={{ background: (it.color as string) || (it.bg as string) || "oklch(0.6 0.02 240)" }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium tracking-tight text-foreground">{titleOf(it)}</p>
              <p className="truncate text-[11px] tracking-tight text-foreground/40">{idOf(it)}</p>
            </div>
            <button
              onClick={() => startEdit(it)}
              className="rounded-[8px] border border-border bg-background px-3 py-1.5 text-[11px] tracking-tight text-foreground/60 hover:text-foreground hover:border-foreground/25 transition"
            >
              Edit
            </button>
            <button
              onClick={() => del(it)}
              disabled={source === "seed"}
              title={source === "seed" ? "Load defaults into DB first" : "Delete"}
              className="rounded-[8px] border border-border bg-background px-3 py-1.5 text-[11px] tracking-tight text-foreground/60 hover:text-red-600 hover:border-red-500/30 transition disabled:opacity-40 disabled:hover:text-foreground/60"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────── Page editor (single doc) ─────────────────────── */

function PageEditor({ pageId, fields }: { pageId: PageId; fields: Field[] }) {
  const { data, source } = useDoc<Record<string, unknown>>(pageId, PAGES[pageId].seed);
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  const [busy, setBusy] = useState(false);
  const label = PAGES[pageId].label;

  // Load the resolved content into the editable draft once, then leave it to
  // the user (so live snapshots don't clobber unsaved edits).
  useEffect(() => {
    if (draft === null && source !== "loading") setDraft(data);
  }, [draft, data, source]);

  async function save() {
    if (!draft) return;
    setBusy(true);
    try {
      await savePage(pageId, draft);
      toast.success("Saved");
    } catch (err) {
      toast.error(writeError(err));
    } finally {
      setBusy(false);
    }
  }

  async function seed() {
    if (!confirm(`Load the built-in ${label} content into the database?`)) return;
    setBusy(true);
    try {
      await seedPage(pageId);
      setDraft(PAGES[pageId].seed);
      toast.success("Loaded defaults");
    } catch (err) {
      toast.error(writeError(err));
    } finally {
      setBusy(false);
    }
  }

  if (!draft) {
    return <p className="text-[13px] tracking-tight text-foreground/40">Loading…</p>;
  }

  return (
    <div className="rounded-[16px] border border-border bg-card p-6 mac-shadow">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold tracking-tight text-foreground">{label}</h2>
          <p className="mt-0.5 text-[11px] tracking-tight text-foreground/40">
            {source === "seed" && <span>showing built-in defaults</span>}
            {source === "db" && <span className="text-emerald-600/70">live from database</span>}
          </p>
        </div>
        <div className="flex gap-2">
          {source === "seed" && (
            <button
              onClick={seed}
              disabled={busy}
              className="rounded-[8px] border border-border bg-background px-3 py-1.5 text-[11px] tracking-tight text-foreground/60 hover:text-foreground hover:border-foreground/25 transition disabled:opacity-60"
            >
              Load defaults into DB
            </button>
          )}
          <button
            onClick={save}
            disabled={busy}
            className="rounded-[10px] bg-primary px-5 py-2 text-[12px] font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <AdminForm fields={fields} value={draft} onChange={setDraft} />

      <div className="mt-6">
        <button
          onClick={save}
          disabled={busy}
          className="rounded-[10px] bg-primary px-5 py-2.5 text-[13px] font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

function writeError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  if (code.includes("permission-denied")) return "Permission denied — check your Firestore security rules.";
  if (code.includes("unavailable")) return "Network issue — try again.";
  return "Couldn't save. Check your connection and Firestore setup.";
}
