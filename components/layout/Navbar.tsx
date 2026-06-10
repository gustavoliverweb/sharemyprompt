"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { CartBadge } from "@/components/ui/CartBadge";
import { ASSET_CATEGORIES } from "@/lib/categories";

const NAV_LINKS = ASSET_CATEGORIES.map(({ id, label }) => ({
  label,
  href: `/explorer?cat=${id}`,
}));

const ACTION_LINKS = [
  { label: "Comenzar a vender", href: "/upload-active" },
  { label: "Explorar", href: "/explorer" },
  { label: "Sobre nosotros", href: "/about" },
];

function AvatarPlaceholder({ name }: { name?: string | null }) {
  const initials = name
    ? name.trim().split(" ").slice(0, 2).map((w) => w[0].toUpperCase()).join("")
    : "U";

  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 select-none"
      style={{ background: "linear-gradient(180deg, #623cea 0%, #372284 94%)" }}
    >
      {initials}
    </div>
  );
}

function UserMenu({ name, role }: { name?: string | null; role?: string | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Menú de usuario"
        className="rounded-full transition-opacity hover:opacity-80"
      >
        <AvatarPlaceholder name={name} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+8px)] w-44 rounded-xl overflow-hidden z-50"
          style={{
            background: "#1f1d2e",
            border: "1px solid rgba(242,242,242,0.08)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <Link
            href="/user-dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-sm text-foreground/70 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Mi panel
          </Link>
          {role === "ADMIN" && (
            <>
              <div style={{ borderTop: "1px solid rgba(242,242,242,0.06)" }} />
              <Link
                href="/admin/expert-requests"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-white/[0.05] transition-colors"
                style={{ color: "#623CEA" }}
              >
                Panel Admin
              </Link>
            </>
          )}
          <div style={{ borderTop: "1px solid rgba(242,242,242,0.06)" }} />
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/[0.05] transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <header className="z-50 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex flex-col gap-2">
        <div className="w-full flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-[36px] tracking-tight text-white shrink-0 hover:text-white/90 transition-colors"
          >
            ShareMyPrompt
          </Link>

          {/* Actions — desktop */}
          <div className="hidden lg:flex items-center gap-4 shrink-0 ml-auto">
            {ACTION_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-[13px] text-foreground/60 hover:text-foreground transition-colors whitespace-nowrap"
              >
                {label}
              </Link>
            ))}

            <CartBadge />

            {isAuthenticated ? (
              <UserMenu name={session?.user?.name} role={session?.user?.role} />
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-b from-[#623CEA] to-[#372284] inline-flex items-center justify-center rounded-pill px-5 py-2 text-[13px] font-medium text-foreground hover:brightness-125 transition-all duration-200 whitespace-nowrap"
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Mobile: avatar si está logueado, hamburger siempre */}
          <div className="lg:hidden ml-auto flex items-center gap-3">
            {isAuthenticated && <UserMenu name={session?.user?.name} role={session?.user?.role} />}
            <button
              className="flex flex-col gap-1.5 p-1"
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
        </div>

        {/* Category nav — desktop */}
        <nav
          className="hidden lg:flex items-center gap-6 flex-1"
          aria-label="Categorías"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-[13px] text-foreground/60 hover:text-foreground transition-colors rounded-lg hover:bg-white/[0.06] whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className="lg:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? "500px" : "0px" }}
      >
        <nav className="flex flex-col px-6 pb-5 gap-1" aria-label="Menú móvil">
          {ACTION_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="text-[14px] text-foreground/70 hover:text-foreground py-2.5 border-b border-white/[0.06] transition-colors"
            >
              {label}
            </Link>
          ))}
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="text-[14px] text-foreground/70 hover:text-foreground py-2.5 border-b border-white/[0.06] transition-colors"
            >
              {label}
            </Link>
          ))}

          {isAuthenticated ? (
            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="mt-3 inline-flex items-center justify-center rounded-pill px-5 py-2.5 text-[14px] font-medium text-red-400 border border-red-400/30 hover:bg-red-400/10 transition-all duration-200"
            >
              Cerrar sesión
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="mt-3 inline-flex items-center justify-center rounded-pill px-5 py-2.5 text-[14px] font-medium text-white transition-all duration-200 hover:opacity-90"
              style={{
                background: "linear-gradient(180deg, #623cea 0%, #372284 94%)",
                boxShadow: "0 0 14px rgba(98,60,234,0.35)",
              }}
            >
              Iniciar sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
