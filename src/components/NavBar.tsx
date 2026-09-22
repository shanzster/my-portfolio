import { useEffect, useState } from "react";
import { useIsClient } from "@/hooks/useIsClient";

function getIsCompactDevice() {
  const isNarrowViewport = window.matchMedia("(max-width: 767px)").matches;
  const isTabletWidth = window.matchMedia("(max-width: 1024px)").matches;
  const hasTouch = navigator.maxTouchPoints > 0;
  const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const isKnownMobile = /Android|iPhone|iPad|iPod|Mobile|CriOS|FxiOS|OPiOS|EdgA|SamsungBrowser/i.test(navigator.userAgent);
  const isTouchTabletOrPhone = isTabletWidth && (hasTouch || hasCoarsePointer);
  return isNarrowViewport || isKnownMobile || isTouchTabletOrPhone;
}


const DOCK_ITEMS = [
  {
    label: "Home",
    href: "/",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
        <rect width="28" height="28" rx="7" fill="oklch(0.74 0.13 240)" />
        <path d="M14 7L6 13.5V22h5.5v-5h5v5H22V13.5L14 7Z" fill="white" fillOpacity="0.9" />
      </svg>
    ),
  },
  {
    label: "About",
    href: "/about",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
        <rect width="28" height="28" rx="7" fill="oklch(0.62 0.16 145)" />
        <circle cx="14" cy="10" r="3.5" fill="white" fillOpacity="0.9" />
        <path d="M7 22c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="white" strokeOpacity="0.9" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Work",
    href: "/#work",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
        <rect width="28" height="28" rx="7" fill="oklch(0.68 0.14 238)" />
        <path d="M5 10.5C5 9.67 5.67 9 6.5 9H12l2 2.5H21.5c.83 0 1.5.67 1.5 1.5V20c0 .83-.67 1.5-1.5 1.5h-15C5.67 21.5 5 20.83 5 20V10.5Z" fill="white" fillOpacity="0.9" />
      </svg>
    ),
  },
  {
    label: "Services",
    href: "/services",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
        <rect width="28" height="28" rx="7" fill="oklch(0.60 0.16 170)" />
        <path d="M8 9h12M8 14h8M8 19h10" stroke="white" strokeOpacity="0.9" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Contact",
    href: "/#contact",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
        <rect width="28" height="28" rx="7" fill="oklch(0.68 0.18 27)" />
        <path d="M6 9.5C6 8.67 6.67 8 7.5 8h13c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-13C6.67 20 6 19.33 6 18.5v-9Z" stroke="white" strokeOpacity="0.9" strokeWidth="1.8" />
        <path d="M6 10l8 5.5L22 10" stroke="white" strokeOpacity="0.9" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Skim",
    href: "/skim",
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
        <rect width="28" height="28" rx="7" fill="oklch(0.66 0.17 300)" />
        <path d="M15 5l-8 10h5l-2 8 8-10h-5l2-8Z" fill="white" fillOpacity="0.9" />
      </svg>
    ),
  },
  { divider: true },
  {
    label: "Hire me",
    href: "/#contact",
    cta: true,
    icon: (
      <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
        <rect width="28" height="28" rx="7" fill="oklch(0.18 0.01 240)" />
        <path d="M14 8v12M8 14h12" stroke="white" strokeOpacity="0.9" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
] as const;

export function NavBar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [isCompactDevice, setIsCompactDevice] = useState(false);
  const isClient = useIsClient();

  // isMobile is only true after client hydration — prevents SSR mismatch
  const isMobile = isClient && isCompactDevice;

  useEffect(() => {
    const update = () => {
      setIsCompactDevice(getIsCompactDevice());
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  // Magnification: items near hovered one scale up too
  const getScale = (i: number) => {
    if (isMobile) return 1;
    if (hoveredIndex === null) return 1;
    const dist = Math.abs(i - hoveredIndex);
    if (dist === 0) return 1.55;
    if (dist === 1) return 1.28;
    if (dist === 2) return 1.10;
    return 1;
  };

  const allItems = DOCK_ITEMS;

  return (
    <>
      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          style={{
            transform: `translateX(-50%)`,
            bottom: isMobile ? "calc(env(safe-area-inset-bottom, 0px) + 68px)" : 92,
          }}
        >
          <div
            className="rounded-[8px] px-3 py-1.5 text-[12px] font-medium tracking-tight text-foreground"
            style={{
              background: "oklch(1 0 0 / 0.88)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 2px 12px -2px oklch(0.2 0.02 240 / 0.18), 0 0 0 0.5px oklch(0.5 0.01 240 / 0.15)",
            }}
          >
            {tooltip}
          </div>
        </div>
      )}

      {/* Dock */}
      <div
        className="fixed left-1/2 z-50"
        style={{
          bottom: isMobile ? "calc(env(safe-area-inset-bottom, 0px) + 8px)" : 20,
          transform: "translateX(-50%)",
          width: isMobile ? "100%" : "auto",
          pointerEvents: "none",
        }}
      >
        <div
          className="mx-auto flex w-fit max-w-[calc(100vw-12px)] items-end rounded-[20px]"
          style={{
            pointerEvents: "auto",
            gap: isMobile ? 2 : 8,
            padding: isMobile ? "4px 5px" : "8px 16px",
            background: "oklch(0.97 0.005 240 / 0.72)",
            backdropFilter: "blur(28px) saturate(1.8)",
            WebkitBackdropFilter: "blur(28px) saturate(1.8)",
            border: "1px solid oklch(0.88 0.005 240 / 0.8)",
            boxShadow:
              "0 8px 32px -8px oklch(0.2 0.02 240 / 0.22), 0 0 0 0.5px oklch(0.5 0.01 240 / 0.12), inset 0 1px 0 oklch(1 0 0 / 0.6)",
            overflowX: isMobile ? "auto" : "visible",
            overflowY: "visible",
          }}
        >
          {allItems.map((item, i) => {
            if ("divider" in item && item.divider) {
              return (
                <div
                  key={`div-${i}`}
                  className="self-center mx-1"
                  style={{
                    width: 1,
                    height: isMobile ? 18 : 32,
                    background: "oklch(0.18 0.01 240 / 0.15)",
                  }}
                />
              );
            }

            const navItem = item as { href: string; label: string; icon: React.ReactNode };
            const realIndex = allItems.slice(0, i).filter((x) => !("divider" in x && x.divider)).length;
            const scale = getScale(realIndex);

            return (
              <a
                key={navItem.label}
                href={navItem.href}
                aria-label={navItem.label}
                className="relative flex flex-col items-center"
                style={{
                  transition: "transform 0.2s cubic-bezier(.2,.8,.2,1)",
                  transform: `scale(${scale})`,
                  transformOrigin: "bottom center",
                  margin: isMobile ? "0 1px" : undefined,
                }}
                onMouseEnter={() => {
                  setHoveredIndex(realIndex);
                  setTooltip(navItem.label);
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  setTooltip(null);
                }}
              >
                <div
                  style={{ width: isMobile ? 26 : 48, height: isMobile ? 26 : 48 }}
                  className="rounded-[12px] overflow-hidden shadow-[0_2px_8px_-2px_oklch(0.2_0.02_240/0.25)]"
                >
                  {navItem.icon}
                </div>
              </a>
            );
          })}
        </div>

        {/* Dock reflection line */}
        <div
          className="mx-auto mt-1 rounded-full"
          style={{
            width: isMobile ? "52%" : "60%",
            height: 1,
            background: "linear-gradient(90deg, transparent, oklch(0.18 0.01 240 / 0.12), transparent)",
          }}
        />
      </div>
    </>
  );
}
