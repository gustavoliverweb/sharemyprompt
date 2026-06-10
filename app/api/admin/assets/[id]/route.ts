import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
  }

  const { id } = await params;
  const { action, reason } = await req.json().catch(() => ({ action: null, reason: null }));

  const asset = await prisma.asset.findUnique({ where: { id } });
  if (!asset) {
    return NextResponse.json({ error: "Activo no encontrado" }, { status: 404 });
  }
  if (asset.status !== "PENDING_REVIEW") {
    return NextResponse.json(
      { error: "El activo no está pendiente de revisión" },
      { status: 409 }
    );
  }

  if (action === "approve") {
    const updated = await prisma.asset.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        rejectionReason: null,
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
      },
    });
    return NextResponse.json(updated);
  }

  if (action === "reject") {
    if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
      return NextResponse.json(
        { error: "Se requiere una razón para rechazar el activo" },
        { status: 400 }
      );
    }
    const updated = await prisma.asset.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectionReason: reason.trim(),
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
      },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
}
