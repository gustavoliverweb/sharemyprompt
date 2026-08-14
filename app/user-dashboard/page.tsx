import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { DashboardSidebar } from "@/components/sections/user-dashboard/DashboardSidebar";
import { AssetsLibrary } from "@/components/sections/user-dashboard/AssetsLibrary";
import { DashboardRightPanel } from "@/components/sections/user-dashboard/DashboardRightPanel";

export default async function UserDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; cart_paid?: string }>;
}) {
  const [session, sp] = await Promise.all([auth(), searchParams]);
  if (!session?.user) redirect("/login");

  // Retorno del carrito desde Stripe — reconciliar por si el webhook aún no procesó
  if (sp.cart_paid === "1" && sp.session_id) {
    try {
      const stripeSession = await stripe.checkout.sessions.retrieve(sp.session_id);
      if (
        stripeSession.payment_status === "paid" &&
        stripeSession.metadata?.type === "cart" &&
        stripeSession.metadata?.userId === session.user.id &&
        stripeSession.metadata?.assetIds
      ) {
        const ids = stripeSession.metadata.assetIds.split(",").filter(Boolean);
        const amount = (stripeSession.amount_total ?? 0) / 100 / (ids.length || 1);

        await prisma.$transaction([
          ...ids.map((id) =>
            prisma.purchase.upsert({
              where: { userId_assetId: { userId: session.user.id, assetId: id } },
              update: { stripeSessionId: stripeSession.id },
              create: { userId: session.user.id, assetId: id, amount, stripeSessionId: stripeSession.id },
            })
          ),
          prisma.cartItem.deleteMany({
            where: { userId: session.user.id, assetId: { in: ids } },
          }),
        ]);
      }
    } catch {
      // session_id inválida o expirada — ignorar, el webhook es la fuente de verdad
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      expertRequest: true,
      assets: {
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          rejectionReason: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!user) redirect("/login");

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
            Welcome,{" "}
            <span style={{ color: "rgba(242,242,242,0.55)" }}>
              @{user.username}
            </span>
          </h1>
        </div>

        {/* Main content */}
        <div className="flex flex-col md:flex-row gap-6 px-4 md:px-8 pt-6 md:pt-8 pb-20 mb-[60px] md:mb-0 md:items-start justify-between">
          <AssetsLibrary />
          <DashboardRightPanel
            role={user.role}
            expertRequest={user.expertRequest}
            assets={user.assets}
          />
        </div>
      </div>
    </div>
  );
}
