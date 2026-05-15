import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { SeverityBadge } from "./SeverityBadge";
import { TonerRequestPreview } from "./TonerRequestPreview";
import type { Printer, TonerInfo } from "@/lib/mock-data";
import { Printer as PrinterIcon, Droplets, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const tonerColor: Record<TonerInfo["color"], string> = {
  black: "oklch(0.25 0.02 250)",
  cyan: "oklch(0.7 0.14 220)",
  magenta: "oklch(0.6 0.22 340)",
  yellow: "oklch(0.85 0.16 95)",
};
const tonerLabel: Record<TonerInfo["color"], string> = {
  black: "Preto", cyan: "Ciano", magenta: "Magenta", yellow: "Amarelo",
};

function TonerBar({ t }: { t: TonerInfo }) {
  const critical = t.status === "substituir";
  const low = t.status === "low";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-foreground">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: tonerColor[t.color] }} />
          {tonerLabel[t.color]}
        </span>
        <span className={cn("font-medium tabular-nums", critical ? "text-danger" : low ? "text-warning" : "text-muted-foreground")}>
          {t.level}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", critical && "animate-soft-pulse")}
          style={{
            width: `${Math.max(3, t.level)}%`,
            background: critical ? "var(--danger)" : low ? "var(--warning)" : tonerColor[t.color],
          }}
        />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  );
}

export function PrinterDetailModal({
  printer,
  open,
  onOpenChange,
}: {
  printer: Printer | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [previewOpen, setPreviewOpen] = React.useState(false);
  if (!printer) return null;

  const needsToner = printer.toners.some((t) => t.status === "substituir");
  const imgPath = `/static/printers/${printer.model}.png`;
  const fallback = `/static/printers/default-printer.png`;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl overflow-hidden p-0">
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
            {/* Left */}
            <div className="flex flex-col items-center justify-start gap-3 border-b border-border/70 bg-gradient-to-b from-primary-soft to-card p-6 dark:from-primary/10 dark:to-card md:border-b-0 md:border-r">
              <div className="flex h-44 w-44 items-center justify-center rounded-2xl border bg-card shadow-[var(--shadow-card)]">
                <img
                  src={imgPath}
                  alt={printer.model}
                  className="h-32 w-32 object-contain"
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (!el.dataset.fb) { el.dataset.fb = "1"; el.src = fallback; }
                    else { el.style.display = "none"; (el.nextElementSibling as HTMLElement).style.display = "flex"; }
                  }}
                />
                <div className="hidden h-32 w-32 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <PrinterIcon className="h-12 w-12" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{printer.manufacturer}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{printer.model}</p>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-5 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <DialogTitle className="text-lg">{printer.name}</DialogTitle>
                  <p className="text-xs text-muted-foreground">Detalhes da impressora</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <StatusBadge status={printer.status} />
                  <SeverityBadge severity={printer.severity} label={printer.alertLabel} />
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                <Field label="Local">{printer.location}</Field>
                <Field label="Nome">{printer.name}</Field>
                <Field label="IP"><span className="font-mono text-xs">{printer.ip}</span></Field>
                <Field label="Centro de custo">{printer.centro_custo}</Field>
                <Field label="Páginas impressas">{printer.pages.toLocaleString("pt-BR")}</Field>
                <Field label="Última atualização">{new Date(printer.lastUpdate).toLocaleString("pt-BR")}</Field>
              </dl>

              <div>
                <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  <Droplets className="h-3 w-3" /> Nível de toner
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {printer.toners.map((t) => <TonerBar key={t.color} t={t} />)}
                </div>
              </div>

              {needsToner && (
                <div className="flex justify-end">
                  <Button onClick={() => setPreviewOpen(true)} className="gap-2">
                    <Send className="h-4 w-4" /> Solicitar toner
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TonerRequestPreview printer={printer} open={previewOpen} onOpenChange={setPreviewOpen} />
    </>
  );
}
