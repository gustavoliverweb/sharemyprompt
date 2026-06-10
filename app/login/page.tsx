import { LoginHero } from "@/components/sections/login/LoginHero"
import { LoginForm } from "@/components/sections/login/LoginForm"

export default function LoginPage() {
  return (
    <main className="grid lg:grid-cols-2 min-h-screen pt-16">
      <LoginHero />

      {/* Form panel */}
      <div className="flex items-center justify-center bg-surface px-6 py-20 lg:py-0 min-h-screen lg:min-h-0">
        <LoginForm />
      </div>
    </main>
  )
}
