import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const setupToken = process.env.ADMIN_SETUP_TOKEN;
  if (!setupToken) {
    return NextResponse.json(
      { error: "Bootstrap de admin no configurado en el servidor (falta ADMIN_SETUP_TOKEN)" },
      { status: 500 }
    );
  }

  const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
  if (adminCount > 0) {
    return NextResponse.json(
      { error: "Ya existe un administrador. Pide que te promuevan desde el panel de usuarios." },
      { status: 403 }
    );
  }

  const { token } = await req.json().catch(() => ({ token: null }));
  if (typeof token !== "string" || !safeEqual(token, setupToken)) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { role: "ADMIN" },
  });

  return NextResponse.json({ ok: true });
}
