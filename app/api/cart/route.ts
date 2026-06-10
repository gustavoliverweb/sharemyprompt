import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
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
          type: true,
          coverImage: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items });
}

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
    select: { id: true, userId: true },
  });

  if (!asset) {
    return NextResponse.json({ error: "Activo no encontrado" }, { status: 404 });
  }

  if (asset.userId === session.user.id) {
    return NextResponse.json(
      { error: "No puedes agregar tu propio activo al carrito" },
      { status: 409 }
    );
  }

  const purchased = await prisma.purchase.findUnique({
    where: { userId_assetId: { userId: session.user.id, assetId } },
  });
  if (purchased) {
    return NextResponse.json({ error: "Ya adquiriste este activo" }, { status: 409 });
  }

  const item = await prisma.cartItem.upsert({
    where: { userId_assetId: { userId: session.user.id, assetId } },
    update: {},
    create: { userId: session.user.id, assetId },
  });

  return NextResponse.json({ item }, { status: 201 });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });

  return NextResponse.json({ ok: true });
}
