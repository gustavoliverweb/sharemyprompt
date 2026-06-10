import Link from "next/link";

const NAV_COLUMNS = [
  {
    heading: "Marketplace",
    links: [{ label: "Explorar", href: "/explore" }],
  },
  {
    heading: "Estadísticas",
    links: [
      { label: "Ranking", href: "/ranking" },
      { label: "Actividad", href: "/activity" },
    ],
  },
  {
    heading: "Recursos",
    links: [
      { label: "Blogs", href: "/blog" },
      { label: "Ayuda", href: "/help" },
      { label: "FAQs", href: "/faq" },
    ],
  },
  {
    heading: "Mi cuenta",
    links: [{ label: "Perfil", href: "/profile" }],
  },
];

function TwitterIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.16 8.16 0 0 0 4.77 1.52V6.82a4.85 4.85 0 0 1-1-.13z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    icon: <TwitterIcon />,
    href: "https://twitter.com/sharemyprompt",
    label: "Twitter",
  },
  {
    icon: <LinkedInIcon />,
    href: "https://linkedin.com/company/sharemyprompt",
    label: "LinkedIn",
  },
  {
    icon: <InstagramIcon />,
    href: "https://instagram.com/sharemyprompt",
    label: "Instagram",
  },
  {
    icon: <YouTubeIcon />,
    href: "https://youtube.com/@sharemyprompt",
    label: "YouTube",
  },
  {
    icon: <TikTokIcon />,
    href: "https://tiktok.com/@sharemyprompt",
    label: "TikTok",
  },
  {
    icon: <DiscordIcon />,
    href: "https://discord.gg/sharemyprompt",
    label: "Discord",
  },
];

export function Footer() {
  return (
    <footer className="bg-surface mt-[160px] md:px-[120px] lg:px-[240px]">
      {/* Top gradient separator */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, rgba(98,60,234,0) 9%, rgba(98,60,234,1) 50%, rgba(98,60,234,0) 92%)",
        }}
      />

      <div
        className="max-w-[1440px] mx-auto px-6 flex flex-col"
        style={{ paddingTop: "32px", paddingBottom: "28px" }}
      >
        {/* Giant logo */}
        <p
          className="text-white font-bold uppercase text-center w-full"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(31px, 7.15vw, 103px)",
            lineHeight: 1.167,
          }}
        >
          ShareMyPrompt
        </p>

        {/* Info + Nav columns */}
        <div
          className="flex flex-col lg:flex-row gap-16 mt-12 lg:mt-[88px] "
          // style={{ marginTop: "88px", columnGap: "191px" }}
        >
          {/* Info block */}
          <div className="flex flex-col gap-10 lg:w-[309px] shrink-0">
            <p className="text-white text-[16px] leading-[1.5]">
              ShareMyPrompt es el marketplace de ingeniería de IA donde el
              conocimiento técnico se convierte en activos rentables. Impulsamos
              la productividad global mediante prompts estructurados y
              automatizaciones verificadas bajo estándares de alta precisión.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
                  style={{
                    color: "rgba(242,242,242,0.7)",
                    border: "1px solid rgba(242,242,242,0.15)",
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation columns */}
          <div className="flex flex-wrap gap-10">
            {NAV_COLUMNS.map(({ heading, links }) => (
              <div key={heading} className="flex flex-col gap-5">
                <p className="text-white text-[18px] font-bold leading-[1.333]">
                  {heading}
                </p>
                <div className="flex flex-col gap-4">
                  {links.map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="text-[14px] leading-[1.571] uppercase transition-colors hover:text-white"
                      style={{ color: "#B9B8BB" }}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <p
          className="text-center text-[14px] uppercase leading-[1.571] mt-16"
          style={{ color: "#565660" }}
        >
          Copyright © 2026 ShareMyPrompt. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
