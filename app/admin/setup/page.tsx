import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AdminSetupForm } from "@/components/sections/admin/AdminSetupForm";

export const metadata = { title: "Configurar administrador — ShareMyPrompt" };

export default async function AdminSetupPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-surface px-4 py-16">
      {adminCount > 0 ? (
        <div className="max-w-[440px] text-center flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-white">
            Ya hay un administrador configurado
          </h1>
          <p className="text-sm text-foreground/60">
            Pide a un administrador existente que te otorgue el rol desde el
            panel de usuarios.
          </p>
        </div>
      ) : (
        <AdminSetupForm />
      )}
    </div>
  );
}
