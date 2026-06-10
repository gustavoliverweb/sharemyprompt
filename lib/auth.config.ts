import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
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
        pathname.startsWith("/admin")
      ) {
        if (!isLoggedIn) return false;

        const role = auth?.user?.role as string | undefined;

        if (pathname.startsWith("/admin")) return role === "ADMIN";
        if (pathname.startsWith("/upload-active")) {
          if (role === "EXPERTO" || role === "ADMIN") return true;
          return NextResponse.redirect(new URL("/user-dashboard", request.nextUrl));
        }
        if (pathname.startsWith("/finances")) {
          if (role === "EXPERTO" || role === "ADMIN") return true;
          return NextResponse.redirect(new URL("/user-dashboard", request.nextUrl));
        }

        return true;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
