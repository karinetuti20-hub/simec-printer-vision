import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CommunicationCarousel } from "@/components/login/CommunicationCarousel";
import { LoginCard } from "@/components/login/LoginCard";
import { LoginIntroAnimation } from "@/components/login/LoginIntroAnimation";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Acesso — SIMEC" },
      { name: "description", content: "Acesso ao portal interno SIMEC." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: LoginPage,
});

const SESSION_KEY = "simec:loginIntroPlayed";

function LoginPage() {
  const [intro, setIntro] = useState(false);
  const [logoReady, setLogoReady] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const played = window.sessionStorage.getItem(SESSION_KEY);
    if (reduce || played) {
      setIntro(false);
      setLogoReady(true);
    } else {
      setIntro(true);
      setLogoReady(false);
    }
  }, []);

  function handleIntroFinish() {
    window.sessionStorage.setItem(SESSION_KEY, "1");
    setIntro(false);
    setLogoReady(true);
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Soft institutional backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_color-mix(in_oklab,var(--primary)_18%,transparent),_transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(ellipse_at_bottom_right,_color-mix(in_oklab,var(--primary)_10%,transparent),_transparent_70%)]"
      />

      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-5">
        {/* Left — Communications (≈60% on desktop) */}
        <section className="order-2 col-span-1 flex items-stretch justify-center px-6 pb-10 pt-2 lg:order-1 lg:col-span-3 lg:px-12 lg:py-14">
          <div className="flex w-full max-w-3xl flex-col">
            <CommunicationCarousel />
          </div>
        </section>

        {/* Right — Login (≈40% on desktop) */}
        <section className="order-1 col-span-1 flex items-center justify-center px-6 pt-14 lg:order-2 lg:col-span-2 lg:px-10 lg:py-14">
          <LoginCard logoAnimated={logoReady} />
        </section>
      </div>

      {intro && <LoginIntroAnimation onFinish={handleIntroFinish} />}
    </div>
  );
}
