import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardSidebar } from "@/components/sections/user-dashboard/DashboardSidebar";
import { FinancesSummaryCards } from "@/components/sections/finanzas/FinancesSummaryCards";
import { FinancesAssetsTable } from "@/components/sections/finanzas/FinancesAssetsTable";

export default async function FinanzasPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "EXPERTO" && session.user.role !== "ADMIN") {
    redirect("/user-dashboard");
  }

  const assets = await prisma.asset.findMany({
    where: { userId: session.user.id },
    include: {
      purchases: { select: { amount: true, createdAt: true } },
      reviews:   { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const allPurchases = assets.flatMap((a) => a.purchases);
  const totalRevenue  = allPurchases.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalSales    = allPurchases.length;
  const publishedCount = assets.filter((a) => a.status === "PUBLISHED").length;
  const allRatings    = assets.flatMap((a) => a.reviews).map((r) => r.rating);
  const avgRating     =
    allRatings.length > 0
      ? allRatings.reduce((s, r) => s + r, 0) / allRatings.length
      : null;

  const assetsData = assets.map((a) => ({
    id:          a.id,
    title:       a.title,
    type:        a.type,
    status:      a.status,
    price:       Number(a.price),
    salesCount:  a.purchases.length,
    revenue:     a.purchases.reduce((sum, p) => sum + Number(p.amount), 0),
    avgRating:
      a.reviews.length > 0
        ? a.reviews.reduce((s, r) => s + r.rating, 0) / a.reviews.length
        : null,
    reviewCount: a.reviews.length,
  }));

  const recentSales = assets
    .flatMap((a) =>
      a.purchases.map((p) => ({
        assetTitle: a.title,
        amount:     Number(p.amount),
        createdAt:  p.createdAt,
      }))
    )
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 8);

  return (
    <div className="flex min-h-screen bg-surface 2xl:pr-[240px]">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 md:ml-[72px]">
        {/* Header */}
        <div
          className="flex items-center px-4 md:px-8 pt-6 md:pt-8 pb-4 md:pb-5"
          style={{ borderBottom: "0.5px solid #623CEA" }}
        >
          <h1 className="text-2xl md:text-[36px] font-medium text-white leading-[1.17]">
            Finanzas
          </h1>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-8 px-4 md:px-8 pt-6 md:pt-8 pb-20 mb-[60px] md:mb-0">
          <FinancesSummaryCards
            totalRevenue={totalRevenue}
            totalSales={totalSales}
            publishedCount={publishedCount}
            avgRating={avgRating}
          />

          <FinancesAssetsTable assets={assetsData} />

          {recentSales.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="text-[18px] font-semibold text-white">Ventas recientes</h2>
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(242,242,242,0.1)" }}
              >
                {recentSales.map((sale, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-5 py-3.5"
                    style={{
                      borderBottom:
                        i < recentSales.length - 1
                          ? "1px solid rgba(242,242,242,0.06)"
                          : undefined,
                      background: i % 2 === 0 ? "rgba(242,242,242,0.02)" : "transparent",
                    }}
                  >
                    <span className="text-[14px] font-medium text-white truncate max-w-[60%]">
                      {sale.assetTitle}
                    </span>
                    <div className="flex items-center gap-6 shrink-0">
                      <span className="text-[13px]" style={{ color: "rgba(242,242,242,0.45)" }}>
                        {sale.createdAt.toLocaleDateString("es-MX", {
                          day:   "numeric",
                          month: "short",
                          year:  "numeric",
                        })}
                      </span>
                      <span className="text-[14px] font-semibold" style={{ color: "#24C65F" }}>
                        {sale.amount === 0 ? "Gratis" : `$${sale.amount.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
