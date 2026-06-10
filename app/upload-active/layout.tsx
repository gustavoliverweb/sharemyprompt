import type { Metadata } from "next"
import { Footer } from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Subir activo — ShareMyPrompt",
  description: "Configura y publica tu activo de IA en ShareMyPrompt.",
}

export default function UploadActiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}
