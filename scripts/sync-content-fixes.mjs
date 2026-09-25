/* One-shot Firestore content fixes (2026-09-26 portfolio audit).
   The live site reads from Firestore, so these fixes must be written to the DB
   as well as the seed files. Patches ONLY the audited fields — never touches
   graphics or anything uploaded via the CMS.

   Run:  ADMIN_EMAIL=you@mail.com ADMIN_PASSWORD='...' node scripts/sync-content-fixes.mjs
   (or run with no env vars and it will prompt)

   Fixes applied:
   1. pages/home  site.ticker        — removes fabricated placeholder stats
   2. pages/home  site.aboutPills    — "7 pages managed" → "9 brands managed"
   3. pages/home  heroFolder story   — removes unattributed "tripled reach" claim
   4. clients/bella-monza  link      — dead instagram.com placeholder → real handle
   5. clients/snappy-nomad link      — dead instagram.com placeholder → @shanzster.zip
   6. work/stealandstyle             — adds analytics + calendar screenshots
*/
import { createInterface } from "node:readline/promises";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyCdNY8FB8QMw-8RAm-yJdlaxwjyyDjVgGE",
  authDomain: "shanzsterrr.firebaseapp.com",
  projectId: "shanzsterrr",
});
const db = getFirestore(app);

let email = process.env.ADMIN_EMAIL;
let password = process.env.ADMIN_PASSWORD;
if (!email || !password) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  email ||= await rl.question("Admin email: ");
  password ||= await rl.question("Admin password: ");
  rl.close();
}

console.log("Signing in…");
await signInWithEmailAndPassword(getAuth(app), email.trim(), password.trim());
console.log("Signed in.\n");

/* 1–3: pages/home */
const homeRef = doc(db, "pages", "home");
const home = (await getDoc(homeRef)).data() ?? {};

const updates = {
  "site.ticker": [
    "Fast Snaking · 3–5 calls/week, all organic",
    "Masinloc · Joiners Program → revenue & tourism ↑",
    "Fast Snaking · brand built from zero in one week",
    "9 brands managed across 5 platforms",
    "StealandStyle · IG content system",
    "Fashion e-com · paid + organic under one roof",
  ],
  "site.aboutPills": [
    { value: "9", label: "brands managed" },
    { value: "5+", label: "brands built" },
    { value: "2+", label: "yrs freelance" },
  ],
};

// heroFolder.services is an array, so patch the story line and write it whole.
if (Array.isArray(home.heroFolder?.services)) {
  const services = structuredClone(home.heroFolder.services);
  for (const s of services) {
    if (!Array.isArray(s.story)) continue;
    s.story = s.story.map((line) =>
      line.includes("tripled organic reach")
        ? "From editorial calendars to topic clusters, I build content engines that keep working long after I've shipped them — systems I've run for fashion e-commerce brands, a government tourism office, and local service businesses."
        : line,
    );
  }
  updates["heroFolder.services"] = services;
}

await updateDoc(homeRef, updates);
console.log("✔ pages/home — ticker, aboutPills, heroFolder story fixed");

/* 4–5: dead client links (only overwrite if still the bare placeholder) */
for (const [id, link] of [
  ["bella-monza", "https://instagram.com/bellamonza"],
  ["snappy-nomad", "https://instagram.com/shanzster.zip"],
]) {
  const ref = doc(db, "clients", id);
  const cur = (await getDoc(ref)).data();
  if (!cur) { console.log(`• clients/${id} not in DB — seed fix covers it`); continue; }
  if (cur.link === "https://instagram.com") {
    await updateDoc(ref, { link });
    console.log(`✔ clients/${id} — link → ${link}`);
  } else {
    console.log(`• clients/${id} — link already set (${cur.link}), left alone`);
  }
}

/* 6: StealandStyle proof — analytics + calendar screenshots (graphics untouched) */
const ssRef = doc(db, "work", "stealandstyle");
const ss = (await getDoc(ssRef)).data();
if (ss) {
  const patch = {};
  if (!ss.analyticsImg) patch.analyticsImg = "/Campaigns/stealandstyle_Analytics_Screenshot.png";
  if (!ss.calendarImg) patch.calendarImg = "/Campaigns/stealandstyle_ContentCalendar.png";
  if (Object.keys(patch).length) {
    await updateDoc(ssRef, patch);
    console.log("✔ work/stealandstyle — analytics + content calendar screenshots added");
  } else {
    console.log("• work/stealandstyle — already has analytics/calendar, left alone");
  }
}

console.log("\nDone. Hard-refresh the live site to verify.");
process.exit(0);
