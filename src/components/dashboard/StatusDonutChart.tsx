import { DonutChart, type DonutDatum } from "./DonutChart";
import { statusChart, summary } from "@/lib/mock-data";

const colors: Record<string, string> = {
  online: "var(--success)",
  offline: "var(--danger)",
  unknown: "var(--neutral)",
};

export function StatusDonutChart() {
  const data: DonutDatum[] = statusChart().map((d) => ({
    key: d.key,
    label: d.label,
    value: d.value,
    percent: d.percent,
    color: colors[d.key],
    rows: [
      { label: "Quantidade", value: `${d.value} impressoras` },
      { label: "Porcentagem", value: d.percent.toFixed(1).replace(".", ",") + "%" },
    ],
    details: [{ label: "Locais", values: d.locations }],
  }));
  const s = summary();
  return (
    <DonutChart
      title="Status das impressoras"
      subtitle="Distribuição em tempo real"
      data={data}
      tooltipHeader="Status"
      centerLabel={{ value: s.total, label: "Total" }}
    />
  );
}
