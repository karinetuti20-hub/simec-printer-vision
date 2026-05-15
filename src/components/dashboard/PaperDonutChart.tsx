import { DonutChart, type DonutDatum } from "./DonutChart";
import { paperChart } from "@/lib/mock-data";

const palette = [
  "oklch(0.5 0.16 252)",
  "oklch(0.62 0.16 240)",
  "oklch(0.7 0.14 220)",
  "oklch(0.72 0.13 200)",
  "oklch(0.68 0.13 180)",
  "oklch(0.6 0.14 165)",
  "oklch(0.58 0.16 145)",
  "oklch(0.7 0.16 90)",
  "oklch(0.7 0.18 60)",
  "oklch(0.62 0.2 28)",
];

export function PaperDonutChart() {
  const raw = paperChart();
  const data: DonutDatum[] = raw.map((d, i) => ({
    key: d.key,
    label: d.label,
    value: d.value,
    percent: d.percent,
    color: palette[i % palette.length],
    rows: [
      { label: "Local", value: d.location },
      { label: "Páginas", value: d.value.toLocaleString("pt-BR") },
      { label: "Porcentagem", value: d.percent.toFixed(1).replace(".", ",") + "%" },
    ],
  }));
  const total = raw.reduce((s, d) => s + d.value, 0);
  return (
    <DonutChart
      title="Papéis — Top 10"
      subtitle="Volume de impressão por impressora"
      data={data}
      tooltipHeader="Impressora"
      centerLabel={{ value: total.toLocaleString("pt-BR"), label: "Páginas" }}
    />
  );
}
