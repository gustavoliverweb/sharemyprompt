import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

const APP_URL = process.env.AUTH_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { assetId } = await req.json().catch(() => ({}));
  if (!assetId) {
    return NextResponse.json({ error: "assetId requerido" }, { status: 422 });
  }

  const asset = await prisma.asset.findUnique({
    where: { id: assetId, status: "PUBLISHED" },
    select: { id: true, title: true, slug: true, price: true, coverImage: true, userId: true },
  });
  if (!asset) {
    return NextResponse.json({ error: "Activo no encontrado" }, { status: 404 });
  }

  // El autor no puede comprarse su propio activo
  if (asset.userId === session.user.id) {
    return NextResponse.json({ error: "No puedes adquirir tu propio activo" }, { status: 409 });
  }

  // Verificar compra existente
  const existing = await prisma.purchase.findUnique({
    where: { userId_assetId: { userId: session.user.id, assetId } },
  });
  if (existing) {
    return NextResponse.json({ error: "Ya adquiriste este activo" }, { status: 409 });
  }

  const price = parseFloat(asset.price.toString());

  // Activo gratuito — registrar directamente sin Stripe
  if (price === 0) {
    await prisma.purchase.create({
      data: { userId: session.user.id, assetId, amount: 0 },
    });
    return NextResponse.json({ url: `/p/${asset.slug}?purchased=1` });
  }

  // Activo de pago — crear sesión de Stripe Checkout
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email ?? undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(price * 100),
          product_data: {
            name: asset.title,
            ...(asset.coverImage ? { images: [`${APP_URL}${asset.coverImage}`] } : {}),
          },
        },
      },
    ],
    metadata: {
      assetId: asset.id,
      userId: session.user.id,
    },
    success_url: `${APP_URL}/p/${asset.slug}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/p/${asset.slug}`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
