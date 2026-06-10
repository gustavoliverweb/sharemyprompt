"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AddToCartButton({
  assetId,
  isLoggedIn,
  inCart: initialInCart,
  compact = false,
}: {
  assetId: string;
  isLoggedIn: boolean;
  inCart: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const [inCart, setInCart] = useState(initialInCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAddToCart() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (inCart) {
      router.push("/cart");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId }),
      });

      if (res.ok) {
        setInCart(true);
        window.dispatchEvent(new Event("cart:item-added"));
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Error al agregar al carrito.");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className={`w-full rounded-pill font-medium transition-all duration-200 disabled:opacity-60 cursor-pointer ${
          compact ? "py-2 text-sm px-4" : "py-3 text-[16px]"
        }`}
        style={{
          background: inCart ? "rgba(98,60,234,0.15)" : "transparent",
          border: "1px solid rgba(98,60,234,0.5)",
          color: inCart ? "#9d7ef7" : "rgba(242,242,242,0.7)",
        }}
      >
        {loading
          ? "Agregando..."
          : inCart
          ? "✓ En carrito"
          : "Añadir al carro"}
      </button>

      {error && (
        <p className="text-[13px] text-center" style={{ color: "#f87171" }}>
          {error}
        </p>
      )}
    </div>
  );
}
