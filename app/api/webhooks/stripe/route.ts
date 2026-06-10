import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

// Stripe necesita el body raw para verificar la firma
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Sin firma Stripe" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { type, assetId, assetIds, userId } = session.metadata ?? {};

    if (!userId) {
      return NextResponse.json({ error: "Metadata incompleta" }, { status: 400 });
    }

    if (type === "cart" && assetIds) {
      const ids = assetIds.split(",").filter(Boolean);
      const amount = (session.amount_total ?? 0) / 100 / ids.length;

      await prisma.$transaction([
        ...ids.map((id) =>
          prisma.purchase.upsert({
            where: { userId_assetId: { userId, assetId: id } },
            update: { stripeSessionId: session.id },
            create: { userId, assetId: id, amount, stripeSessionId: session.id },
          })
        ),
        prisma.cartItem.deleteMany({
          where: { userId, assetId: { in: ids } },
        }),
      ]);
    } else if (assetId) {
      const amount = (session.amount_total ?? 0) / 100;

      await prisma.purchase.upsert({
        where: { userId_assetId: { userId, assetId } },
        update: { stripeSessionId: session.id },
        create: { userId, assetId, amount, stripeSessionId: session.id },
      });
    } else {
      return NextResponse.json({ error: "Metadata incompleta" }, { status: 400 });
    }
  }

  return NextResponse.json({ received: true });
}
