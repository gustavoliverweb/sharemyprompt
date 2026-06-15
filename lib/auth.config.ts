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

      console.log("[AUTH] authorized callback", {
        pathname,
        isLoggedIn,
        userId: auth?.user?.id,
        role: auth?.user?.role,
        method: request.method,
        headers: {
          "next-url": request.headers.get("next-url"),
          "rsc": request.headers.get("rsc"),
          "next-router-prefetch": request.headers.get("next-router-prefetch"),
        },
      });

      if (
        pathname.startsWith("/user-dashboard") ||
        pathname.startsWith("/upload-active") ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/cart") ||
        pathname.startsWith("/finances")
      ) {
        if (!isLoggedIn) {
          console.log("[AUTH] not logged in, returning false");
          return false;
        }

        const role = auth?.user?.role as string | undefined;

        if (pathname.startsWith("/admin")) {
          const result = role === "ADMIN";
          console.log("[AUTH] /admin check →", result);
          return result;
        }
        if (pathname.startsWith("/upload-active") || pathname.startsWith("/finances")) {
          const result = role === "EXPERTO" || role === "ADMIN";
          console.log("[AUTH] /upload-active|/finances check → role:", role, "result:", result);
          return result;
        }

        return true;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
