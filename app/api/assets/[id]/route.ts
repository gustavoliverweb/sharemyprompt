import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { action } = body;

  const asset = await prisma.asset.findUnique({ where: { id } });
  if (!asset) {
    return NextResponse.json({ error: "Activo no encontrado" }, { status: 404 });
  }
  if (asset.userId !== session.user.id) {
    return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
  }

  if (action === "submit") {
    if (asset.status !== "DRAFT" && asset.status !== "REJECTED") {
      return NextResponse.json(
        { error: "Solo borradores o activos rechazados pueden enviarse a revisión" },
        { status: 409 }
      );
    }
    const updated = await prisma.asset.update({
      where: { id },
      data: { status: "PENDING_REVIEW", rejectionReason: null },
    });
    return NextResponse.json(updated);
  }

  if (action === "discontinue") {
    if (asset.status !== "PUBLISHED") {
      return NextResponse.json(
        { error: "Solo activos publicados pueden descatalogarse" },
        { status: 409 }
      );
    }
    const updated = await prisma.asset.update({
      where: { id },
      data: { status: "DISCONTINUED" },
    });
    return NextResponse.json(updated);
  }

  if (action === "edit") {
    if (asset.status === "PENDING_REVIEW" || asset.status === "DISCONTINUED") {
      return NextResponse.json(
        { error: "No se puede editar un activo en revisión o descatalogado" },
        { status: 409 }
      );
    }

    const {
      title, description, coverImage, type, category,
      price, roleDefinition, contentScope, taskDefinition,
      outputFormat, restrictions, promptContent, recommendedModel,
      publish,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "El título es obligatorio" }, { status: 422 });
    }

    const updated = await prisma.asset.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description || null,
        coverImage: coverImage || null,
        type: type ?? asset.type,
        category: category || null,
        price: price ? parseFloat(price) : 0,
        roleDefinition: roleDefinition || null,
        contentScope: contentScope || null,
        taskDefinition: taskDefinition || null,
        outputFormat: outputFormat ?? asset.outputFormat,
        restrictions: Array.isArray(restrictions) ? restrictions : [],
        promptContent: promptContent || null,
        recommendedModel: recommendedModel || null,
        status: publish ? "PENDING_REVIEW" : "DRAFT",
        rejectionReason: null,
      },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
}
