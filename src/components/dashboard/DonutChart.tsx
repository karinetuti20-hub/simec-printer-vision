import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface DonutDatum {
  key: string;
  label: string;
  value: number;
  percent: number;
  color: string;
  /** Optional structured details rendered in the tooltip */
  details?: { label: string; values: string[] }[];
  /** Or simple key/value rows */
  rows?: { label: string; value: string }[];
}

function MultilineTooltip({ active, payload, header }: any) {
  if (!active || !payload?.length) return null;
  const d: DonutDatum = payload[0].payload;
  return (
    <div className="rounded-xl border border-border/70 bg-popover/95 px-4 py-3 text-popover-foreground shadow-[var(--shadow-elegant)] backdrop-blur supports-[backdrop-filter]:bg-popover/80 min-w-[220px]">
      <div className="flex items-center gap-2 border-b border-border/60 pb-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{header}</p>
      </div>
      <div className="space-y-1.5 pt-2 text-sm">
        <p className="font-medium">{d.label}</p>
        {d.rows?.map((r) => (
          <p key={r.label} className="flex justify-between gap-4 text-muted-foreground">
            <span>{r.label}:</span>
            <span className="font-medium text-foreground">{r.value}</span>
          </p>
        ))}
        {d.details?.map((dt) => (
          <div key={dt.label} className="pt-1">
            <p className="text-xs font-semibold text-muted-foreground">{dt.label}:</p>
            <ul className="mt-0.5 space-y-0.5">
              {dt.values.length === 0 && <li className="text-xs italic text-muted-foreground">—</li>}
              {dt.values.slice(0, 6).map((v) => (
                <li key={v} className="text-xs text-foreground">• {v}</li>
              ))}
              {dt.values.length > 6 && (
                <li className="text-xs italic text-muted-foreground">+{dt.values.length - 6} mais</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DonutChart({
  title,
  subtitle,
  data,
  tooltipHeader,
  centerLabel,
}: {
  title: string;
  subtitle?: string;
  data: DonutDatum[];
  tooltipHeader: string;
  centerLabel?: { value: string | number; label: string };
}) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card className="flex flex-col gap-4 border bg-card p-5">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.1fr] items-center">
        <div className="relative h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius="62%"
                outerRadius="92%"
                paddingAngle={2}
                stroke="var(--background)"
                strokeWidth={2}
                onMouseEnter={(_, idx) => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              >
                {data.map((d, i) => (
                  <Cell
                    key={d.key}
                    fill={d.color}
                    opacity={hovered === null || hovered === i ? 1 : 0.4}
                    style={{ transition: "opacity 200ms" }}
                  />
                ))}
              </Pie>
              <Tooltip
                cursor={false}
                wrapperStyle={{ outline: "none", zIndex: 50 }}
                content={<MultilineTooltip header={tooltipHeader} />}
              />
            </PieChart>
          </ResponsiveContainer>
          {centerLabel && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-semibold tabular-nums">{centerLabel.value}</p>
              <p className="text-xs text-muted-foreground">{centerLabel.label}</p>
            </div>
          )}
        </div>
        <ul className="space-y-2">
          {data.map((d, i) => (
            <li
              key={d.key}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm transition-colors",
                hovered === i ? "bg-muted" : "hover:bg-muted/60",
              )}
            >
              <span className="flex items-center gap-2 truncate">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
                <span className="truncate text-foreground">{d.label}</span>
              </span>
              <span className="flex items-center gap-3 tabular-nums">
                <span className="text-muted-foreground">{d.value}</span>
                <span className="w-12 text-right text-xs text-muted-foreground">
                  {total === 0 ? "0%" : d.percent.toFixed(1).replace(".", ",") + "%"}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
