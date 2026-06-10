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
  if (existing) {
    return NextResponse.json(
      { error: "Ya tienes una solicitud registrada" },
      { status: 409 }
    );
  }

  const { message } = await req.json().catch(() => ({ message: null }));

  const request = await prisma.expertRequest.create({
    data: { userId, message: message ?? null },
  });

  return NextResponse.json(request, { status: 201 });
}
