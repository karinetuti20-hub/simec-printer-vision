import { Outlet, useRouterState } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ThemeToggle } from "./ThemeToggle";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const titles: Record<string, { title: string; sub: string }> = {
  "/": { title: "Dashboard", sub: "Visão geral em tempo real da frota" },
  "/printers": { title: "Impressoras", sub: "Inventário completo da frota" },
  "/toners": { title: "Toners", sub: "Estoque e níveis por impressora" },
  "/supplies": { title: "Suprimentos", sub: "Insumos e consumíveis" },
  "/history": { title: "Histórico", sub: "Eventos e mudanças de status" },
};

export function AppLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const meta = titles[pathname] ?? { title: "Portal SIMEC", sub: "" };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/70 bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold leading-tight">{meta.title}</h1>
              <p className="text-xs text-muted-foreground">{meta.sub}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar impressora, IP, local…" className="h-9 w-72 pl-9" />
              </div>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Notificações">
                <Bell className="h-4 w-4" />
              </Button>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
