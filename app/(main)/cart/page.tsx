import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CartCheckoutButton } from "@/components/ui/CartCheckoutButton";
import { CartItemRemoveButton } from "@/components/ui/CartItemRemoveButton";

const TYPE_LABEL: Record<string, string> = {
  PROMPT: "Prompt",
  FLUJO: "Flujo",
  AGENTE: "Agente de IA",
};

function formatPrice(price: { toString(): string }): string {
  const n = parseFloat(price.toString());
  return n === 0 ? "Gratis" : `$${n.toFixed(2)}`;
}

export const metadata = {
  title: "Tu carrito — ShareMyPrompt",
};

export default async function CartPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      asset: {
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          type: true,
          coverImage: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const activeItems = items.filter((i) => i.asset.status === "PUBLISHED");

  const total = activeItems.reduce(
    (sum, i) => sum + parseFloat(i.asset.price.toString()),
    0
  );

  const hasFreeOnly =
    activeItems.length > 0 && activeItems.every((i) => parseFloat(i.asset.price.toString()) === 0);

  return (
    <main className="pt-[114px] pb-24 min-h-screen" style={{ background: "#191820" }}>
      <div className="max-w-screen-xl mx-auto px-6">
        <h1 className="text-[32px] font-bold text-white mb-8">
          Tu carrito
          {activeItems.length > 0 && (
            <span className="text-[20px] font-normal ml-3" style={{ color: "rgba(242,242,242,0.4)" }}>
              ({activeItems.length} {activeItems.length === 1 ? "artículo" : "artículos"})
            </span>
          )}
        </h1>

        {activeItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Items list */}
            <div className="flex-1 flex flex-col gap-4">
              {activeItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-xl"
                  style={{
                    background: "rgba(25,25,33,0.8)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0"
                    style={{ background: "rgba(98,60,234,0.15)" }}
                  >
                    {item.asset.coverImage && (
                      <Image
                        src={item.asset.coverImage}
                        alt={item.asset.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                    <div>
                      <span
                        className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded mb-1"
                        style={{
                          background: "rgba(98,60,234,0.2)",
                          color: "#9d7ef7",
                          border: "1px solid rgba(98,60,234,0.3)",
                        }}
                      >
                        {TYPE_LABEL[item.asset.type] ?? item.asset.type}
                      </span>
                      <Link
                        href={`/p/${item.asset.slug}`}
                        className="block text-[15px] font-medium text-white hover:text-foreground/80 transition-colors line-clamp-2"
                      >
                        {item.asset.title}
                      </Link>
                    </div>

                    <CartItemRemoveButton assetId={item.assetId} />
                  </div>

                  {/* Price */}
                  <div className="shrink-0 text-right">
                    <span className="text-[18px] font-bold text-white">
                      {formatPrice(item.asset.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="w-full lg:w-[360px] shrink-0 sticky top-28">
              <div
                className="rounded-xl p-6 flex flex-col gap-5"
                style={{
                  background: "rgba(25,25,33,0.8)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <h2 className="text-[18px] font-semibold text-white">Resumen del pedido</h2>

                <div className="flex flex-col gap-3">
                  {activeItems.map((item) => (
                    <div key={item.id} className="flex justify-between gap-3">
                      <span
                        className="text-[14px] line-clamp-1 flex-1"
                        style={{ color: "rgba(242,242,242,0.6)" }}
                      >
                        {item.asset.title}
                      </span>
                      <span className="text-[14px] text-white shrink-0">
                        {formatPrice(item.asset.price)}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className="flex justify-between items-center pt-4"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <span className="text-[16px] font-medium text-white">Total</span>
                  <span className="text-[24px] font-bold text-white">
                    {hasFreeOnly ? "Gratis" : `$${total.toFixed(2)}`}
                  </span>
                </div>

                <CartCheckoutButton />

                <Link
                  href="/explorer"
                  className="text-center text-[14px] transition-colors"
                  style={{ color: "rgba(242,242,242,0.4)" }}
                >
                  Continuar explorando
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center gap-6 py-20 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: "rgba(98,60,234,0.1)", border: "1px solid rgba(98,60,234,0.2)" }}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(157,126,247,0.6)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>

      <div>
        <p className="text-[20px] font-medium text-white mb-2">Tu carrito está vacío</p>
        <p className="text-[15px]" style={{ color: "rgba(242,242,242,0.5)" }}>
          Explora el marketplace y encuentra activos de IA para tu negocio.
        </p>
      </div>

      <Link
        href="/explorer"
        className="inline-flex items-center justify-center rounded-pill px-6 py-3 text-[15px] font-medium text-white transition-all duration-200 hover:opacity-90"
        style={{
          background: "linear-gradient(180deg, #623CEA 0%, #372284 94%)",
          boxShadow: "0 0 20px rgba(98,60,234,0.35)",
        }}
      >
        Explorar activos
      </Link>
    </div>
  );
}
