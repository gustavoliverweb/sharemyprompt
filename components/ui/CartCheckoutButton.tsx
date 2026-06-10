"use client";

import { useState } from "react";

export function CartCheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout/cart", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al procesar el pago.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full py-3.5 rounded-pill text-[18px] font-medium text-white transition-all duration-200 hover:opacity-90 disabled:opacity-60 cursor-pointer"
        style={{
          background: "linear-gradient(180deg, #623CEA 0%, #372284 94%)",
          boxShadow: "0 0 20px rgba(98,60,234,0.35)",
        }}
      >
        {loading ? "Procesando..." : "Proceder al pago"}
      </button>

      {error && (
        <p className="text-[13px] text-center" style={{ color: "#f87171" }}>
          {error}
        </p>
      )}
    </div>
  );
}
