import Link from "next/link";
import { SearchBar } from "@/components/ui/SearchBar";
import { SimpleProductCard } from "@/components/ui/SimpleProductCard";
import { ExplorerSidebar } from "@/components/sections/explorer/ExplorerSidebar";
import { CartBadge } from "@/components/ui/CartBadge";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { ASSET_CATEGORIES } from "@/lib/categories";
import type { AssetType } from "@/app/generated/prisma/enums";

function formatPrice(price: { toString(): string }): string {
  const n = parseFloat(price.toString());
  return n === 0 ? "Gratis" : `$${n.toFixed(2)}`;
}

function avgRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

type PageSearchParams = Promise<{ q?: string; cat?: string; type?: string }>;

export default async function ExplorerPage({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const [{ q, cat, type }, session] = await Promise.all([
    searchParams,
    auth(),
  ]);
  const hasFilters = !!(q || cat || type);
  const isLoggedIn = !!session?.user;

  const cartSet = new Set<string>();
  if (session?.user?.id) {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      select: { assetId: true },
    });
    cartItems.forEach((item) => cartSet.add(item.assetId));
  }

  // When ?q= is set, also match category IDs and labels so that
  // typing "marketing" finds assets in the "marketing" category
  const qLower = q?.toLowerCase() ?? "";
  const matchingCatIds = q
    ? ASSET_CATEGORIES.filter(
        (c) =>
          c.id.includes(qLower) ||
          c.label.toLowerCase().includes(qLower)
      ).map((c) => c.id)
    : [];

  const assets = await prisma.asset.findMany({
    where: {
      status: "PUBLISHED",
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          ...(matchingCatIds.length > 0 ? [{ category: { in: matchingCatIds } }] : []),
        ],
      }),
      ...(cat && { category: cat }),
      ...(type && { type: type as AssetType }),
    },
    orderBy: { updatedAt: "desc" },
    include: {
      user: { select: { username: true, name: true } },
      reviews: { select: { rating: true } },
    },
  });

  // Build sections for the ungrouped view
  let sections: { id: string; label: string; items: typeof assets }[] = [];
  if (!hasFilters) {
    const byCategory = new Map<string, typeof assets>();
    for (const asset of assets) {
      const key = asset.category ?? "otros";
      if (!byCategory.has(key)) byCategory.set(key, []);
      byCategory.get(key)!.push(asset);
    }
    for (const { id, label } of ASSET_CATEGORIES) {
      const items = byCategory.get(id);
      if (items?.length) sections.push({ id, label, items });
    }
    const otros = byCategory.get("otros");
    if (otros?.length) sections.push({ id: "otros", label: "Otros", items: otros });
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <ExplorerSidebar />
      {isLoggedIn && <CartBadge variant="fab" initialCount={cartSet.size} />}

      <main className="flex-1 flex flex-col min-w-0" style={{ marginLeft: "260px" }}>
        <div
          className="pointer-events-none absolute top-0 left-[260px] right-0 h-[400px] opacity-[0.12] -z-0"
          style={{
            background: "radial-gradient(ellipse at 50% -10%, #5D35FF 0%, #3AF4BC 50%, transparent 70%)",
            filter: "blur(60px)",
          }}
          aria-hidden
        />

        <div className="relative z-10 px-10 pt-16 pb-32 flex flex-col gap-16">
          <div className="flex justify-center">
            <div className="w-full max-w-[600px]">
              <SearchBar />
            </div>
          </div>

          {hasFilters ? (
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <p className="text-[14px]" style={{ color: "rgba(242,242,242,0.5)" }}>
                  {assets.length} resultado{assets.length !== 1 ? "s" : ""}
                  {q && (
                    <>
                      {" "}para{" "}
                      <span className="text-white font-medium">&ldquo;{q}&rdquo;</span>
                    </>
                  )}
                </p>
                <Link
                  href="/explorer"
                  className="text-[13px] transition-opacity hover:opacity-70"
                  style={{ color: "#a78bfa" }}
                >
                  Limpiar filtros
                </Link>
              </div>

              {assets.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-24">
                  <p className="text-[18px] font-semibold text-white">Sin resultados</p>
                  <p className="text-[14px]" style={{ color: "rgba(242,242,242,0.4)" }}>
                    Intenta con otros términos o categorías.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {assets.map((asset) => (
                    <SimpleProductCard
                      key={asset.id}
                      id={asset.id}
                      title={asset.title}
                      author={asset.user.name ?? `@${asset.user.username}`}
                      price={formatPrice(asset.price)}
                      image={asset.coverImage}
                      href={`/p/${asset.slug}`}
                      type={asset.type as AssetType}
                      rating={avgRating(asset.reviews)}
                      isLoggedIn={isLoggedIn}
                      inCart={cartSet.has(asset.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : sections.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-24">
              <p className="text-[18px] font-semibold text-white">El marketplace está casi listo</p>
              <p className="text-[14px]" style={{ color: "rgba(242,242,242,0.4)" }}>
                Pronto habrá activos publicados por nuestros expertos.
              </p>
            </div>
          ) : (
            sections.map(({ id, label, items }) => (
              <section key={id} id={id} className="flex flex-col gap-5 scroll-mt-8">
                <div className="flex items-center justify-between">
                  <h2
                    className="text-white font-bold leading-[1.68]"
                    style={{ fontSize: "25px", fontFamily: "var(--font-sans)" }}
                  >
                    {label}
                  </h2>
                  <Link
                    href={`/explorer?cat=${id}`}
                    className="text-[16px] text-white leading-[1.3] hover:opacity-70 transition-opacity"
                  >
                    Ver más
                  </Link>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {items.map((asset) => (
                    <SimpleProductCard
                      key={asset.id}
                      id={asset.id}
                      title={asset.title}
                      author={asset.user.name ?? `@${asset.user.username}`}
                      price={formatPrice(asset.price)}
                      image={asset.coverImage}
                      href={`/p/${asset.slug}`}
                      type={asset.type as AssetType}
                      rating={avgRating(asset.reviews)}
                      isLoggedIn={isLoggedIn}
                      inCart={cartSet.has(asset.id)}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
