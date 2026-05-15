import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { printers } from "@/lib/mock-data";
import { Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/toners")({
  component: TonersPage,
  head: () => ({ meta: [{ title: "Toners — Portal SIMEC" }] }),
});

const colorBg: Record<string, string> = {
  black: "bg-foreground", cyan: "bg-[oklch(0.7_0.14_220)]",
  magenta: "bg-[oklch(0.6_0.22_340)]", yellow: "bg-[oklch(0.85_0.16_95)]",
};

function TonersPage() {
  const all = printers.flatMap((p) => p.toners.map((t) => ({ p, t })));
  const critical = all.filter((x) => x.t.status === "substituir");
  const low = all.filter((x) => x.t.status === "low");
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Total de toners</p>
          <p className="mt-1 text-3xl font-semibold">{all.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Críticos</p>
          <p className="mt-1 text-3xl font-semibold text-danger">{critical.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Atenção</p>
          <p className="mt-1 text-3xl font-semibold text-warning">{low.length}</p>
        </Card>
      </div>
      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold">Níveis por impressora</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {printers.slice(0, 18).map((p) => (
            <div key={p.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.location}</p>
              </div>
              <div className="mt-3 space-y-2">
                {p.toners.map((t) => {
                  const critical = t.status === "substituir";
                  return (
                    <div key={t.color}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="capitalize text-muted-foreground">{t.color}</span>
                        <span className={cn("tabular-nums", critical && "text-danger font-medium")}>{t.level}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div className={cn("h-full rounded-full", colorBg[t.color], critical && "bg-danger animate-soft-pulse")} style={{ width: `${Math.max(3, t.level)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground"><Droplets className="h-3 w-3" /> Mostrando 18 impressoras</p>
      </Card>
    </div>
  );
}
