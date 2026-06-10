import Link from "next/link";

const STATS = [
  { value: "15K+", label: "Horas ahorradas" },
  { value: "20K", label: "Expertos activos" },
  { value: "100K+", label: "Ventas" },
];

export function AboutStaticsSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex flex-col items-center gap-12">
          {/* Stats row — transparent, subtle shadow, border-radius 10px */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-[88px] w-full sm:px-14 py-8 rounded-xl shadow-[0_0_30px_0_rgba(0,0,0,0.07)]">
            {STATS.map(({ value, label }, i) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                {/* Divider between stats on desktop */}
                {i > 0 && (
                  <span
                    className="hidden sm:block absolute w-px h-10 bg-white/10 -translate-x-[calc(88px/2+0.5px)]"
                    aria-hidden
                  />
                )}
                <span className="font-display text-[40px] sm:text-[48px] md:text-[60px] lg:text-[72px] xl:text-[95px] font-normal leading-none text-[#F2F2F2]">
                  {value}
                </span>
                <span className="font-body text-sm font-medium text-foreground/50 tracking-wide">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA block — centered, max-width 766px */}
          <div className="flex flex-col items-center gap-8 max-w-[766px] text-center">
            <p className="text-xl md:text-2xl lg:text-[28px] font-medium text-white leading-snug">
              Desde el prompt que inspira hasta el agente que ejecuta. Estamos
              construyendo el futuro de la productividad técnica.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6">
              {/* Outline button — transparent + white border + purple glow */}
              <Link
                href="/explore"
                className="inline-flex items-center justify-center rounded-pill border border-white px-8 py-2 text-sm font-bold text-white transition-all duration-200 hover:bg-white/5"
                style={{ boxShadow: "0 0 16px 4px rgba(98,60,234,0.3)" }}
              >
                Explorar el marketplace
              </Link>

              {/* Gradient button — purple gradient + purple glow */}
              <Link
                href="/sell"
                className="inline-flex items-center justify-center rounded-pill px-8 py-2 text-sm font-bold text-white transition-all duration-200 hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(180deg, #623cea 0%, #372284 94%)",
                  boxShadow: "0 0 16px 4px rgba(98,60,234,0.3)",
                }}
              >
                Convertirme en arquitecto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
