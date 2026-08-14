import { SearchBar } from "@/components/ui/SearchBar";
import { prisma } from "@/lib/db";

async function getStats() {
  const [assetCount, expertCount, ratingAvg] = await Promise.all([
    prisma.asset.count({ where: { status: "PUBLISHED" } }),
    prisma.user.count({ where: { role: { in: ["EXPERTO", "ADMIN"] } } }),
    prisma.review.aggregate({ _avg: { rating: true } }),
  ]);

  return [
    { value: `${assetCount}`, label: "activos verificados" },
    { value: `${expertCount}`, label: "expertos activos" },
    {
      value: ratingAvg._avg.rating ? `${ratingAvg._avg.rating.toFixed(1)}★` : "—",
      label: "valoración media",
    },
  ];
}

export async function HeroSection() {
  const stats = await getStats();

  return (
    <section className="relative bg-surface overflow-hidden pt-40 pb-20">
      {/* Decorative radial glow — matches Figma GRAPHIC at 60% opacity */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary/15 blur-[140px] rounded-full" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-primary/10 blur-[80px] rounded-full" />
        <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-primary-dark/10 blur-[80px] rounded-full" />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-6 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill border border-white/10 bg-white/[0.04] text-xs text-foreground/60 mb-8">
          <span
            className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
            aria-hidden
          />
          Activos verificados bajo el Framework de 6 Pilares
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-[56px] lg:text-[64px] font-bold text-white leading-[1.1] tracking-tight max-w-[20ch] mb-6">
          Ejecuta en segundos lo que a otros les toma horas.
        </h1>

        {/* Sub-headline */}
        <p className="text-base md:text-lg text-foreground/55 max-w-lg mb-10 leading-relaxed">
          Accede al marketplace líder de prompts estructurados y
          automatizaciones verificadas por expertos en IA.
        </p>

        {/* Search bar */}
        <div className="w-full max-w-2xl mb-12">
          <SearchBar />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 md:gap-12">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-foreground/45 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
