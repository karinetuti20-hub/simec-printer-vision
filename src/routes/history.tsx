import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { printers } from "@/lib/mock-data";
import { Clock, ArrowDown, ArrowUp, Droplets } from "lucide-react";

export const Route = createFileRoute("/history")({
  component: HistoryPage,
  head: () => ({ meta: [{ title: "Histórico — Portal SIMEC" }] }),
});

const types = [
  { kind: "online", label: "Voltou online", Icon: ArrowUp, cls: "text-success bg-success/10" },
  { kind: "offline", label: "Ficou offline", Icon: ArrowDown, cls: "text-danger bg-danger/10" },
  { kind: "toner", label: "Substituir toner", Icon: Droplets, cls: "text-warning bg-warning/15" },
];

function HistoryPage() {
  const events = printers.slice(0, 24).map((p, i) => {
    const t = types[i % types.length];
    const minutes = (i + 1) * 23;
    return { id: p.id, name: p.name, location: p.location, ...t, minutes };
  });
  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-4">
      <Card className="p-5">
        <h3 className="text-sm font-semibold">Eventos recentes</h3>
        <p className="text-xs text-muted-foreground">Linha do tempo das alterações de status</p>
      </Card>
      <Card className="divide-y divide-border/60">
        {events.map((e) => (
          <div key={`${e.id}-${e.minutes}`} className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-muted/40">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${e.cls}`}>
              <e.Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm"><span className="font-medium">{e.name}</span> — {e.label}</p>
              <p className="text-xs text-muted-foreground">{e.location}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" /> há {e.minutes} min
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
