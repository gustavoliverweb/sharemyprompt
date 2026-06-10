"use client";

import Link from "next/link";
import { useState } from "react";
import { SimpleProductCard } from "@/components/ui/SimpleProductCard";

/* ─── Data ──────────────────────────────────────────────────────────────── */

const TAGS = [
  "Todas la categorías",
  "IA para E-commerce",
  "Recursos Humanos",
  "Finanzas & Fintech",
  "Ingeniería de Aprendizaje",
  "Investigación Científica",
  "Arquitectura y Diseño",
  "Storytelling",
  "Juegos y recursos",
  "Ciencia de datos",
  "Servicio al Cliente",
];

interface LatestProduct {
  id: string;
  title: string;
  author: string;
  price: string;
  image: string;
  href: string;
}

const PRODUCTS: LatestProduct[] = [
  {
    id: "seo-descripciones",
    title: "Generador Masivo: Descripciones de Productos SEO",
    author: "7iquid in Creative",
    price: "$49.99",
    image: "/images/latest-products/product-seo-descripciones.png",
    href: "/p/generador-masivo-descripciones-seo",
  },
  {
    id: "onboarding-saas",
    title: "Flujo Completo: Onboarding de Clientes SaaS",
    author: "7iquid in Creative",
    price: "$49.99",
    image: "/images/latest-products/product-onboarding-saas.png",
    href: "/p/flujo-completo-onboarding-saas",
  },
  {
    id: "asistente-sql",
    title: "Asistente SQL: Convierte Lenguaje Natural en Consultas Complejas",
    author: "7iquid in Creative",
    price: "$49.99",
    image: "/images/latest-products/product-asistente-sql.png",
    href: "/p/asistente-sql-lenguaje-natural",
  },
  {
    id: "lora-arquitectura",
    title: "LoRA Especializado: Renders de Arquitectura Interior Fotorrealista",
    author: "7iquid in Creative",
    price: "$49.99",
    image: "/images/latest-products/product-lora-arquitectura.png",
    href: "/p/lora-renders-arquitectura-interior",
  },
  {
    id: "contratos-nda",
    title: "Analizador de Contratos NDAs: Identificación de Riesgos",
    author: "7iquid in Creative",
    price: "$49.99",
    image: "/images/latest-products/product-contratos-nda.png",
    href: "/p/analizador-contratos-nda",
  },
  {
    id: "curriculos-socratico",
    title: "Creador de Currículos de Estudio Socrático",
    author: "7iquid in Creative",
    price: "$49.99",
    image: "/images/latest-products/product-curriculos-socratico.png",
    href: "/p/creador-curriculos-estudio-socratico",
  },
  {
    id: "limpieza-csv",
    title: "Script de Limpieza y Análisis de Datos CSV",
    author: "7iquid in Creative",
    price: "$49.99",
    image: "/images/latest-products/product-limpieza-csv.png",
    href: "/p/script-limpieza-analisis-datos-csv",
  },
  {
    id: "guiones-youtube",
    title: "Master Prompt: Guiones de YouTube de Alta Retención (Engagement)",
    author: "7iquid in Creative",
    price: "$49.99",
    image: "/images/latest-products/product-guiones-youtube.png",
    href: "/p/master-prompt-guiones-youtube",
  },
];

/* ─── Sub-components ─────────────────────────────────────────────────────── */

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

/* ─── Section ────────────────────────────────────────────────────────────── */

export function LatestProductsSection({
  className = "",
}: {
  className?: string;
}) {
  const [activeTag, setActiveTag] = useState(TAGS[0]);

  return (
    <section className={`bg-surface ${className}`}>
      <div className="max-w-[1440px] mx-auto px-6 flex flex-col items-center gap-12">
        {/* Header */}
        <div className="flex flex-col gap-6 text-center max-w-[1339px] w-full">
          <h2 className="text-[32px] font-normal text-foreground leading-[1.25]">
            Explora nuestros últimos activos y automatizaciones
          </h2>
          <p className="text-lg text-foreground/70 leading-[1.5] max-w-3xl mx-auto">
            Revisamos meticulosamente cada nueva entrada de nuestra comunidad,
            una por una, para garantizar que cumplan con los más altos
            estándares de ingeniería de prompts y eficiencia lógica.
          </p>
        </div>

        {/* Tags + Grid + Button */}
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
              {TAGS.map((tag) => (
                <option key={tag} value={tag} style={{ background: "#191820" }}>
                  {tag}
                </option>
              ))}
            </select>

            {/* Desktop: single grid, even columns */}
            <div
              className="hidden md:grid gap-3"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              }}
            >
              {TAGS.map((tag) => (
                <Tag
                  key={tag}
                  label={tag}
                  active={activeTag === tag}
                  onClick={() => setActiveTag(tag)}
                />
              ))}
            </div>
          </div>

          {/* Product grid */}
          <div className="flex flex-col gap-8">
            {/* Row 1 */}
            <div className="flex flex-col md:flex-row gap-8">
              {PRODUCTS.slice(0, 4).map((p) => (
                <SimpleProductCard key={p.id} {...p} />
              ))}
            </div>
            {/* Row 2 */}
            <div className="flex flex-col md:flex-row gap-8">
              {PRODUCTS.slice(4, 8).map((p) => (
                <SimpleProductCard key={p.id} {...p} />
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <Link
              href="/explore"
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
      </div>
    </section>
  );
}
