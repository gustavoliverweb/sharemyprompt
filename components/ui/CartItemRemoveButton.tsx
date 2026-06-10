"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CartItemRemoveButton({ assetId }: { assetId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRemove() {
    setLoading(true);
    try {
      const res = await fetch(`/api/cart/${assetId}`, { method: "DELETE" });
      if (res.ok) window.dispatchEvent(new Event("cart:item-removed"));
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      aria-label="Eliminar del carrito"
      className="text-[13px] transition-colors disabled:opacity-40 cursor-pointer"
      style={{ color: "rgba(242,242,242,0.4)" }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(242,242,242,0.4)")}
    >
      {loading ? "..." : "Eliminar"}
    </button>
  );
}
