import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Boxes, Package, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/supplies")({
  component: SuppliesPage,
  head: () => ({ meta: [{ title: "Suprimentos — Portal SIMEC" }] }),
});

const items = [
  { name: "Toner Preto Brother TN-1060", code: "TN-1060", stock: 24, min: 10, status: "ok" },
  { name: "Toner Canon C-EXV54 Cyan", code: "C-EXV54-C", stock: 3, min: 4, status: "low" },
  { name: "Toner Canon C-EXV54 Magenta", code: "C-EXV54-M", stock: 1, min: 4, status: "critical" },
  { name: "Toner HP 87A", code: "CF287A", stock: 8, min: 6, status: "ok" },
  { name: "Cilindro Brother DR-1060", code: "DR-1060", stock: 5, min: 5, status: "ok" },
  { name: "Toner Samsung MLT-D203L", code: "MLT-D203L", stock: 0, min: 3, status: "critical" },
];

const map = {
  ok: "text-success bg-success/10 border-success/20",
  low: "text-warning bg-warning/15 border-warning/30",
  critical: "text-danger bg-danger/10 border-danger/30",
} as const;

function SuppliesPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Package className="h-5 w-5" /></div><div><p className="text-xs uppercase text-muted-foreground">Itens cadastrados</p><p className="text-2xl font-semibold">{items.length}</p></div></div></Card>
        <Card className="p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success"><Boxes className="h-5 w-5" /></div><div><p className="text-xs uppercase text-muted-foreground">Em estoque ok</p><p className="text-2xl font-semibold">{items.filter(i=>i.status==="ok").length}</p></div></div></Card>
        <Card className="p-5"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10 text-danger"><AlertCircle className="h-5 w-5" /></div><div><p className="text-xs uppercase text-muted-foreground">Críticos</p><p className="text-2xl font-semibold text-danger">{items.filter(i=>i.status==="critical").length}</p></div></div></Card>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border/70 bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 text-left font-medium">Item</th>
              <th className="px-5 py-3 text-left font-medium">Código</th>
              <th className="px-5 py-3 text-right font-medium">Estoque</th>
              <th className="px-5 py-3 text-right font-medium">Mínimo</th>
              <th className="px-5 py-3 text-left font-medium">Status</th>
            </tr></thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.code} className="border-b border-border/50 hover:bg-muted/40">
                  <td className="px-5 py-3 font-medium">{it.name}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{it.code}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{it.stock}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{it.min}</td>
                  <td className="px-5 py-3"><span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[it.status as keyof typeof map]}`}>{it.status === "ok" ? "Ok" : it.status === "low" ? "Baixo" : "Crítico"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
