"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}

function ExploreIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}

function DashboardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2v13" />
      <path d="M8 6l4-4 4 4" />
      <path d="M20 16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3" />
    </svg>
  )
}

function AdminIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function FinancesIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="6" y1="20" x2="6" y2="16" />
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

const BASE_NAV = [
  { icon: <HomeIcon />,      label: "Inicio",    href: "/"              },
  { icon: <ExploreIcon />,   label: "Explorar",  href: "/explorer"      },
  { icon: <DashboardIcon />, label: "Dashboard", href: "/user-dashboard" },
]

const UPLOAD_NAV   = { icon: <UploadIcon />,   label: "Subir",    href: "/upload-active"          }
const FINANCE_NAV  = { icon: <FinancesIcon />, label: "Finanzas", href: "/finances"                }
const ADMIN_NAV    = { icon: <AdminIcon />,    label: "Admin",    href: "/admin/expert-requests"   }

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(href + "/")
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role      = session?.user?.role
  const canUpload = role === "EXPERTO" || role === "ADMIN"
  const isAdmin   = role === "ADMIN"

  const navItems = isAdmin
    ? [...BASE_NAV, UPLOAD_NAV, FINANCE_NAV, ADMIN_NAV]
    : canUpload
    ? [...BASE_NAV, UPLOAD_NAV, FINANCE_NAV]
    : BASE_NAV

  return (
    <aside
      className="fixed z-40 bottom-0 left-0 right-0 h-[60px] md:top-0 md:right-auto md:h-screen md:w-[72px] flex flex-row md:flex-col items-center justify-around md:justify-start md:pt-8 md:pb-8 border-t md:border-t-0"
      style={{
        background: "rgba(255,255,255,0.018)",
        borderRight: "1px solid rgba(242,242,242,0.08)",
        borderColor: "rgba(242,242,242,0.08)",
      }}
    >
      <nav className="flex flex-row md:flex-col items-center gap-6 md:flex-1">
        {navItems.map(({ icon, label, href }) => {
          const active = isActive(pathname, href)
          return (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-1.5 rounded-lg p-2 transition-colors"
              style={
                active
                  ? { background: "rgba(0,245,255,0.1)", color: "var(--color-primary)" }
                  : { color: "rgba(242,242,242,0.3)" }
              }
              aria-label={label}
            >
              {icon}
              <span className="hidden md:block text-[9px] font-medium tracking-wide uppercase">{label}</span>
            </Link>
          )
        })}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex flex-col items-center gap-1.5 rounded-lg p-2 transition-colors hover:text-foreground/60"
        style={{ color: "rgba(242,242,242,0.3)" }}
        aria-label="Cerrar sesión"
      >
        <LogoutIcon />
        <span className="hidden md:block text-[9px] font-medium tracking-wide uppercase">Salir</span>
      </button>
    </aside>
  )
}
