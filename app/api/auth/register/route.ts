import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 }
      );
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json(
        { error: "Este correo ya está registrado" },
        { status: 409 }
      );
    }

    // Generar username único basado en el email
    const base = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_");
    let username = base;
    let n = 1;
    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${base}${n++}`;
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, username, password: hashed },
    });

    return NextResponse.json(
      { message: "Cuenta creada exitosamente", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[register]", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
