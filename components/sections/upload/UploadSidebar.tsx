import Link from "next/link";

function HomeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-house-icon lucide-house"
    >
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="4" height="18" rx="1" />
      <rect x="9" y="3" width="4" height="18" rx="1" />
      <path d="M15 3l4 18" />
    </svg>
  );
}

const NAV_ITEMS = [
  { icon: <HomeIcon />, label: "Home", href: "/", active: false },
  {
    icon: <DashboardIcon />,
    label: "Dashboard",
    href: "/dashboard",
    active: true,
  },
  { icon: <LibraryIcon />, label: "Librería", href: "/library", active: false },
];

export function UploadSidebar() {
  return (
    <aside
      className="fixed z-40 bottom-0 left-0 right-0 h-[60px] md:top-0 md:right-auto md:h-screen md:w-[72px] flex flex-row md:flex-col items-center justify-around md:justify-start md:pt-8 md:gap-7 border-t md:border-t-0 md:border-r border-white/[0.05]"
      style={{ background: "rgba(255,255,255,0.018)" }}
    >
      {NAV_ITEMS.map(({ icon, label, href, active }) => (
        <Link
          key={label}
          href={href}
          className={`flex flex-col items-center gap-1.5 transition-colors ${
            active
              ? "text-white"
              : "text-foreground/30 hover:text-foreground/60"
          }`}
        >
          {icon}
          <span className="hidden md:block text-[9px] font-medium tracking-wide uppercase">
            {label}
          </span>
        </Link>
      ))}
    </aside>
  );
}
