import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { AuthNavbar } from "@/components/layout/AuthNavbar";

export const metadata: Metadata = {
  title: "Crear cuenta — ShareMyPrompt",
  description:
    "Únete a ShareMyPrompt, el marketplace líder de activos de IA verificados.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthNavbar ctaLabel="Iniciar sesión" ctaHref="/login" ctaVariant="outline" />

      {children}

      <Footer />
    </>
  );
}
