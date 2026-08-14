import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id: userId, role } = session.user;

  if (role !== "USUARIO") {
    return NextResponse.json(
      { error: "Solo los usuarios pueden solicitar ser experto" },
      { status: 403 }
    );
  }

  const existing = await prisma.expertRequest.findUnique({ where: { userId } });
  const { message } = await req.json().catch(() => ({ message: null }));

  if (existing) {
    if (existing.status === "PENDING" || existing.status === "APPROVED") {
      return NextResponse.json(
        { error: "Ya tienes una solicitud registrada" },
        { status: 409 }
      );
    }

    // REJECTED o REVOKED — permitir volver a intentarlo reabriendo la misma solicitud
    const updated = await prisma.expertRequest.update({
      where: { userId },
      data: { status: "PENDING", message: message ?? null, reviewedAt: null, reviewedBy: null },
    });
    return NextResponse.json(updated, { status: 200 });
  }

  const request = await prisma.expertRequest.create({
    data: { userId, message: message ?? null },
  });

  return NextResponse.json(request, { status: 201 });
}
