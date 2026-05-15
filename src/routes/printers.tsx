import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { SeverityBadge } from "@/components/dashboard/SeverityBadge";
import { printers } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import * as React from "react";

export const Route = createFileRoute("/printers")({
  component: PrintersPage,
  head: () => ({ meta: [{ title: "Impressoras — Portal SIMEC" }] }),
});

function PrintersPage() {
  const [q, setQ] = React.useState("");
  const filtered = printers.filter(
    (p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.location.toLowerCase().includes(q.toLowerCase()) || p.ip.includes(q),
  );
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-4">
      <Card className="p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrar por nome, local ou IP" className="pl-9" />
        </div>
      </Card>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/70 bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Alerta</th>
                <th className="px-5 py-3 text-left font-medium">Local</th>
                <th className="px-5 py-3 text-left font-medium">Nome</th>
                <th className="px-5 py-3 text-left font-medium">Modelo</th>
                <th className="px-5 py-3 text-left font-medium">Fabricante</th>
                <th className="px-5 py-3 text-left font-medium">IP</th>
                <th className="px-5 py-3 text-right font-medium">Páginas</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border/50 transition-colors hover:bg-muted/40">
                  <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3"><SeverityBadge severity={p.severity} label={p.alertLabel} /></td>
                  <td className="px-5 py-3">{p.location}</td>
                  <td className="px-5 py-3 font-medium">{p.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.model}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.manufacturer}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{p.ip}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{p.pages.toLocaleString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
