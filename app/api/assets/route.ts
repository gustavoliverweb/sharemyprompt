import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { AssetType, OutputFormat } from "@/app/generated/prisma/enums";

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const assets = await prisma.asset.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(assets);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { role, id: userId } = session.user;
  if (role !== "EXPERTO" && role !== "ADMIN") {
    return NextResponse.json(
      { error: "Solo expertos pueden publicar activos" },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const {
    title,
    description,
    type,
    category,
    price,
    roleDefinition,
    contentScope,
    taskDefinition,
    outputFormat,
    restrictions,
    promptContent,
    recommendedModel,
    publish,
  } = body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json(
      { error: "El título es obligatorio" },
      { status: 400 }
    );
  }

  const validTypes: AssetType[] = ["PROMPT", "FLUJO", "AGENTE"];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "Tipo de activo inválido" }, { status: 400 });
  }

  const validFormats: OutputFormat[] = ["JSON", "MARKDOWN", "TABLA", "CODIGO"];
  const resolvedFormat: OutputFormat = validFormats.includes(outputFormat)
    ? outputFormat
    : "JSON";

  const slug = generateSlug(title.trim());

  try {
    const asset = await prisma.asset.create({
      data: {
        userId,
        title: title.trim(),
        slug,
        description: description?.trim() || null,
        type,
        category: typeof category === "string" && category.trim() ? category.trim() : null,
        status: publish ? "PENDING_REVIEW" : "DRAFT",
        price: parseFloat(price) || 0,
        roleDefinition: roleDefinition?.trim() || null,
        contentScope: contentScope?.trim() || null,
        taskDefinition: taskDefinition?.trim() || null,
        outputFormat: resolvedFormat,
        restrictions: Array.isArray(restrictions) ? restrictions.filter(Boolean) : [],
        promptContent: promptContent?.trim() || null,
        recommendedModel: recommendedModel?.trim() || null,
        coverImage: typeof body.coverImage === "string" && body.coverImage.trim() ? body.coverImage.trim() : null,
      },
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (err) {
    console.error("[POST /api/assets]", err);
    return NextResponse.json({ error: "Error al guardar el activo en la base de datos" }, { status: 500 });
  }
}
