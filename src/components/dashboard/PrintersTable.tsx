import * as React from "react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { SeverityBadge } from "./SeverityBadge";
import { printers, type Printer } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export function PrintersTable({ onSelect }: { onSelect: (p: Printer) => void }) {
  const rows = printers.slice(0, 10);
  return (
    <Card className="overflow-hidden border bg-card">
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold">Impressoras monitoradas</h3>
          <p className="text-xs text-muted-foreground">Visão rápida das 10 primeiras impressoras</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 text-left font-medium">Status</th>
              <th className="px-5 py-3 text-left font-medium">Alerta</th>
              <th className="px-5 py-3 text-left font-medium">Local</th>
              <th className="px-5 py-3 text-left font-medium">Nome</th>
              <th className="px-5 py-3 text-left font-medium">Modelo</th>
              <th className="px-5 py-3 text-left font-medium">IP</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const critical = p.status === "offline" || p.severity === "critical";
              return (
                <tr
                  key={p.id}
                  onClick={() => onSelect(p)}
                  className={cn(
                    "cursor-pointer border-b border-border/50 transition-colors hover:bg-primary-soft/60 dark:hover:bg-primary/10",
                    critical && "row-critical",
                  )}
                >
                  <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3"><SeverityBadge severity={p.severity} label={p.alertLabel} /></td>
                  <td className="px-5 py-3 text-foreground">{p.location}</td>
                  <td className="px-5 py-3 font-medium text-foreground">{p.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.model}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{p.ip}</td>
                  <td className="px-3 text-muted-foreground">
                    <ChevronRight className="h-4 w-4" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
