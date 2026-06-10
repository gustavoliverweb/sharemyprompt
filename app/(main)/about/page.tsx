import { AboutHeroSection } from "@/components/sections/about/AboutHeroSection";
import { AboutCoreSection } from "@/components/sections/about/AboutCoreSection";
import { AboutPilarSection } from "@/components/sections/about/AboutPilarSection";
import { AboutEcosystemSection } from "@/components/sections/about/AboutEcosystemSection";
import { AboutArchitectSection } from "@/components/sections/about/AboutArchitectSection";
import { AboutStaticsSection } from "@/components/sections/about/AboutStaticsSection";

export const metadata = {
  title: "Sobre Nosotros — ShareMyPrompt",
  description:
    "Conoce el equipo y la misión detrás de ShareMyPrompt, el marketplace líder de activos de IA verificados.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHeroSection />
      <AboutCoreSection />
      <AboutPilarSection />
      <AboutEcosystemSection />
      <AboutArchitectSection />
      <AboutStaticsSection />
    </main>
  );
}
