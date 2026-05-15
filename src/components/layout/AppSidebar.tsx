import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Printer, Droplets, Boxes, History, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Impressoras", url: "/printers", icon: Printer },
  { title: "Toners", url: "/toners", icon: Droplets },
  { title: "Suprimentos", url: "/supplies", icon: Boxes },
  { title: "Histórico", url: "/history", icon: History },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border/70">
        <Link to="/" className="flex items-center gap-2.5 px-2 py-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-dark text-primary-foreground shadow-[var(--shadow-elegant)]">
            <Printer className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="flex min-w-0 flex-col">
              <span className="text-sm font-semibold leading-tight tracking-tight">Portal SIMEC</span>
              <span className="truncate text-[11px] text-muted-foreground">Monitoramento de Impressoras</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Navegação</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((it) => {
                const active = it.url === "/" ? pathname === "/" : pathname.startsWith(it.url);
                return (
                  <SidebarMenuItem key={it.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={it.title}>
                      <Link
                        to={it.url}
                        className={cn(
                          "group/link flex items-center gap-2.5 rounded-md transition-colors",
                          active && "bg-primary/10 text-primary font-medium",
                        )}
                      >
                        <it.icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                        <span>{it.title}</span>
                        {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Sistema</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Admin (Django)">
                  <a
                    href="/admin/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5"
                  >
                    <ExternalLink className="h-4 w-4 shrink-0" />
                    <span>Admin</span>
                    <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Django
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/70">
        {!collapsed && (
          <div className="px-2 py-2 text-[11px] text-muted-foreground">
            <p className="font-medium text-foreground">Simec</p>
            <p>v1.0 · Frontend mock</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
