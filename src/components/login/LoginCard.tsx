import { useState, type FormEvent } from "react";
import { Loader2, Lock, User, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
const logoSrc = "/static/imgs/simec-logo.png";

export function LoginCard({ logoAnimated }: { logoAnimated: boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!username || !password) {
      setError("Informe usuário e senha.");
      return;
    }
    setLoading(true);
    // Mocked behaviour — future integration:
    // await fetch("/api/v1/auth/login", { method: "POST", body: JSON.stringify({ username, password }) })
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setError("Usuário ou senha inválidos.");
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-border/70 bg-card p-8 shadow-[0_30px_80px_-40px_rgba(0,63,125,0.35)]">
        <div className="flex h-16 items-center justify-center">
          {/* Placeholder reserves space when the intro logo animates in */}
          {!logoAnimated ? (
            <div className="h-16 w-full" aria-hidden />
          ) : (
            <img
              src={logoSrc}
              alt="SIMEC"
              className="h-14 w-auto object-contain animate-fade-in"
            />
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-xs font-medium text-muted-foreground">
              Usuário
            </Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 pl-9"
                placeholder="seu.usuario"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
              Senha
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 pl-9"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="min-h-[20px]">
            {error && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-destructive animate-fade-in">
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full bg-primary text-base font-medium shadow-[0_8px_24px_-8px_rgba(0,91,170,0.6)] hover:bg-primary-dark"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Entrando…
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-[11px] text-muted-foreground">
        © {new Date().getFullYear()} SIMEC — Acesso restrito a colaboradores.
      </p>
    </div>
  );
}
