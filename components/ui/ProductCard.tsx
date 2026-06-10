"use client";

import Image from "next/image";
import Link from "next/link";

export interface ProductCardProps {
  title: string;
  description: string;
  price: string;
  rating: number;
  sales: number;
  image: string;
  href: string;
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#FDD64B" aria-hidden>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function ProductCard({
  title,
  description,
  price,
  rating,
  sales,
  image,
  href,
}: ProductCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex-1 min-h-[455px] max-h-[455px] rounded-[16px] border border-white/30 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Background image */}
      <Image
        src={image}
        alt=""
        // width={491}
        // height={455}
        fill
        className="w-full } object-cover transition-transform duration-500 group-hover:scale-105"
        // style={{ width: "100%", height: "auto" }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(25,24,32,0) 0%, rgba(25,24,32,0.9) 100%)",
        }}
        aria-hidden
      />

      {/* Glass header */}
      <div
        className="absolute top-0 left-0 right-0 flex flex-row gap-4 p-4"
        style={{
          backdropFilter: "blur(16px)",
          background: "rgba(25,25,33,0.2)",
        }}
      >
        <div className="flex flex-col gap-2 flex-1">
          <p className="text-[20px] font-bold text-white leading-[1.3]">
            {title}
          </p>
          <p className="text-sm text-white/80 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
        <div className="flex flex-col gap-2">
          <p className="text-[20px] font-bold text-white leading-[1.3]">
            {price}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <StarIcon />
              <span className="text-sm text-white">{rating.toFixed(1)}</span>
            </div>
            <span className="text-sm font-medium text-white/70">
              ({sales} ventas)
            </span>
          </div>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-pill px-8 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/10"
          style={{ border: "2px solid #623CEA" }}
          onClick={(e) => e.preventDefault()}
          aria-label={`Añadir al carro: ${title}`}
        >
          Añadir al carro
        </button>
      </div>
    </Link>
  );
}
