"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Correo o contraseña incorrectos");
    } else {
      router.push("/user-dashboard");
    }
  }

  return (
    <div className="w-full max-w-[440px] flex flex-col gap-6">
      {/* Title */}
      <h1 className="text-2xl font-bold text-white text-center">
        Iniciar sesión
      </h1>

      {/* Form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Correo */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="correo" className="text-sm text-foreground/60">
            Correo
          </label>
          <input
            id="correo"
            type="email"
            placeholder="Ej: hola@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder:text-foreground/25 focus:outline-none focus:border-primary/50 transition-colors text-sm"
          />
        </div>

        {/* Contraseña con toggle */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm text-foreground/60">
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 pr-11 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder:text-foreground/25 focus:outline-none focus:border-primary/50 transition-colors text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70 transition-colors"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-400 text-center">{error}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-pill font-bold text-sm text-white transition-all duration-200 hover:opacity-90 mt-2 disabled:opacity-60"
          style={{
            background: "linear-gradient(180deg, #623cea 0%, #372284 94%)",
            boxShadow: "0 0 20px rgba(98,60,234,0.35)",
          }}
        >
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>

      {/* Dot separator */}
      <div className="flex items-center justify-center" aria-hidden>
        <div className="w-2 h-2 rounded-full border border-foreground/25" />
      </div>

      {/* Social login */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/user-dashboard" })}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-white/10 bg-white/[0.03] text-sm font-medium text-white hover:bg-white/[0.07] transition-colors"
        >
          <GoogleIcon />
          Continúa con Google
        </button>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-white/10 bg-white/[0.03] text-sm font-medium text-white hover:bg-white/[0.07] transition-colors"
        >
          <FacebookIcon />
          Continúa con Facebook
        </button>
      </div>

      {/* Register link */}
      <p className="text-center text-sm text-foreground/45">
        ¿Soy nuevo aquí?{" "}
        <Link
          href="/register"
          className="text-foreground/80 hover:text-white underline underline-offset-2 transition-colors"
        >
          Crear una cuenta en Sharemyprompt
        </Link>
      </p>
    </div>
  );
}
