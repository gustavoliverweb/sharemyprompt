import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "PENDING_REVIEW";

  const assets = await prisma.asset.findMany({
    where: { status: status as never },
    orderBy: { updatedAt: "asc" },
    include: {
      user: { select: { id: true, name: true, email: true, username: true } },
    },
  });

  return NextResponse.json(assets);
}
