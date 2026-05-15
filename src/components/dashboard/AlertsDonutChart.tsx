import { DonutChart, type DonutDatum } from "./DonutChart";
import { alertsChart } from "@/lib/mock-data";

const colors: Record<string, string> = {
  sem_alerta: "var(--success)",
  substituir_toner: "var(--danger)",
  offline: "oklch(0.45 0.18 28)",
  erro_comunicacao: "var(--warning)",
  outro: "var(--neutral)",
};

export function AlertsDonutChart() {
  const raw = alertsChart();
  const data: DonutDatum[] = raw.map((d) => ({
    key: d.key,
    label: d.label,
    value: d.value,
    percent: d.percent,
    color: colors[d.key],
    rows: [
      { label: "Quantidade", value: `${d.value} impressoras` },
      { label: "Porcentagem", value: d.percent.toFixed(1).replace(".", ",") + "%" },
    ],
    details: [{ label: "Impressoras", values: d.printers }],
  }));
  const totalAlerts = raw.filter((d) => d.key !== "sem_alerta").reduce((s, d) => s + d.value, 0);
  return (
    <DonutChart
      title="Alertas"
      subtitle="Categorias detectadas na frota"
      data={data}
      tooltipHeader="Alerta"
      centerLabel={{ value: totalAlerts, label: "Com alerta" }}
    />
  );
}
