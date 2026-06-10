import { HeroSection } from "@/components/sections/HeroSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { AboutMarketSection } from "@/components/sections/AboutMarketSection";
import { MarketFeatureSection } from "@/components/sections/MarketFeatureSection";
import { LatestProductsSection } from "@/components/sections/LatestProductsSection";
import { FeaturedCreatorSection } from "@/components/sections/FeaturedCreatorSection";
import { FeaturedProductsSection } from "@/components/sections/FeaturedProductsSection";
import { MonetizeMarketSection } from "@/components/sections/MonetizeMarketSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CategoriesSection className="mt-[80px] lg:mt-[160px]" />
      <FeaturedProductsSection className="mt-[80px] lg:mt-[160px]" />
      <AboutMarketSection className="mt-[80px] lg:mt-[160px]" />
      <MarketFeatureSection className="mt-[80px] lg:mt-[160px]" />
      <LatestProductsSection className="mt-[80px] lg:mt-[160px]" />
      <FeaturedCreatorSection className="mt-[80px] lg:mt-[160px]" />
      <MonetizeMarketSection className="mt-[80px] lg:mt-[160px]" />
    </main>
  );
}
