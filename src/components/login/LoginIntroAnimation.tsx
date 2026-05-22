import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/static/imgs/simec-logo.png";

/**
 * Full-screen institutional intro:
 * 1. Solid primary overlay with centered logo.
 * 2. Logo eases toward the top-right (where the login card lives).
 * 3. Overlay fades out, revealing the underlying layout.
 *
 * Plays once per session and respects prefers-reduced-motion.
 */
export function LoginIntroAnimation({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<"idle" | "moving" | "done">("idle");

  useEffect(() => {
    const t1 = window.setTimeout(() => setPhase("moving"), 1400);
    const t2 = window.setTimeout(() => {
      setPhase("done");
      onFinish();
    }, 2400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [onFinish]);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-primary transition-opacity duration-500",
        phase === "done" ? "opacity-0" : "opacity-100",
      )}
    >
      <img
        src={LOGO_SRC}
        alt=""
        className={cn(
          "h-24 w-auto object-contain transition-all duration-[900ms]",
          "[transition-timing-function:cubic-bezier(0.65,0,0.35,1)]",
          phase === "idle" && "scale-100 opacity-100 brightness-0 invert",
          phase === "moving" && "scale-75 opacity-90 brightness-0 invert",
          phase === "done" && "opacity-0",
        )}
      />
    </div>
  );
}
