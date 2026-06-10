import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ assetId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { assetId } = await params;

  await prisma.cartItem.deleteMany({
    where: { userId: session.user.id, assetId },
  });

  return NextResponse.json({ ok: true });
}
