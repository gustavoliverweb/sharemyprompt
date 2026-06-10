import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ assetId: string }> }
) {
  const { assetId } = await params;

  const reviews = await prisma.review.findMany({
    where: { assetId },
    include: { user: { select: { username: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const avg =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : null;

  return NextResponse.json({ reviews, avg, total: reviews.length });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ assetId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { assetId } = await params;

  const deleted = await prisma.review.deleteMany({
    where: { userId: session.user.id, assetId },
  });

  if (deleted.count === 0) {
    return NextResponse.json({ error: "Reseña no encontrada" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
