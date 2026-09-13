import { HomeFaq } from "@/components/home/home-faq";
import { HomeShowcase } from "@/components/home/home-showcase";
import { LegacyHomepageScripts } from "@/components/home/legacy-homepage-scripts";
import { PublicFooter } from "@/components/site/public-footer";
import { PublicHeader } from "@/components/site/public-header";

export default function HomePage() {
  return (
    <>
      <PublicHeader />
      <main id="acasa">
        <HomeShowcase />
        <HomeFaq />
      </main>
      <PublicFooter />
      <LegacyHomepageScripts />
    </>
  );
}
