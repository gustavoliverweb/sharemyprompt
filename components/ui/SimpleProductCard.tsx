"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/ui/AddToCartButton";

export interface SimpleProductCardProps {
  id: string;
  title: string;
  author: string;
  price: string;
  image: string | null;
  href: string;
  type?: "PROMPT" | "FLUJO" | "AGENTE";
  isLoggedIn?: boolean;
  inCart?: boolean;
}

const TYPE_GRADIENT: Record<string, string> = {
  PROMPT: "linear-gradient(135deg, rgba(98,60,234,0.45) 0%, rgba(25,24,32,1) 100%)",
  FLUJO:  "linear-gradient(135deg, rgba(251,146,60,0.35) 0%, rgba(25,24,32,1) 100%)",
  AGENTE: "linear-gradient(135deg, rgba(34,197,94,0.3) 0%, rgba(25,24,32,1) 100%)",
};

const TYPE_LABEL: Record<string, string> = {
  PROMPT: "Prompt",
  FLUJO:  "Flujo",
  AGENTE: "Agente",
};

export function SimpleProductCard({ id, title, author, price, image, href, type, isLoggedIn = false, inCart = false }: SimpleProductCardProps) {
  const gradient = type ? (TYPE_GRADIENT[type] ?? TYPE_GRADIENT.PROMPT) : TYPE_GRADIENT.PROMPT;

  return (
    <Link
      href={href}
      className="group flex-1 flex flex-col rounded-[8px] border overflow-hidden transition-all duration-200 hover:border-white/50"
      style={{ borderColor: "rgba(242,242,242,0.3)", height: "421px" }}
    >
      {/* Image — 219px */}
      <div className="relative shrink-0" style={{ height: "219px" }}>
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 z-10"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
        <div className="absolute inset-0" style={{ background: gradient }} aria-hidden />
        {type && (
          <span
            className="absolute top-3 left-3 z-20 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded"
            style={{ background: "rgba(0,0,0,0.45)", color: "rgba(242,242,242,0.7)" }}
          >
            {TYPE_LABEL[type]}
          </span>
        )}
      </div>

      {/* Content — 202px, space-between */}
      <div className="flex flex-col justify-between flex-1 p-4" style={{ height: "202px" }}>
        {/* Top: title + author */}
        <div className="flex flex-col gap-1">
          <p className="text-[16px] font-bold text-foreground leading-[1.625] line-clamp-2">
            {title}
          </p>
          <p
            className="text-xs leading-[1.5]"
            style={{ fontFamily: "var(--font-secondary)", color: "#999999" }}
          >
            por{" "}
            <span className="hover:text-foreground/60 transition-colors">{author}</span>
          </p>
        </div>

        {/* Bottom: price + add to cart */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-[16px] font-bold text-white shrink-0">{price}</p>
          {/* Stop click from bubbling to the Link */}
          <div onClick={(e) => e.preventDefault()} className="flex-1">
            <AddToCartButton assetId={id} isLoggedIn={isLoggedIn} inCart={inCart} compact />
          </div>
        </div>
      </div>
    </Link>
  );
}
