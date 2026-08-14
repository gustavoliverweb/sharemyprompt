import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" as const, maxAge: 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = (user as { role?: string }).role;
        token.username = (user as { username?: string }).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        session.user.role = token.role as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).username = token.username as string | undefined;
      }
      return session;
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      if (
        pathname.startsWith("/user-dashboard") ||
        pathname.startsWith("/upload-active") ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/cart") ||
        pathname.startsWith("/finances")
      ) {
        // Aquí solo se valida sesión. El control de rol (ADMIN / EXPERTO) se
        // hace en cada página server component con redirect("/403") — un
        // NextResponse.redirect() devuelto desde este callback rompió producción
        // el 2026-06-15 (condición de carrera de router cache en edge runtime
        // con Auth.js v5 beta). No reintroducir lógica de rol ni NextResponse aquí.
        return isLoggedIn;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
