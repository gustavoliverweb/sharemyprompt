import type { Metadata } from "next"
import { Footer } from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Explorar — ShareMyPrompt",
  description: "Descubre los mejores prompts, automatizaciones y agentes de IA verificados por expertos.",
}

export default function ExplorerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}
