"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AcquireButton({
  assetId,
  price,
  isLoggedIn,
}: {
  assetId: string;
  price: string;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAcquire() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al procesar la compra.");
        setLoading(false);
        return;
      }

      // Redirigir a Stripe Checkout (pago) o a la página del activo (gratis)
      window.location.href = data.url;
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleAcquire}
        disabled={loading}
        className="w-full py-3.5 rounded-pill text-[20px] font-medium text-white transition-all duration-200 hover:opacity-90 disabled:opacity-60 cursor-pointer"
        style={{
          background: "linear-gradient(180deg, #623CEA 0%, #372284 94%)",
          boxShadow: "0 0 20px rgba(98,60,234,0.35)",
        }}
      >
        {loading
          ? "Procesando..."
          : !isLoggedIn
          ? "Inicia sesión para adquirir"
          : price === "Gratis"
          ? "Obtener gratis"
          : `Adquirir — ${price}`}
      </button>

      {error && (
        <p className="text-[13px] text-center" style={{ color: "#f87171" }}>
          {error}
        </p>
      )}
    </div>
  );
}
