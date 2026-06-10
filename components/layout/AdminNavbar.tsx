"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

function HomeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export function AdminNavbar() {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-3"
      style={{
        background: "rgba(25,24,32,0.92)",
        borderBottom: "1px solid rgba(242,242,242,0.07)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Brand */}
      <Link
        href="/"
        className="text-[13px] font-bold tracking-tight text-white hover:opacity-80 transition-opacity"
      >
        ShareMyPrompt
      </Link>

      {/* Badge */}
      <span
        className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
        style={{ background: "rgba(98,60,234,0.18)", color: "#9b87f5", border: "1px solid rgba(98,60,234,0.3)" }}
      >
        Admin
      </span>

      {/* Actions */}
      <nav className="flex items-center gap-1">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors hover:bg-white/[0.06]"
          style={{ color: "rgba(242,242,242,0.5)" }}
        >
          <HomeIcon />
          Inicio
        </Link>
        <Link
          href="/user-dashboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors hover:bg-white/[0.06]"
          style={{ color: "rgba(242,242,242,0.5)" }}
        >
          <DashboardIcon />
          Mi dashboard
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors hover:bg-red-500/10"
          style={{ color: "rgba(226,85,85,0.8)" }}
        >
          <LogoutIcon />
          Salir
        </button>
      </nav>
    </header>
  );
}
