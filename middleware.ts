import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/user-dashboard/:path*", "/upload-active/:path*", "/admin/:path*", "/cart/:path*", "/cart", "/finances", "/finances/:path*"],
};
