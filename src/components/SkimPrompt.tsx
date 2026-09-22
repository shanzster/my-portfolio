import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { TrafficLights } from "@/components/TrafficLights";
import { useHome } from "@/lib/content";
import { EditableText } from "@/lib/edit-mode";

/**
 * Entry modal (once per session) offering a no-scroll "skim" version of the
 * portfolio. Appears shortly after load; dismissing or choosing either option
 * remembers the choice for the session.
 */
export function SkimPrompt() {
  const { data: home } = useHome();
  const prompt = home.skimPrompt;
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("shz-skim-prompt")) return;
    // Wait for the boot screen to finish on a fresh visit; pop promptly once
    // the site has already booted this session.
    const booted = sessionStorage.getItem("booted");
    const t = setTimeout(() => setShow(true), booted ? 500 : 3100);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    sessionStorage.setItem("shz-skim-prompt", "1");
    setShow(false);
  }

  if (!show) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 99999, background: "rgba(0,0,0,0.5)", animation: "lb-bg-in 0.2s ease both" }}
      onClick={dismiss}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-[16px] border border-border bg-card mac-shadow"
        style={{ animation: "modal-in 0.35s cubic-bezier(.2,.8,.2,1) both" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="flex h-9 items-center justify-between border-b border-border bg-secondary/60 px-3">
          <TrafficLights size={11} onClose={dismiss} />
          <EditableText page="home" path={["skimPrompt", "windowTitle"]} value={prompt.windowTitle} as="span" className="text-[11px] tracking-tight text-foreground/55" />
          <div className="w-[44px]" />
        </div>

        {/* Body */}
        <div className="p-6">
          <EditableText page="home" path={["skimPrompt", "title"]} value={prompt.title} as="h3" className="text-[18px] font-bold tracking-tightest text-foreground leading-tight" />
          <EditableText page="home" path={["skimPrompt", "body"]} value={prompt.body} as="p" className="mt-1.5 text-[12.5px] leading-relaxed tracking-tight text-foreground/55" />

          <div className="mt-5 flex flex-col gap-2">
            <Link
              to="/skim"
              onClick={dismiss}
              className="rounded-full bg-foreground px-5 py-2.5 text-center text-[12px] font-medium tracking-tight text-background transition hover:opacity-85"
            >
              <EditableText page="home" path={["skimPrompt", "skimButton"]} value={prompt.skimButton} />
            </Link>
            <button
              onClick={dismiss}
              className="rounded-full border border-border bg-card px-5 py-2.5 text-[12px] tracking-tight text-foreground/60 transition hover:bg-secondary hover:text-foreground"
            >
              <EditableText page="home" path={["skimPrompt", "fullButton"]} value={prompt.fullButton} />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
