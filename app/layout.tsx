import type { Metadata } from "next";
import { DM_Sans, Inter, Krona_One, Ubuntu } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const kronaOne = Krona_One({
  variable: "--font-krona-one",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShareMyPrompt — Marketplace de Activos de IA",
  description:
    "Accede al marketplace líder de prompts estructurados y automatizaciones verificadas por expertos en IA.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${dmSans.variable} ${inter.variable} ${ubuntu.variable} ${kronaOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-foreground">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
