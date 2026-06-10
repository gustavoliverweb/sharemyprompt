"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { ASSET_CATEGORIES } from "@/lib/categories"

const TYPE_ITEMS = [
  { value: "PROMPT", label: "Prompts" },
  { value: "FLUJO",  label: "Flujos" },
  { value: "AGENTE", label: "Agentes" },
] as const

function buildFilterUrl(
  searchParams: ReturnType<typeof useSearchParams>,
  updates: Record<string, string | null>,
): string {
  const next = new URLSearchParams(searchParams.toString())
  for (const [key, value] of Object.entries(updates)) {
    if (value === null) next.delete(key)
    else next.set(key, value)
  }
  const str = next.toString()
  return str ? `/explorer?${str}` : "/explorer"
}

const activeStyle = {
  background: "rgba(98,60,234,0.15)",
  color: "#a78bfa",
  borderLeft: "2px solid #623CEA",
} as const

const inactiveStyle = {
  color: "rgba(242,242,242,0.45)",
} as const

function Avatar({ name }: { name?: string | null }) {
  const initials = (name ?? "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("")
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0 select-none"
      style={{ background: "linear-gradient(180deg, #623cea 0%, #372284 94%)" }}
    >
      {initials}
    </div>
  )
}

function SidebarUserSection() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="px-3 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full shrink-0 animate-pulse" style={{ background: "rgba(242,242,242,0.08)" }} />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-2.5 rounded animate-pulse w-24" style={{ background: "rgba(242,242,242,0.08)" }} />
          <div className="h-2 rounded animate-pulse w-16" style={{ background: "rgba(242,242,242,0.06)" }} />
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <Link
        href="/login"
        className="flex items-center justify-center px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors hover:opacity-90"
        style={{
          background: "linear-gradient(180deg, #623cea 0%, #372284 94%)",
          color: "#fff",
        }}
      >
        Iniciar sesión
      </Link>
    )
  }

  const user = session?.user
  const displayName = user?.name ?? user?.username ?? "Usuario"
  const username = (user as { username?: string })?.username

  return (
    <div className="flex flex-col gap-1">
      {/* User identity */}
      <Link
        href="/user-dashboard"
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5 group"
      >
        <Avatar name={displayName} />
        <div className="flex flex-col min-w-0">
          <span
            className="text-[13px] font-medium text-white truncate leading-tight group-hover:text-white/80 transition-colors"
          >
            {displayName}
          </span>
          {username && (
            <span className="text-[11px] truncate leading-tight" style={{ color: "rgba(242,242,242,0.35)" }}>
              @{username}
            </span>
          )}
        </div>
      </Link>

      {/* Sign out */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[12px] font-medium transition-colors hover:bg-white/5"
        style={{ color: "rgba(242,242,242,0.35)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Cerrar sesión
      </button>
    </div>
  )
}

export function ExplorerSidebar() {
  const searchParams = useSearchParams()
  const activeCat = searchParams.get("cat")
  const activeType = searchParams.get("type")
  const hasFilters = !!(searchParams.get("q") || activeCat || activeType)

  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col z-40 overflow-y-auto"
      style={{
        width: "260px",
        background: "rgba(25,24,32,0.97)",
        borderRight: "1px solid rgba(242,242,242,0.08)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Logo */}
      <div className="px-6 pt-8 pb-6" style={{ borderBottom: "1px solid rgba(242,242,242,0.06)" }}>
        <Link
          href="/"
          className="font-bold text-white leading-tight hover:opacity-80 transition-opacity"
          style={{ fontSize: "22px", fontFamily: "var(--font-sans)" }}
        >
          ShareMyPrompt
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-6 px-3 pt-6 flex-1">
        {/* Ver todo */}
        <Link
          href="/explorer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors"
          style={!hasFilters ? activeStyle : inactiveStyle}
        >
          Ver todo
        </Link>

        {/* Categories */}
        <div className="flex flex-col gap-1">
          <p
            className="px-3 text-[11px] font-semibold uppercase tracking-widest mb-1"
            style={{ color: "rgba(242,242,242,0.25)" }}
          >
            Categorías
          </p>
          {ASSET_CATEGORIES.map(({ id, label }) => {
            const isActive = activeCat === id
            const href = buildFilterUrl(searchParams, { cat: isActive ? null : id })
            return (
              <Link
                key={id}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors"
                style={isActive ? activeStyle : inactiveStyle}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* Type filter */}
        <div className="flex flex-col gap-1">
          <p
            className="px-3 text-[11px] font-semibold uppercase tracking-widest mb-1"
            style={{ color: "rgba(242,242,242,0.25)" }}
          >
            Tipo
          </p>
          {TYPE_ITEMS.map(({ value, label }) => {
            const isActive = activeType === value
            const href = buildFilterUrl(searchParams, { type: isActive ? null : value })
            return (
              <Link
                key={value}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors"
                style={isActive ? activeStyle : inactiveStyle}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User section */}
      <div className="px-3 pb-6 pt-4" style={{ borderTop: "1px solid rgba(242,242,242,0.06)" }}>
        <SidebarUserSection />
      </div>
    </aside>
  )
}
