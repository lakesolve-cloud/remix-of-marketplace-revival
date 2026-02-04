import { HeroSection } from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { FeaturedBusinesses } from "@/components/home/FeaturedBusinesses";
import { CommunitySection } from "@/components/home/CommunitySection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedBusinesses />
      <FeaturedListings />
      <CommunitySection />
      <CTASection />
    </>
  );
};

export default Index;
