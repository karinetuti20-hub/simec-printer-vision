export type PrinterStatus = "online" | "offline" | "unknown";
export type AlertSeverity = "ok" | "warning" | "critical";
export type AlertKind =
  | "sem_alerta"
  | "substituir_toner"
  | "offline"
  | "erro_comunicacao"
  | "outro";

export interface TonerInfo {
  color: "black" | "cyan" | "magenta" | "yellow";
  level: number; // 0-100
  status: "ok" | "low" | "substituir";
  ca_number: string;
}

export interface Printer {
  id: number;
  name: string;
  model: string;
  manufacturer: string;
  ip: string;
  location: string;
  status: PrinterStatus;
  alert: AlertKind;
  alertLabel: string;
  severity: AlertSeverity;
  toners: TonerInfo[];
  centro_custo: string;
  pages: number;
  lastUpdate: string;
}

const locations = ["Almoxarifado", "Expedição", "Produção", "Financeiro", "RH", "Manutenção", "Recepção"];
const models = [
  { model: "DCP-L1632W", manufacturer: "BROTHER" },
  { model: "DCP-L2540DW", manufacturer: "BROTHER" },
  { model: "IR-C3326I", manufacturer: "CANON" },
  { model: "MFP-4303", manufacturer: "HP" },
  { model: "K-4350", manufacturer: "SAMSUNG" },
];

function rand<T>(arr: T[], i: number) { return arr[i % arr.length]; }

export const printers: Printer[] = Array.from({ length: 39 }).map((_, i) => {
  const m = rand(models, i * 3 + 1);
  const loc = rand(locations, i * 2 + 1);
  const isColor = m.model === "IR-C3326I";
  const offline = i % 17 === 5 || i % 23 === 7;
  const needsToner = !offline && (i % 11 === 3 || i % 13 === 4);
  const warnLow = !offline && !needsToner && i % 9 === 2;
  const commErr = !offline && !needsToner && !warnLow && i % 19 === 6;

  let status: PrinterStatus = offline ? "offline" : "online";
  if (i % 29 === 11) status = "unknown";

  let alert: AlertKind = "sem_alerta";
  let alertLabel = "Sem alerta";
  let severity: AlertSeverity = "ok";

  if (offline) { alert = "offline"; alertLabel = "Offline"; severity = "critical"; }
  else if (needsToner) { alert = "substituir_toner"; alertLabel = "Substituir toner"; severity = "critical"; }
  else if (commErr) { alert = "erro_comunicacao"; alertLabel = "Erro de comunicação"; severity = "warning"; }
  else if (warnLow) { alert = "outro"; alertLabel = "Toner baixo"; severity = "warning"; }

  const toners: TonerInfo[] = isColor
    ? (["black", "cyan", "magenta", "yellow"] as const).map((c, k) => {
        const lvl = needsToner && (c === "cyan" || c === "magenta") ? 4 : Math.max(8, 90 - ((i + k) * 11) % 80);
        return {
          color: c,
          level: lvl,
          status: lvl < 8 ? "substituir" : lvl < 25 ? "low" : "ok",
          ca_number: `31990${k}`,
        };
      })
    : [{
        color: "black",
        level: needsToner ? 5 : Math.max(15, 95 - (i * 7) % 80),
        status: needsToner ? "substituir" : "ok",
        ca_number: "319901",
      }];

  return {
    id: i + 1,
    name: `CAR_PRINT_${String(i + 1).padStart(3, "0")}`,
    model: m.model,
    manufacturer: m.manufacturer,
    ip: `10.159.173.${20 + i}`,
    location: loc,
    status,
    alert,
    alertLabel,
    severity,
    toners,
    centro_custo: ["301050", "301060", "302010", "401020"][i % 4],
    pages: 2000 + ((i * 1373) % 12000),
    lastUpdate: new Date(Date.now() - i * 1000 * 60 * 17).toISOString(),
  };
});

