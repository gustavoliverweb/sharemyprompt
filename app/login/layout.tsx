import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { AuthNavbar } from "@/components/layout/AuthNavbar";

export const metadata: Metadata = {
  title: "Iniciar sesión — ShareMyPrompt",
  description: "Accede a tu cuenta en ShareMyPrompt.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthNavbar ctaLabel="Crear cuenta" ctaHref="/register" ctaVariant="gradient" />

      {children}

      <Footer />
    </>
  );
}
