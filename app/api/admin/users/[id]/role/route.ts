import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Role } from "@/app/generated/prisma/enums";

const VALID_ROLES: Role[] = ["ADMIN", "EXPERTO", "USUARIO"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const { id } = await params;
  const { role } = await req.json().catch(() => ({ role: null }));

  if (typeof role !== "string" || !VALID_ROLES.includes(role as Role)) {
    return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
  }

  if (id === session.user.id) {
    return NextResponse.json(
      { error: "No puedes cambiar tu propio rol" },
      { status: 400 }
    );
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  if (target.role === role) {
    return NextResponse.json({ error: "El usuario ya tiene ese rol" }, { status: 409 });
  }

  if (target.role === "ADMIN" && role !== "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "No puedes quitar el rol al último administrador" },
        { status: 409 }
      );
    }
  }

  const [updated] = await prisma.$transaction([
    prisma.user.update({ where: { id }, data: { role: role as Role } }),
    prisma.roleChange.create({
      data: {
        userId: id,
        fromRole: target.role,
        toRole: role as Role,
        changedById: session.user.id,
      },
    }),
  ]);

  return NextResponse.json(updated);
}
