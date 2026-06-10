import type { Metadata } from "next"
import { Footer } from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Dashboard — ShareMyPrompt",
  description: "Gestiona tus activos de IA adquiridos en ShareMyPrompt.",
}

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}
