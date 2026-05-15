import { cn } from "@/lib/utils";
import type { PrinterStatus } from "@/lib/mock-data";

const map: Record<PrinterStatus, { label: string; cls: string; dotCls: string; pulse?: boolean }> = {
  online: { label: "Online", cls: "bg-success/10 text-success border-success/20", dotCls: "bg-success" },
  offline: { label: "Offline", cls: "bg-danger/10 text-danger border-danger/30", dotCls: "bg-danger", pulse: true },
  unknown: { label: "Desconhecido", cls: "bg-neutral/15 text-muted-foreground border-neutral/20", dotCls: "bg-neutral" },
};

export function StatusBadge({ status }: { status: PrinterStatus }) {
  const c = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", c.cls)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dotCls, c.pulse && "animate-soft-pulse")} />
      {c.label}
    </span>
  );
}
