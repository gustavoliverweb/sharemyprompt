import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

const APP_URL = process.env.AUTH_URL ?? "http://localhost:3000";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const items = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      asset: {
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          coverImage: true,
          status: true,
        },
      },
    },
  });

  if (items.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío" }, { status: 422 });
  }

  const validItems = items.filter((i) => i.asset.status === "PUBLISHED");

  const alreadyPurchased = await prisma.purchase.findMany({
    where: {
      userId: session.user.id,
      assetId: { in: validItems.map((i) => i.assetId) },
    },
    select: { assetId: true },
  });
  const purchasedIds = new Set(alreadyPurchased.map((p) => p.assetId));
  const toPurchase = validItems.filter((i) => !purchasedIds.has(i.assetId));

  if (toPurchase.length === 0) {
    await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });
    return NextResponse.json({ url: "/user-dashboard" });
  }

  const freeItems = toPurchase.filter(
    (i) => parseFloat(i.asset.price.toString()) === 0
  );
  const paidItems = toPurchase.filter(
    (i) => parseFloat(i.asset.price.toString()) > 0
  );

  if (freeItems.length > 0) {
    await prisma.$transaction([
      ...freeItems.map((i) =>
        prisma.purchase.upsert({
          where: { userId_assetId: { userId: session.user.id, assetId: i.assetId } },
          update: {},
          create: { userId: session.user.id, assetId: i.assetId, amount: 0 },
        })
      ),
      prisma.cartItem.deleteMany({
        where: {
          userId: session.user.id,
          assetId: { in: freeItems.map((i) => i.assetId) },
        },
      }),
    ]);
  }

  if (paidItems.length === 0) {
    return NextResponse.json({ url: "/user-dashboard?cart_paid=1" });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email ?? undefined,
    line_items: paidItems.map((i) => ({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(parseFloat(i.asset.price.toString()) * 100),
        product_data: {
          name: i.asset.title,
          ...(i.asset.coverImage
            ? { images: [`${APP_URL}${i.asset.coverImage}`] }
            : {}),
        },
      },
    })),
    metadata: {
      type: "cart",
      assetIds: paidItems.map((i) => i.assetId).join(","),
      userId: session.user.id,
    },
    success_url: `${APP_URL}/user-dashboard?session_id={CHECKOUT_SESSION_ID}&cart_paid=1`,
    cancel_url: `${APP_URL}/cart`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
