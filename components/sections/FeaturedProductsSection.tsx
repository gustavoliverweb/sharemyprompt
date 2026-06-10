import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { prisma } from "@/lib/db";

function formatPrice(price: { toString(): string }): string {
  const n = parseFloat(price.toString());
  return n === 0 ? "Gratis" : `$${n.toFixed(2)}`;
}

function avgRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

interface FeaturedProductsSectionProps {
  className?: string;
}

export async function FeaturedProductsSection({
  className = "",
}: FeaturedProductsSectionProps) {
  const assets = await prisma.asset.findMany({
    where: { status: "PUBLISHED" },
    include: {
      _count: { select: { purchases: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: [{ purchases: { _count: "desc" } }, { createdAt: "desc" }],
    take: 4,
  });

  const products = assets.map((asset) => ({
    id: asset.id,
    title: asset.title,
    description: asset.description ?? "",
    price: formatPrice(asset.price),
    rating: avgRating(asset.reviews),
    sales: asset._count.purchases,
    image: asset.coverImage ?? "/images/categories/category-bg-1.png",
    href: `/p/${asset.slug}`,
  }));

  return (
    <section className={`bg-surface ${className}`}>
      <div className="max-w-[1440px] mx-auto px-6 flex flex-col lg:flex-row items-center lg:items-stretch gap-16 lg:gap-24">
        {/* Sidebar */}
        <div className="lg:w-[330px] shrink-0 flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-[31px] font-bold text-white leading-[1.302]">
              Productos destacados
            </h2>
            <p className="text-base text-foreground/70 leading-[1.302]">
              Optimiza tu stack con nuestras herramientas más potentes y
              descargadas de la semana.
            </p>
          </div>

          <Link
            href="/explorer"
            className="inline-flex items-center justify-center rounded-pill px-8 py-2 text-base font-medium text-white transition-opacity hover:opacity-90 w-fit"
            style={{
              background:
                "linear-gradient(180deg, rgba(98,60,234,1) 0%, rgba(55,34,132,1) 94%)",
              boxShadow: "0px 0px 16px 4px rgba(98,60,234,0.3)",
            }}
          >
            Ver todos los productos
          </Link>
        </div>

        {/* Grid */}
        {products.length > 0 ? (
          <div className="flex-1 flex flex-col gap-8 w-full">
            <div className="flex flex-col sm:flex-row gap-8">
              {products.slice(0, 2).map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
            {products.length > 2 && (
              <div className="flex flex-col sm:flex-row gap-8">
                {products.slice(2, 4).map((p) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-foreground/50 text-base">
              Pronto habrá productos disponibles.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
