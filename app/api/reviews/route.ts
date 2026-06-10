import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const { assetId, rating, comment } = body;

  if (!assetId || typeof assetId !== "string") {
    return NextResponse.json({ error: "assetId requerido" }, { status: 422 });
  }

  const ratingNum = Number(rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return NextResponse.json({ error: "Rating debe ser un entero entre 1 y 5" }, { status: 422 });
  }

  const asset = await prisma.asset.findUnique({
    where: { id: assetId, status: "PUBLISHED" },
    select: { id: true, userId: true },
  });
  if (!asset) {
    return NextResponse.json({ error: "Activo no encontrado" }, { status: 404 });
  }

  if (asset.userId === session.user.id) {
    return NextResponse.json({ error: "No puedes reseñar tu propio activo" }, { status: 409 });
  }

  const purchase = await prisma.purchase.findUnique({
    where: { userId_assetId: { userId: session.user.id, assetId } },
  });
  if (!purchase) {
    return NextResponse.json({ error: "Solo puedes reseñar activos que hayas adquirido" }, { status: 403 });
  }

  const review = await prisma.review.upsert({
    where: { userId_assetId: { userId: session.user.id, assetId } },
    update: {
      rating: ratingNum,
      comment: typeof comment === "string" && comment.trim() ? comment.trim() : null,
    },
    create: {
      userId: session.user.id,
      assetId,
      rating: ratingNum,
      comment: typeof comment === "string" && comment.trim() ? comment.trim() : null,
    },
    include: { user: { select: { username: true, name: true } } },
  });

  return NextResponse.json({ review }, { status: 201 });
}
