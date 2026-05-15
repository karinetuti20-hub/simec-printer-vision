import { Card } from "@/components/ui/card";
import { Printer, Wifi, WifiOff, AlertTriangle, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import { summary } from "@/lib/mock-data";

const items = (s: ReturnType<typeof summary>) => [
  { label: "Total de Impressoras", value: s.total, sub: "Frota monitorada", Icon: Printer, color: "text-primary", ring: "ring-primary/15", bg: "bg-primary/10" },
  { label: "Online", value: s.online, sub: "Operando normalmente", Icon: Wifi, color: "text-success", ring: "ring-success/20", bg: "bg-success/10" },
  { label: "Offline", value: s.offline, sub: "Sem comunicação", Icon: WifiOff, color: "text-danger", ring: "ring-danger/20", bg: "bg-danger/10" },
  { label: "Com Alerta", value: s.withAlert, sub: "Requer atenção", Icon: AlertTriangle, color: "text-warning", ring: "ring-warning/30", bg: "bg-warning/15" },
  { label: "Substituir Toner", value: s.replaceToner, sub: "Suprimentos críticos", Icon: Droplets, color: "text-danger", ring: "ring-danger/20", bg: "bg-danger/10" },
];

export function DashboardCards() {
  const s = summary();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {items(s).map((it) => (
        <Card key={it.label} className="group relative overflow-hidden border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{it.label}</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-foreground">{it.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{it.sub}</p>
            </div>
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl ring-1", it.bg, it.ring)}>
              <it.Icon className={cn("h-5 w-5", it.color)} />
            </div>
          </div>
          <div className={cn("absolute inset-x-0 bottom-0 h-0.5 opacity-60", it.bg)} />
        </Card>
      ))}
    </div>
  );
}
