import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileStack, TrendingUp, BarChart3, LineChart as LineIcon, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { paperConsumption, type PaperPeriod } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/paper")({ component: PaperPage });

const SERIES_COLORS = [
  "oklch(0.55 0.18 252)",
  "oklch(0.65 0.18 28)",
  "oklch(0.65 0.17 145)",
  "oklch(0.7 0.17 60)",
  "oklch(0.6 0.2 300)",
];

const fmt = (n: number) => n.toLocaleString("pt-BR");

function DeltaBadge({ delta }: { delta: number }) {
  const up = delta >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  const sign = up ? "+" : "";
  return (
    <div className="mt-2 flex items-center gap-1.5">
      <span
        className={cn(
          "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums",
          up
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "bg-rose-500/10 text-rose-600 dark:text-rose-400",
        )}
      >
        <Icon className="h-3 w-3" />
        {sign}
        {delta.toFixed(1).replace(".", ",")}%
      </span>
      <span className="text-[11px] text-muted-foreground">vs período anterior</span>
    </div>
  );
}

function PaperPage() {
  const [period, setPeriod] = React.useState<PaperPeriod>("month");
  const [chartType, setChartType] = React.useState<"line" | "bar">("line");
  const [query, setQuery] = React.useState("");

  const data = React.useMemo(() => paperConsumption(period), [period]);

  const chartData = React.useMemo(
    () =>
      data.labels.map((label, i) => {
        const row: Record<string, string | number> = { label };
        data.top5.forEach((p) => {
          row[p.name] = p.series[i];
        });
        return row;
      }),
    [data],
  );

  const tableRows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data.table;
    return data.table.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.ip.includes(q) ||
        r.location.toLowerCase().includes(q),
    );
  }, [data.table, query]);

  const periodLabel =
    period === "week" ? "na semana" : period === "month" ? "no mês" : "no ano";

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Consumo de Papel</h1>
          <p className="text-sm text-muted-foreground">
            Volume de folhas impressas por impressora
          </p>
        </div>
        <ToggleGroup
          type="single"
          value={period}
          onValueChange={(v) => v && setPeriod(v as PaperPeriod)}
          className="rounded-md border bg-card p-1"
        >
          <ToggleGroupItem value="week" className="px-4 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            Semana
          </ToggleGroupItem>
          <ToggleGroupItem value="month" className="px-4 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            Mês
          </ToggleGroupItem>
          <ToggleGroupItem value="year" className="px-4 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
            Ano
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="relative overflow-hidden border-l-4 border-l-primary">
          <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-primary/5 blur-2xl" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total de folhas
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileStack className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tracking-tight tabular-nums">
              {fmt(data.grandTotal)}
            </div>
            <DeltaBadge delta={data.totalDelta} />
            <p className="mt-1 text-xs text-muted-foreground">
              folhas impressas {periodLabel}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-emerald-500">
          <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-emerald-500/5 blur-2xl" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Média diária
            </CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold tracking-tight tabular-nums">
              {fmt(data.dailyAvg)}
            </div>
            <DeltaBadge delta={data.dailyDelta} />
            <p className="mt-1 text-xs text-muted-foreground">
              folhas / dia {periodLabel}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-base">Evolução do consumo</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Top 5 impressoras com maior volume {periodLabel}
            </p>
          </div>
          <ToggleGroup
            type="single"
            value={chartType}
            onValueChange={(v) => v && setChartType(v as "line" | "bar")}
            className="rounded-md border bg-card p-1"
          >
            <ToggleGroupItem
              value="line"
              className="h-8 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              aria-label="Linha"
            >
              <LineIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="bar"
              className="h-8 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              aria-label="Barra"
            >
              <BarChart3 className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </CardHeader>
        <CardContent>
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => fmt(v)}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                  {data.top5.map((p, i) => (
                    <Line
                      key={p.id}
                      type="monotone"
                      dataKey={p.name}
                      stroke={SERIES_COLORS[i]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => fmt(v)}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                  {data.top5.map((p, i) => (
                    <Bar key={p.id} dataKey={p.name} fill={SERIES_COLORS[i]} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-base">Consumo por impressora</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {data.table.length} impressoras · ordenadas por volume {periodLabel}
            </p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome, IP ou local"
              className="h-9 pl-8 text-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-right">Qtd. de Folhas</TableHead>
                  <TableHead className="w-[220px]">% do Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableRows.map((r, i) => (
                  <TableRow key={r.id} className="text-xs">
                    <TableCell className="text-center font-medium text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-mono text-[11px]">{r.ip}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {r.location}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="text-right tabular-nums">{fmt(r.pages)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn(
                              "h-full rounded-full bg-gradient-to-r from-primary to-primary/70",
                            )}
                            style={{ width: `${Math.min(100, r.percent * 4)}%` }}
                          />
                        </div>
                        <span className="w-12 text-right tabular-nums text-muted-foreground">
                          {r.percent.toFixed(1).replace(".", ",")}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {tableRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-xs text-muted-foreground">
                      Nenhuma impressora encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
