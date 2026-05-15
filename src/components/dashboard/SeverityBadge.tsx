import { cn } from "@/lib/utils";
import type { AlertSeverity } from "@/lib/mock-data";
import { AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";

const map: Record<AlertSeverity, { cls: string; Icon: typeof AlertTriangle; pulse?: boolean }> = {
  ok: { cls: "bg-success/10 text-success border-success/20", Icon: CheckCircle2 },
  warning: { cls: "bg-warning/15 text-warning-foreground border-warning/40 dark:text-warning", Icon: AlertTriangle },
  critical: { cls: "bg-danger/10 text-danger border-danger/30", Icon: AlertCircle, pulse: true },
};

export function SeverityBadge({ severity, label }: { severity: AlertSeverity; label: string }) {
  const c = map[severity];
  const Icon = c.Icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", c.cls, c.pulse && "animate-soft-pulse")}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
