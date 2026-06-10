"use client";

import Link from "next/link";
import { useState } from "react";

interface AuthNavbarProps {
  ctaLabel: string;
  ctaHref: string;
  ctaVariant: "gradient" | "outline";
}

export function AuthNavbar({ ctaLabel, ctaHref, ctaVariant }: AuthNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-[28px] sm:text-[36px] tracking-tight text-white shrink-0 hover:text-white/90 transition-colors"
        >
          ShareMyPrompt
        </Link>

        {/* CTA — desktop only */}
        {ctaVariant === "gradient" ? (
          <Link
            href={ctaHref}
            className="hidden sm:inline-flex items-center justify-center rounded-pill px-5 py-2 text-[13px] font-medium text-white transition-all duration-200 hover:opacity-90"
            style={{
              background: "linear-gradient(180deg, #623cea 0%, #372284 94%)",
              boxShadow: "0 0 14px rgba(98,60,234,0.35)",
            }}
          >
            {ctaLabel}
          </Link>
        ) : (
          <Link
            href={ctaHref}
            className="hidden sm:inline-flex items-center justify-center rounded-pill border border-white/25 px-5 py-2 text-[13px] font-medium text-foreground hover:border-white/50 hover:bg-white/5 transition-all duration-200"
          >
            {ctaLabel}
          </Link>
        )}

        {/* Mobile hamburger */}
        <button
          className="sm:hidden ml-auto flex flex-col gap-1.5 p-1"
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setIsOpen((o) => !o)}
        >
          <span
            className="block w-5 h-px bg-foreground/70 transition-transform duration-300 origin-center"
            style={isOpen ? { transform: "translateY(7px) rotate(45deg)" } : undefined}
          />
          <span
            className="block w-5 h-px bg-foreground/70 transition-opacity duration-300"
            style={isOpen ? { opacity: 0 } : undefined}
          />
          <span
            className="block w-5 h-px bg-foreground/70 transition-transform duration-300 origin-center"
            style={isOpen ? { transform: "translateY(-7px) rotate(-45deg)" } : undefined}
          />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className="sm:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? "200px" : "0px" }}
      >
        <div className="px-6 pb-5 pt-2">
          {ctaVariant === "gradient" ? (
            <Link
              href={ctaHref}
              onClick={() => setIsOpen(false)}
              className="w-full inline-flex items-center justify-center rounded-pill px-5 py-2.5 text-[14px] font-medium text-white transition-all duration-200 hover:opacity-90"
              style={{
                background: "linear-gradient(180deg, #623cea 0%, #372284 94%)",
                boxShadow: "0 0 14px rgba(98,60,234,0.35)",
              }}
            >
              {ctaLabel}
            </Link>
          ) : (
            <Link
              href={ctaHref}
              onClick={() => setIsOpen(false)}
              className="w-full inline-flex items-center justify-center rounded-pill border border-white/25 px-5 py-2.5 text-[14px] font-medium text-foreground hover:border-white/50 hover:bg-white/5 transition-all duration-200"
            >
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