export function summary() {
  const total = printers.length;
  const online = printers.filter((p) => p.status === "online").length;
  const offline = printers.filter((p) => p.status === "offline").length;
  const withAlert = printers.filter((p) => p.severity !== "ok").length;
  const replaceToner = printers.filter((p) => p.alert === "substituir_toner").length;
  return { total, online, offline, withAlert, replaceToner };
}

export function statusChart() {
  const groups: Record<PrinterStatus, Printer[]> = { online: [], offline: [], unknown: [] };
  printers.forEach((p) => groups[p.status].push(p));
  const total = printers.length;
  return (Object.entries(groups) as [PrinterStatus, Printer[]][]).map(([k, list]) => ({
    key: k,
    label: k === "online" ? "Online" : k === "offline" ? "Offline" : "Desconhecido",
    value: list.length,
    percent: (list.length / total) * 100,
    locations: Array.from(new Set(list.map((p) => p.location))),
  }));
}

export function alertsChart() {
  const order: AlertKind[] = ["sem_alerta", "substituir_toner", "offline", "erro_comunicacao", "outro"];
  const labels: Record<AlertKind, string> = {
    sem_alerta: "Sem alerta",
    substituir_toner: "Substituir toner",
    offline: "Offline",
    erro_comunicacao: "Erro de comunicação",
    outro: "Outros alertas",
  };
  const total = printers.length;
  return order.map((k) => {
    const list = printers.filter((p) => p.alert === k);
    return {
      key: k,
      label: labels[k],
      value: list.length,
      percent: (list.length / total) * 100,
      printers: list.map((p) => p.name),
    };
  });
}

export function paperChart() {
  const top = [...printers].sort((a, b) => b.pages - a.pages).slice(0, 10);
  const totalTop = top.reduce((s, p) => s + p.pages, 0);
  return top.map((p) => ({
    key: p.name,
    label: p.name,
    location: p.location,
    value: p.pages,
    percent: (p.pages / totalTop) * 100,
  }));
}

export type PaperPeriod = "week" | "month" | "year";

function seeded(n: number) {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}

/**
 * Generates a per-printer consumption series for the requested period.
 * - week  : 7 daily buckets
 * - month : 30 daily buckets
 * - year  : 12 monthly buckets
 */
export function paperConsumption(period: PaperPeriod) {
  const buckets =
    period === "week" ? 7 : period === "month" ? 30 : 12;
  const labels: string[] =
    period === "year"
      ? ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
      : Array.from({ length: buckets }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (buckets - 1 - i));
          return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
        });

  // Per-printer scaled totals for the period
  const scale = period === "week" ? 0.05 : period === "month" ? 0.22 : 1;

  const perPrinter = printers.map((p) => {
    const total = Math.round(p.pages * scale);
    // distribute across buckets with seeded variance
    const weights = Array.from({ length: buckets }).map(
      (_, i) => 0.5 + seeded(p.id * 31 + i * 7),
    );
    const sumW = weights.reduce((a, b) => a + b, 0);
    const series = weights.map((w) => Math.round((w / sumW) * total));
    return {
      id: p.id,
      name: p.name,
      ip: p.ip,
      location: p.location,
      series,
      total: series.reduce((a, b) => a + b, 0),
    };
  });

  const grandTotal = perPrinter.reduce((s, p) => s + p.total, 0);
  const days = period === "year" ? 365 : period === "month" ? 30 : 7;
  const dailyAvg = Math.round(grandTotal / days);

  const top5 = [...perPrinter].sort((a, b) => b.total - a.total).slice(0, 5);

  const table = perPrinter
    .map((p) => ({
      id: p.id,
      name: p.name,
      ip: p.ip,
      location: p.location,
      pages: p.total,
      percent: grandTotal > 0 ? (p.total / grandTotal) * 100 : 0,
    }))
    .sort((a, b) => b.pages - a.pages);

  return { labels, top5, table, grandTotal, dailyAvg };
}
