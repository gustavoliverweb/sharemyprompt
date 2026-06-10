import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Finanzas — ShareMyPrompt",
  description: "Panel de finanzas para expertos de ShareMyPrompt.",
};

export default function FinanzasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
