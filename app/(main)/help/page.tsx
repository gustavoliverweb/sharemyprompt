import type { Metadata } from "next";
import { SupportForm } from "@/components/sections/help/SupportForm";

export const metadata: Metadata = {
  title: "Centro de ayuda — ShareMyPrompt",
  description:
    "Inicie un protocolo de soporte. Nuestros arquitectos de guardia analizarán la integridad de su reporte.",
};

export default function HelpPage() {
  return (
    <main className="relative overflow-hidden pt-[120px] pb-0">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute top-[-120px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] opacity-[0.15]"
        style={{
          background:
            "radial-gradient(ellipse at center, #5D35FF 0%, #3AF4BC 60%, transparent 80%)",
          filter: "blur(80px)",
        }}
        aria-hidden
      />

      <div className="relative max-w-screen-xl mx-auto px-6 flex flex-col items-center ">
        {/* Hero */}
        <div className="flex flex-col gap-5 mb-14 w-full max-w-[720px]">
          <h1
            className="font-bold text-white leading-[1.1]"
            style={{ fontSize: "clamp(36px, 4.2vw, 61px)" }}
          >
            Centro de ayuda
          </h1>
          <p
            className="text-[20px] leading-[1.3] max-w-[600px]"
            style={{ color: "rgba(242,242,242,0.75)" }}
          >
            Inicie un protocolo de soporte. Nuestros arquitectos de guardia
            analizarán la integridad de su reporte.
          </p>
        </div>

        {/* Form */}
        <div
          className="max-w-[720px]  w-full  rounded-xl p-8 mb-24"
          style={{
            background: "rgba(242,242,242,0.04)",
            border: "1px solid rgba(242,242,242,0.08)",
          }}
        >
          <SupportForm />
        </div>
      </div>
    </main>
  );
}
