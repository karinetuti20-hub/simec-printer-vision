import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import type { Printer } from "@/lib/mock-data";
import { Info, Copy, Check } from "lucide-react";
import * as React from "react";

export function TonerRequestPreview({
  printer,
  open,
  onOpenChange,
}: {
  printer: Printer | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [copied, setCopied] = React.useState(false);
  if (!printer) return null;
  const items = printer.toners
    .filter((t) => t.status === "substituir")
    .map((t) => ({
      product_type: `toner_${t.color}`,
      ca_number: t.ca_number,
      status: "substituir toner",
    }));

  const payload = {
    printer_id: printer.id,
    printer_name: printer.name,
    model: printer.model,
    manufacturer: printer.manufacturer,
    location: printer.location,
    ip: printer.ip,
    centro_custo: printer.centro_custo,
    requested_items: items,
  };
  const json = JSON.stringify(payload, null, 2);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <div className="mx-auto w-full max-w-3xl px-6 pb-8">
          <DrawerHeader className="px-0">
            <DrawerTitle>Prévia da solicitação de toner</DrawerTitle>
            <DrawerDescription>
              Dados que serão enviados ao Protheus para a impressora{" "}
              <span className="font-medium text-foreground">{printer.name}</span>.
            </DrawerDescription>
          </DrawerHeader>

          <div className="mt-2 flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">
            <Info className="mt-0.5 h-4 w-4 text-warning" />
            <p className="text-warning-foreground dark:text-warning">
              Função de envio ao Protheus será implementada futuramente.
            </p>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border bg-muted/40">
            <div className="flex items-center justify-between border-b border-border/70 bg-muted/60 px-4 py-2 text-xs font-medium text-muted-foreground">
              <span>payload.json</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5"
                onClick={() => { navigator.clipboard.writeText(json); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copiado" : "Copiar"}
              </Button>
            </div>
            <pre className="max-h-80 overflow-auto p-4 font-mono text-xs leading-relaxed text-foreground">
{json}
            </pre>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
            <Button disabled>Enviar ao Protheus</Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
