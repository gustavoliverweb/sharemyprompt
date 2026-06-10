import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const { id } = await params;
  const { action } = await req.json();

  if (!["approve", "reject", "revoke"].includes(action)) {
    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  }

  const expertRequest = await prisma.expertRequest.findUnique({ where: { id } });
  if (!expertRequest) {
    return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
  }

  if (action === "approve") {
    if (expertRequest.status !== "PENDING") {
      return NextResponse.json({ error: "Solo se pueden aprobar solicitudes pendientes" }, { status: 409 });
    }
    const [updated] = await prisma.$transaction([
      prisma.expertRequest.update({
        where: { id },
        data: { status: "APPROVED", reviewedAt: new Date(), reviewedBy: session.user.id },
      }),
      prisma.user.update({
        where: { id: expertRequest.userId },
        data: { role: "EXPERTO" },
      }),
    ]);
    return NextResponse.json(updated);
  }

  if (action === "reject") {
    if (expertRequest.status !== "PENDING") {
      return NextResponse.json({ error: "Solo se pueden rechazar solicitudes pendientes" }, { status: 409 });
    }
    const updated = await prisma.expertRequest.update({
      where: { id },
      data: { status: "REJECTED", reviewedAt: new Date(), reviewedBy: session.user.id },
    });
    return NextResponse.json(updated);
  }

  if (action === "revoke") {
    if (expertRequest.status !== "APPROVED") {
      return NextResponse.json({ error: "Solo se puede revocar a usuarios aprobados" }, { status: 409 });
    }
    const [updated] = await prisma.$transaction([
      prisma.expertRequest.update({
        where: { id },
        data: { status: "REVOKED", reviewedAt: new Date(), reviewedBy: session.user.id },
      }),
      prisma.user.update({
        where: { id: expertRequest.userId },
        data: { role: "USUARIO" },
      }),
    ]);
    return NextResponse.json(updated);
  }
}
