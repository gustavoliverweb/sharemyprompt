import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { authConfig } from "@/lib/auth.config";
import type { Role } from "@/app/generated/prisma/enums";

function generateUsername(email: string): string {
  const base = email.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${base}${suffix}`;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user?.password) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role as Role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, account, profile }) {
      // Google OAuth — crear usuario en DB si es la primera vez
      if (account?.provider === "google" && profile?.email) {
        let dbUser = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (!dbUser) {
          let username = generateUsername(profile.email);
          const taken = await prisma.user.findUnique({ where: { username } });
          if (taken) username = `${username}${Math.floor(10 + Math.random() * 90)}`;

          dbUser = await prisma.user.create({
            data: {
              email: profile.email,
              name: (profile as { name?: string }).name ?? null,
              username,
              role: "USUARIO",
            },
          });
        }

        token.id = dbUser.id;
        token.role = dbUser.role;
        token.username = dbUser.username;
        return token;
      }

      if (user) {
        token.id = user.id!;
        token.role = (user as { role?: string }).role;
        token.username = (user as { username?: string }).username;
        return token;
      }
      // Re-fetch role on every server-side auth() call so the cookie stays in sync
      // with DB changes (e.g. role promotions done by admin).
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, username: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          if (dbUser.username) token.username = dbUser.username;
        }
      }
      return token;
    },
  },
});
