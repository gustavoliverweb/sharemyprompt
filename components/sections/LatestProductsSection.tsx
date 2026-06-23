import { prisma } from "@/lib/db";
import { LatestProductsClient, type LatestProduct } from "./LatestProductsClient";

function formatPrice(price: { toString(): string }): string {
  const n = parseFloat(price.toString());
  return n === 0 ? "Gratis" : `$${n.toFixed(2)}`;
}

function avgRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

export async function LatestProductsSection({ className = "" }: { className?: string }) {
  const assets = await prisma.asset.findMany({
    where: { status: "PUBLISHED" },
    include: {
      user: { select: { username: true, name: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  const products: LatestProduct[] = assets.map((asset) => ({
    id: asset.id,
    title: asset.title,
    author: asset.user.name ?? asset.user.username,
    price: formatPrice(asset.price),
    image: asset.coverImage ?? null,
    href: `/p/${asset.slug}`,
    type: asset.type as "PROMPT" | "FLUJO" | "AGENTE",
    rating: avgRating(asset.reviews),
    category: asset.category,
  }));

  return (
    <section className={`bg-surface ${className}`}>
      <div className="max-w-[1440px] mx-auto px-6 flex flex-col items-center gap-12">
        {/* Header */}
        <div className="flex flex-col gap-6 text-center max-w-[1339px] w-full">
          <h2 className="text-[32px] font-normal text-foreground leading-[1.25]">
            Explora nuestros últimos activos y automatizaciones
          </h2>
          <p className="text-lg text-foreground/70 leading-[1.5] max-w-3xl mx-auto">
            Revisamos meticulosamente cada nueva entrada de nuestra comunidad,
            una por una, para garantizar que cumplan con los más altos
            estándares de ingeniería de prompts y eficiencia lógica.
          </p>
        </div>

        {/* Interactive tags + grid + CTA */}
        <LatestProductsClient products={products} />
      </div>
    </section>
  );
}
