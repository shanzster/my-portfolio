import profileImage from "@/image_reference/profile.png";
import { useHome } from "@/lib/content";
import { EditableImage, EditableText } from "@/lib/edit-mode";

export function AboutScene() {
  const { data: home } = useHome();
  return (
    <div
      className="relative w-full h-full rounded-[16px] overflow-hidden"
      style={{ minHeight: 500 }}
    >
      {/* Full-bleed profile photo */}
      <EditableImage
        page="home"
        path={["profileImage"]}
        src={home.profileImage || profileImage}
        alt="Shanzster"
        wrapperClassName="absolute inset-0"
        className="absolute inset-0 w-full h-full object-cover object-top"
        style={{ mixBlendMode: "multiply" }}
      />

      {/* Bottom gradient scrim so text is readable */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "45%",
          background:
            "linear-gradient(to top, oklch(0.97 0.005 240) 0%, oklch(0.97 0.005 240 / 0.85) 40%, transparent 100%)",
          zIndex: 2,
        }}
      />

      {/* Name tag */}
      <div
        className="absolute bottom-0 inset-x-0 px-7 pb-7"
        style={{ zIndex: 3 }}
      >
        <EditableText page="home" path={["aboutScene", "kicker"]} value={home.aboutScene.kicker} as="p" className="text-[10px] uppercase tracking-[0.28em] text-foreground/40 mb-1" />
        <EditableText page="home" path={["aboutScene", "name"]} value={home.aboutScene.name} as="p" className="text-[28px] font-bold tracking-tightest text-foreground leading-tight" />
        <EditableText page="home" path={["aboutScene", "role"]} value={home.aboutScene.role} as="p" className="mt-0.5 text-[13px] tracking-tight text-foreground/55" />

        {/* Quick stat pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {home.site.aboutPills.map(({ value, label }, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1"
              style={{ backdropFilter: "blur(8px)" }}
            >
              <EditableText page="home" path={["site", "aboutPills", i, "value"]} value={value} as="span" className="text-[13px] font-bold tracking-tightest text-foreground" />
              <EditableText page="home" path={["site", "aboutPills", i, "label"]} value={label} as="span" className="text-[10px] tracking-tight text-foreground/45" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
