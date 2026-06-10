import { RegisterHero } from "@/components/sections/register/RegisterHero"
import { RegisterForm } from "@/components/sections/register/RegisterForm"

export default function RegisterPage() {
  return (
    <main className="grid lg:grid-cols-2 min-h-screen pt-16">
      <RegisterHero />

      {/* Form panel */}
      <div className="flex items-center justify-center bg-surface px-6 py-20 lg:py-0 min-h-screen lg:min-h-0">
        <RegisterForm />
      </div>
    </main>
  )
}
