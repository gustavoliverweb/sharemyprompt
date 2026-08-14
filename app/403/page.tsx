import Link from "next/link";

export const metadata = { title: "Acceso denegado — ShareMyPrompt" };

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="max-w-[440px] text-center flex flex-col gap-4">
        <p className="text-[12px] uppercase tracking-widest font-bold" style={{ color: "#E25555" }}>
          Error 403
        </p>
        <h1 className="text-2xl font-bold text-white">Acceso denegado</h1>
        <p className="text-sm text-foreground/60">
          Tu cuenta no tiene el rol necesario para ver esta sección.
        </p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <Link
            href="/user-dashboard"
            className="px-5 py-2.5 rounded-pill text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(180deg, #623cea 0%, #372284 94%)",
              boxShadow: "0 0 20px rgba(98,60,234,0.35)",
            }}
          >
            Ir a mi dashboard
          </Link>
          <Link
            href="/"
            className="text-sm text-foreground/50 hover:text-foreground/80 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
