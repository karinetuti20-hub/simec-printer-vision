import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const slides = [
  "/static/imgs/communications/comunicado-01.png",
  "/static/imgs/communications/comunicado-02.png",
  "/static/imgs/communications/comunicado-03.png",
  "/static/imgs/communications/comunicado-04.png",
];

export function CommunicationCarousel() {
  const [available, setAvailable] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  // Probe each image; only show the ones that load.
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      slides.map(
        (src) =>
          new Promise<string | null>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => resolve(null);
            img.src = src;
          }),
      ),
    ).then((res) => {
      if (!cancelled) setAvailable(res.filter((s): s is string => !!s));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (available.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % available.length),
      6000,
    );
    return () => window.clearInterval(id);
  }, [available.length]);

  if (available.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-2xl border border-white/40 bg-white/60 p-10 text-center backdrop-blur">
        <div className="max-w-xs">
          <p className="text-sm font-medium text-primary">Comunicados oficiais</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Nenhum comunicado disponível no momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-primary/80">
        Comunicados oficiais
      </p>
      <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/60 bg-white shadow-[0_20px_60px_-30px_rgba(0,91,170,0.35)]">
        {available.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`Comunicado ${i + 1}`}
            loading={i === 0 ? "eager" : "lazy"}
            className={cn(
              "absolute inset-0 h-full w-full object-contain p-4 transition-opacity duration-700 ease-out",
              i === index ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </div>
      {available.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {available.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir para o comunicado ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === index ? "w-8 bg-primary" : "w-2 bg-primary/25 hover:bg-primary/50",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
