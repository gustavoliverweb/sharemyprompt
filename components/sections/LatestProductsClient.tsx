"use client";

import Link from "next/link";
import { useState } from "react";
import { SimpleProductCard } from "@/components/ui/SimpleProductCard";
import { ASSET_CATEGORIES } from "@/lib/categories";

export interface LatestProduct {
  id: string;
  title: string;
  author: string;
  price: string;
  image: string | null;
  href: string;
  type: "PROMPT" | "FLUJO" | "AGENTE";
  rating: number;
  category: string | null;
}

const ALL = "todas";

function Tag({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center h-10 px-4 rounded-[4px] text-[13px] text-foreground/90 transition-colors w-full"
      style={{
        background: "rgba(242,242,242,0.1)",
        border: `2px solid ${active ? "#623CEA" : "transparent"}`,
      }}
    >
      {label}
    </button>
  );
}

export function LatestProductsClient({ products }: { products: LatestProduct[] }) {
  const [activeTag, setActiveTag] = useState(ALL);

  const filtered =
    activeTag === ALL ? products : products.filter((p) => p.category === activeTag);

  const tags = [{ id: ALL, label: "Todas las categorías" }, ...ASSET_CATEGORIES];

  return (
    <div className="flex flex-col gap-10 w-full">
      {/* Category tags */}
      <div>
        {/* Mobile: select */}
        <select
          value={activeTag}
          onChange={(e) => setActiveTag(e.target.value)}
          className="md:hidden w-full h-10 px-4 rounded-[4px] text-[13px] text-foreground appearance-none"
          style={{
            background: "rgba(242,242,242,0.1)",
            border: "2px solid #623CEA",
          }}
        >
          {tags.map((t) => (
            <option key={t.id} value={t.id} style={{ background: "#191820" }}>
              {t.label}
            </option>
          ))}
        </select>

        {/* Desktop: grid */}
        <div
          className="hidden md:grid gap-3"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}
        >
          {tags.map((t) => (
            <Tag
              key={t.id}
              label={t.label}
              active={activeTag === t.id}
              onClick={() => setActiveTag(t.id)}
            />
          ))}
        </div>
      </div>

      {/* Product grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((p) => (
            <SimpleProductCard key={p.id} {...p} />
          ))}
        </div>
      ) : (
        <p className="text-center text-foreground/50 py-12">
          No hay activos publicados en esta categoría aún.
        </p>
      )}

      {/* CTA */}
      <div className="flex justify-center">
        <Link
          href="/explorer"
          className="inline-flex items-center justify-center rounded-pill px-8 py-2 text-base font-normal text-white transition-opacity hover:opacity-90"
          style={{
            background:
              "linear-gradient(180deg, rgba(98,60,234,1) 0%, rgba(55,34,132,1) 94%)",
            boxShadow: "0px 0px 16px 4px rgba(98,60,234,0.3)",
          }}
        >
          Ver más novedades
        </Link>
      </div>
    </div>
  );
}
