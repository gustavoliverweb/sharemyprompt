"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

function CartIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

interface CartBadgeProps {
  variant?: "badge" | "fab";
  /** Pre-fetched count from the server. If omitted, fetched from /api/cart. */
  initialCount?: number;
}

export function CartBadge({ variant = "badge", initialCount }: CartBadgeProps) {
  const { status } = useSession();
  const [count, setCount] = useState(initialCount ?? 0);
  const [pulse, setPulse] = useState(false);

  // Fetch count from API when no initialCount is provided (e.g. Navbar)
  useEffect(() => {
    if (initialCount !== undefined) return;
    if (status !== "authenticated") {
      setCount(0);
      return;
    }
    fetch("/api/cart")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => setCount(d.items?.length ?? 0))
      .catch(() => {});
  }, [status, initialCount]);

  // Sync if parent re-renders with a new initialCount (e.g. after router.refresh)
  useEffect(() => {
    if (initialCount !== undefined) setCount(initialCount);
  }, [initialCount]);

  // Real-time updates when items are added or removed
  useEffect(() => {
    function onItemAdded() {
      setCount((prev) => prev + 1);
      setPulse(true);
      setTimeout(() => setPulse(false), 400);
    }
    function onItemRemoved() {
      setCount((prev) => Math.max(0, prev - 1));
    }
    window.addEventListener("cart:item-added", onItemAdded);
    window.addEventListener("cart:item-removed", onItemRemoved);
    return () => {
      window.removeEventListener("cart:item-added", onItemAdded);
      window.removeEventListener("cart:item-removed", onItemRemoved);
    };
  }, []);

  if (status !== "authenticated") return null;

  const label = `Ir al carrito (${count} artículo${count !== 1 ? "s" : ""})`;

  if (variant === "fab") {
    return (
      <Link
        href="/cart"
        aria-label={label}
        className="fixed top-6 right-8 z-50 flex items-center gap-2.5 rounded-pill px-4 py-2.5 transition-all duration-200 hover:opacity-90 active:scale-95"
        style={{
          background: "linear-gradient(180deg, #623CEA 0%, #372284 94%)",
          boxShadow: "0 4px 20px rgba(98,60,234,0.45)",
        }}
      >
        <span
          className={`relative flex items-center text-white transition-transform duration-200 ${pulse ? "scale-125" : "scale-100"}`}
        >
          <CartIcon />
          {count > 0 && (
            <span
              className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold px-1"
              style={{ background: "#fff", color: "#623CEA" }}
            >
              {count > 99 ? "99+" : count}
            </span>
          )}
        </span>
        <span className="text-[13px] font-semibold text-white leading-none">
          {count === 0 ? "Carrito" : count === 1 ? "1 activo" : `${count} activos`}
        </span>
      </Link>
    );
  }

  // variant="badge" — compact icon for the Navbar
  return (
    <Link
      href="/cart"
      aria-label={label}
      className="relative flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
    >
      <span
        className={`transition-transform duration-200 ${pulse ? "scale-125" : "scale-100"}`}
      >
        <CartIcon />
      </span>
      {count > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold text-white px-1"
          style={{ background: "linear-gradient(180deg, #623CEA 0%, #372284 94%)" }}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
