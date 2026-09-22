# CMS_UPDATE.md — CMS state & what's left to finish

> Handoff doc for a future Claude Code session. Everything below was verified against
> the code as of commit `694fae8` (2026-08-21), pushed to `origin/main`.
> App: `crisp-mac-craft` — Vite + React 19 + TanStack Router + Tailwind/shadcn,
> Firebase project **shanzsterrr**.

---

## 1. What the CMS is (architecture, already built and working)

The portfolio content lives in **Firestore** with hardcoded seed data as fallback.
Two ways to edit: an **/admin dashboard** and **in-place edit mode** on the public site.

### Content layer — `src/lib/content.ts`
- **9 collections** (one Firestore collection each, doc id = item slug):
  `socials, work, ads, graphics, calendars, videos, clients, services, gallery`.
  Config in `COLLECTIONS` map — each has a `seed` array (from `src/lib/*-data.ts`),
  a `label`, and an `idKey` (`"id"` everywhere except services → `"k"`).
- **4 page singletons** stored as `pages/{id}` docs: `about, home, skim, clientsMeta`
  (config in `PAGES` map; seeds from `about-data.ts`, `home-data.ts`, `skim-data.ts`,
  `clients-data.ts` → `CLIENTS_META`).
- Read hooks (`useWork()`, `useHome()`, etc.) subscribe via `onSnapshot` and fall back
  to seed data when the collection is empty, offline, or read errors — so the public
  site always renders. `source` is `"loading" | "db" | "seed"`.
- Items sort by an internal `_order` number the admin controls.
- Writes: `saveItem`, `removeItem`, `savePage`, plus one-time bootstrap helpers
  `seedCollection(name)` / `seedPage(id)` that copy the hardcoded seeds into Firestore.
- `stripUndefined()` deep-cleans values before writes (Firestore rejects `undefined`).
- **Important pattern:** page docs are merged over the seed on read
  (`{...seed, ...snap.data()}`) so adding a new section to a seed later doesn't break
  older saved docs. Keep this when adding fields.

### Admin dashboard — `src/routes/admin.tsx` (route `/admin`)
- Firebase **email/password auth** gate (`src/lib/auth.tsx` — `AuthProvider`/`useAuth`,
  mounted in `__root.tsx`). Not linked from public nav — accessed by URL.
- Tab per collection + tab per page singleton. Schema-driven forms: field definitions
  live in `src/lib/admin-schema.ts` (`WORK_FIELDS`, `HOME_FIELDS`, … `Field` type),
  rendered by `src/components/AdminForm.tsx` (supports string, text, bool, image,
  stringList, imageList, object, objectList kinds).
- Collection editor: list / add (slug auto-slugified, duplicate-id check) / edit /
  delete (confirm) / "Load defaults into DB" button when the collection is empty.
- Page editor: single draft form + Save; snapshot won't clobber unsaved edits.

### In-place edit mode — `src/lib/edit-mode.tsx`
- `EditProvider` + floating `EditToolbar` mounted in `__root.tsx`. When signed in,
  the admin can toggle edit mode on the **public site** and edit content where it
  appears via `EditableText` / `EditableImage`, with a dirty-count + Save/Discard.
- A `Binding` targets either a page doc (`{page}`) or one collection item
  (`{collection, id, item}`).
- `EditableImage` uploads through **Cloudinary unsigned upload**
  (`src/lib/cloudinary.ts` → `uploadToCloudinary`).
- Already wired into: `index.tsx` (28 editable spots), `about.tsx`, `socials.tsx`,
  `clients.tsx`, `services.tsx`, `ads.tsx`, `graphics.tsx`, `calendars.tsx`,
  `videos.tsx`, `AboutScene.tsx`.
- 2026-08-21: home About section (statement/paragraph/stats/clients/skills — content
  moved from hardcoded JSX into `home.about` seed + `HOME_FIELDS`) and the toolkit
  showcase description cards (`tools[i].name/category/how`) are now editable too.
  Note: renaming a tool inline loses its icon (icons merge by name in `TOOLS`).
