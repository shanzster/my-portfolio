import { createFileRoute, Link } from "@tanstack/react-router";
import { NavBar } from "@/components/NavBar";
import { TrafficLights } from "@/components/TrafficLights";
import { Reveal } from "@/hooks/useScrollReveal";
import { type Service } from "@/lib/services-data";
import { useServices, useChrome } from "@/lib/content";
import { EditableText } from "@/lib/edit-mode";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Services — Shanzster" },
      {
        name: "description",
        content:
          "Services I offer — social media management, brand identity, content strategy, video editing, paid ads, Shopify store editing, and AI content & image generation for Shopify.",
      },
    ],
  }),
});


function ServiceCard({ s }: { s: Service }) {
  const { data: chrome } = useChrome();
  return (
    <div className="rounded-[14px] border border-border bg-card overflow-hidden mac-shadow flex flex-col">
      {/* Title bar */}
      <div className="flex h-9 items-center justify-between border-b border-border bg-secondary/60 px-3 shrink-0">
        <TrafficLights size={11} />
        <EditableText collection="services" id={s.k} item={s} path={["file"]} value={s.file} as="span" className="text-[11px] tracking-tight text-foreground/50" />
        <span className="text-[10px] tracking-[0.14em] uppercase text-foreground/25">{s.k}</span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 h-8 w-8 shrink-0 rounded-[9px] flex items-center justify-center text-[13px] font-bold text-white"
            style={{ background: s.color }}
          >
            {s.k}
          </span>
          <div>
            <EditableText collection="services" id={s.k} item={s} path={["title"]} value={s.title} as="h3" className="text-[16px] font-bold tracking-tightest text-foreground leading-tight" />
            <EditableText collection="services" id={s.k} item={s} path={["tagline"]} value={s.tagline} as="p" className="mt-0.5 text-[11px] tracking-tight text-foreground/40 italic" />
          </div>
        </div>

        <EditableText collection="services" id={s.k} item={s} path={["description"]} value={s.description} as="p" className="text-[12px] leading-relaxed tracking-tight text-foreground/55" />

        {/* Includes */}
        <div>
          <EditableText page="chrome" path={["servicesPage", "includesLabel"]} value={chrome.servicesPage.includesLabel} as="p" className="text-[9px] uppercase tracking-[0.18em] text-foreground/30 mb-2" />
          <ul className="space-y-1.5">
            {s.includes.map((item, ii) => (
              <li key={ii} className="flex items-start gap-2 text-[11px] tracking-tight text-foreground/60">
                <span
                  className="mt-0.5 h-3.5 w-3.5 rounded-full shrink-0 flex items-center justify-center text-[7px] font-bold text-white"
                  style={{ background: s.color }}
                >
                  ✓
                </span>
                <EditableText collection="services" id={s.k} item={s} path={["includes", ii]} value={item} />
              </li>
            ))}
          </ul>
        </div>

        {/* Sample link */}
        {s.sample && (
          <a
            href={s.sample.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-[8px] border border-border bg-secondary/50 px-3 py-2 text-[11px] font-medium tracking-tight text-foreground/70 hover:text-foreground hover:bg-secondary transition w-fit"
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
            <EditableText collection="services" id={s.k} item={s} path={["sample", "label"]} value={s.sample.label} /> ↗
          </a>
        )}

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-border space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {s.tools.map((t, ti) => (
              <EditableText
                key={ti}
                collection="services"
                id={s.k}
                item={s}
                path={["tools", ti]}
                value={t}
                as="span"
                className="rounded-full bg-secondary border border-border px-2 py-0.5 text-[9.5px] tracking-tight text-foreground/45"
              />
            ))}
          </div>
          <p className="text-[10px] tracking-tight text-foreground/35 leading-snug">
            <EditableText page="chrome" path={["servicesPage", "bestForLabel"]} value={chrome.servicesPage.bestForLabel} as="span" className="font-medium text-foreground/50" />{" "}
            <EditableText collection="services" id={s.k} item={s} path={["bestFor"]} value={s.bestFor} />
          </p>
        </div>
      </div>
    </div>
  );
}

function ServicesPage() {
  const { items: SERVICES } = useServices();
  const { data: chrome } = useChrome();
  const c = chrome.servicesPage;
  return (
    <div className="min-h-screen bg-background pb-32">
      <NavBar />

      <main className="mx-auto max-w-[1200px] px-6 pt-10 sm:px-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[12px] tracking-tight text-foreground/40 hover:text-foreground transition mb-10"
        >
          <EditableText page="chrome" path={["servicesPage", "back"]} value={c.back} />
        </Link>

        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <EditableText page="chrome" path={["servicesPage", "kicker"]} value={c.kicker} as="p" className="text-[10px] uppercase tracking-[0.26em] text-foreground/35 mb-3" />
            <h1
              className="font-bold tracking-tightest text-foreground leading-[0.88]"
              style={{ fontSize: "clamp(44px, 6vw, 80px)" }}
            >
              <EditableText page="chrome" path={["servicesPage", "titleTop"]} value={c.titleTop} as="span" className="block" />
              <EditableText page="chrome" path={["servicesPage", "titleAccent"]} value={c.titleAccent} as="span" className="block" style={{ color: "oklch(0.18 0.01 240 / 0.22)" }} />
            </h1>
            <EditableText page="chrome" path={["servicesPage", "blurb"]} value={c.blurb} as="p" className="mt-5 text-[14px] leading-relaxed tracking-tight text-foreground/55 max-w-lg" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="rounded-full border border-border bg-card px-3 py-1 text-[11px] tracking-tight text-foreground/50">
              {SERVICES.length} <EditableText page="chrome" path={["servicesPage", "countSuffix"]} value={c.countSuffix} />
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.k} delay={(i % 3) * 40}>
              <ServiceCard s={s} />
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-[14px] border border-border bg-card px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <EditableText page="chrome" path={["servicesPage", "ctaTitle"]} value={c.ctaTitle} as="p" className="text-[16px] font-semibold tracking-tight text-foreground" />
            <EditableText page="chrome" path={["servicesPage", "ctaBody"]} value={c.ctaBody} as="p" className="mt-0.5 text-[12px] tracking-tight text-foreground/50" />
          </div>
          <a
            href="/#contact"
            className="rounded-full bg-foreground px-6 py-2.5 text-[12px] tracking-tight text-background transition hover:opacity-85 shrink-0"
          >
            <EditableText page="chrome" path={["servicesPage", "ctaButton"]} value={c.ctaButton} />
          </a>
        </div>
      </main>
    </div>
  );
}
