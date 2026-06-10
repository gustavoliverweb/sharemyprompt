import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardSidebar } from "@/components/sections/user-dashboard/DashboardSidebar";
import { UploadConfigPanel, type AssetInitialData } from "@/components/sections/upload/UploadConfigPanel";
import { UploadProfilePanel } from "@/components/sections/upload/UploadProfilePanel";

function BackArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 12H5" />
      <path d="M12 5l-7 7 7 7" />
    </svg>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const asset = await prisma.asset.findUnique({
    where: { id },
    select: { title: true },
  });
  return {
    title: asset ? `Editar: ${asset.title} — ShareMyPrompt` : "Editar activo — ShareMyPrompt",
  };
}

export default async function EditAssetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [session, { id }] = await Promise.all([auth(), params]);
  if (!session?.user) redirect("/login");

  const asset = await prisma.asset.findUnique({ where: { id } });

  if (!asset) notFound();
  if (asset.userId !== session.user.id) notFound();
  if (asset.status === "PENDING_REVIEW" || asset.status === "DISCONTINUED") {
    redirect("/user-dashboard");
  }

  const { name, username } = session.user;
  const displayName = username ?? name ?? "Experto";
  const initials = (name ?? username ?? "E")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const initialData: AssetInitialData = {
    id: asset.id,
    title: asset.title,
    description: asset.description,
    coverImage: asset.coverImage,
    type: asset.type as AssetInitialData["type"],
    category: asset.category,
    roleDefinition: asset.roleDefinition,
    contentScope: asset.contentScope,
    taskDefinition: asset.taskDefinition,
    outputFormat: asset.outputFormat as AssetInitialData["outputFormat"],
    restrictions: asset.restrictions,
    promptContent: asset.promptContent,
    recommendedModel: asset.recommendedModel,
    price: parseFloat(asset.price.toString()) === 0 ? "" : asset.price.toString(),
  };

  return (
    <div className="flex min-h-screen bg-surface xl:pr-[240px]">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 md:ml-[72px]">
        <div
          className="flex items-center justify-between px-4 md:px-8 pt-6 md:pt-8 pb-4"
          style={{ borderBottom: "0.5px solid #623CEA" }}
        >
          <div className="flex flex-col gap-0.5">
            <Link
              href="/user-dashboard"
              className="flex items-center gap-1.5 text-[12px] transition-colors w-fit"
              style={{ color: "rgba(242,242,242,0.35)" }}
            >
              <BackArrowIcon />
              Dashboard
            </Link>
            <h1 className="text-xl md:text-[28px] font-bold text-white leading-tight">
              Editando:{" "}
              <span style={{ color: "rgba(242,242,242,0.55)" }}>{asset.title}</span>
            </h1>
          </div>

          <Link
            href="/user-dashboard"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(242,242,242,0.5)",
            }}
            aria-label="Ir al dashboard"
            title="Ir al dashboard"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-6 px-4 md:px-8 pb-20 md:pb-20 mb-[60px] md:mb-0 items-start pt-6">
          <UploadConfigPanel initialData={initialData} />
          <UploadProfilePanel username={displayName} initials={initials} />
        </div>
      </div>
    </div>
  );
}