- 2026-08-21 (second pass): **everything is editable now.** All hardcoded text on
  every public route was moved into page docs and wrapped in Editable primitives:
  - `home` doc grew: `notification`, `workAside`, `heroFolder`, `workFolder`,
    `skimPrompt`, `aboutScene`, `about.kicker*`, and many `site.*` fields (hero
    CTAs/roles/ticker/logo, 8 numbered section headers, services CTA, contact
    labels, footer explore/connect, etc.).
  - `about` doc grew a `page` object (hero identity card, clock/availability/
    platforms/currently cards, kickers, terminal chrome, CTA); journey years,
    credentials type, tools chips, devices are wrapped too.
  - `skim` doc grew `chrome`, `overview`, `headers`, `clientModal` + link/labels;
    /skim and /gallery were added to `INLINE_EDIT_ROUTES`, and `skim`,
    `clientsMeta`, `chrome` were added to edit-mode `bases` (they were missing —
    skim/clientsMeta saves would previously no-op).
  - NEW page doc **`pages/chrome`** (`src/lib/chrome-data.ts`, admin tab "Page
    headers & labels") holds route-level chrome for ads/graphics/calendars/videos,
    services, socials, gallery, clients, and the shared work case-study labels
    (kickers, window titles, coming-soon modals, buttons).
  - Gallery folder labels/descriptions and item titles/images, client modal
    screenshots/captions, work-detail graphics modal (title/description/process/
    tools), analytics metrics, before/after points (when item data exists) are all
    editable in place.
  - Deliberately NOT editable: NavBar/dock labels and menu-bar chrome (structural
    navigation), traffic lights, decorative glyphs, and per-tool SVG icon artwork
    (icons stay in code, merged by name/position).

### Routes consuming CMS data (all done)
Every public route reads from the content hooks: `index` (home doc), `about`
(about + home docs), `clients` (+ clientsMeta), `gallery`, `ads`, `graphics`,
`calendars`, `videos`, `services`, `socials`, `skim`. `work/$id.tsx` uses edit-mode
too. No route still reads the static arrays directly.

### Security — `firestore.rules`
```
allow read: if true;
allow write: if request.auth != null;
```
Public read, any signed-in user writes. Fine while the only Auth account is the
owner's; do NOT enable open sign-up methods without tightening rules
(e.g. `request.auth.token.email == "owner@email"`).

---

## 2. What is NOT finished — do these to "finish the CMS"

### A. ~~Cloudinary upload preset~~ — DONE 2026-08-21
Unsigned preset `shanzster_unsigned` created via the Admin API (uploads go to the
`portfolio/` folder), set in `cloudinary.ts`, and verified with a live test upload.
NOTE: the user pasted their API secret in chat — they were told to regenerate it
(Settings → Access Keys). The secret is not used anywhere in the code.

### B. Firebase project setup (user actions — verify, then guide)
1. **Auth:** Email/Password provider enabled in Firebase console + the admin user
   created (Console → Authentication → Add user). Test login at `/admin`.
2. **Deploy rules:** `npx firebase-tools deploy --only firestore:rules`
   (project `shanzsterrr`, config already in `firebase.json`/`firestore.rules`).
   Unknown whether the deployed rules match the local file.
3. **Seed content:** after login, click **"Load defaults into DB"** on each of the
   9 collection tabs and 4 page tabs in `/admin`. Until then the site shows seeds
   and admin delete buttons are disabled.

### C. Hosting output-dir mismatch (bug)
`firebase.json` hosting `public` is `.vercel/output/static`, but `vite.config.ts`
builds to `dist` (and `vercel.json` exists too — deploy target is ambiguous).
If deploying to Firebase Hosting, change hosting `public` to `"dist"`; if Vercel,
ignore Firebase hosting. **Ask the user which host they use** before changing.

### D. ~~Pre-existing TypeScript error~~ — FIXED 2026-08-21
`src/components/NavBar.tsx:250` TS2339 fixed (cast narrowed to
`{href; label; icon}`); `npx tsc --noEmit` is clean.

### E. Nice-to-haves (only if the user asks)
- Drag-to-reorder in the admin lists (currently `_order` is only settable implicitly;
  new items append to the end).
- Link `/admin` from a hidden spot (e.g. footer glyph) instead of URL-only.
- `PORTFOLIO_UPDATES.md` and `CLIENT_CHANGES.md` hold a separate **UI polish backlog**
  (menu bar clock, traffic-light windows, testimonial animations…) — that's design
  work, not CMS.

---

## 3. Gotchas / house rules

- **No gradients.** The user rejects gradients as "vibecoded" — flat, solid palette
  colors only. Preserve original design decisions.
- `scripts/instagram.config.json` holds a **private IG token** and is gitignored —
  never commit it. Only `instagram.config.example.json` is in the repo.
- The Firebase web API key in `src/lib/firebase.ts` is public-by-design; safe in git.
- Pushes to GitHub previously failed with HTTP 400 due to large image payloads;
  fixed via `git config http.postBuffer 524288000` (already set in this repo).
- Dev server: `npm run dev` (or bun). Build: `npm run build` → `dist/`.

## 4. Suggested finishing order for the next session

1. Ask user for the Cloudinary unsigned preset name → set it in `cloudinary.ts`.
2. Confirm the Firebase Auth admin account exists and login works at `/admin`.
3. Deploy `firestore.rules`.
4. Walk user through seeding all collections/pages from `/admin`.
5. Fix `NavBar.tsx` TS error; run `npx tsc --noEmit` clean.
6. Resolve hosting target (dist vs .vercel/output/static) and deploy.
7. End-to-end test: edit text + upload image in edit mode, verify it persists live.
