import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { StatusDonutChart } from "@/components/dashboard/StatusDonutChart";
import { AlertsDonutChart } from "@/components/dashboard/AlertsDonutChart";
import { PaperDonutChart } from "@/components/dashboard/PaperDonutChart";
import { PrintersTable } from "@/components/dashboard/PrintersTable";
import { PrinterDetailModal } from "@/components/dashboard/PrinterDetailModal";
import type { Printer } from "@/lib/mock-data";

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  const [selected, setSelected] = React.useState<Printer | null>(null);
  const [open, setOpen] = React.useState(false);
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <DashboardCards />
      <div className="grid gap-4 xl:grid-cols-3">
        <StatusDonutChart />
        <AlertsDonutChart />
        <PaperDonutChart />
      </div>
      <PrintersTable onSelect={(p) => { setSelected(p); setOpen(true); }} />
      <PrinterDetailModal printer={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}
