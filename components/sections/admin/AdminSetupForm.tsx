"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function AdminSetupForm() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "No se pudo completar el setup");
      return;
    }

    // Refresca la sesión del cliente ahora mismo — sin esto, el Navbar
    // seguiría mostrando el rol anterior hasta reenfocar la ventana.
    await update();
    router.push("/admin/expert-requests");
    router.refresh();
  }

  return (
    <div className="w-full max-w-[440px] flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-bold text-white">
          Configurar el primer administrador
        </h1>
        <p className="text-sm text-foreground/60">
          Ingresa el token de bootstrap definido en el servidor (variable{" "}
          <code className="text-foreground/80">ADMIN_SETUP_TOKEN</code>) para
          convertir tu cuenta en ADMIN. Solo funciona mientras no exista
          ningún administrador todavía.
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="token" className="text-sm text-foreground/60">
            Token de bootstrap
          </label>
          <input
            id="token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder:text-foreground/25 focus:outline-none focus:border-primary/50 transition-colors text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-400 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-pill font-bold text-sm text-white transition-all duration-200 hover:opacity-90 mt-2 disabled:opacity-60"
          style={{
            background: "linear-gradient(180deg, #623cea 0%, #372284 94%)",
            boxShadow: "0 0 20px rgba(98,60,234,0.35)",
          }}
        >
          {loading ? "Configurando..." : "Convertirme en administrador"}
        </button>
      </form>
    </div>
  );
}
