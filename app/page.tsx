import { HomeFaq } from "@/components/home/home-faq";
import { HomeActivityVideo } from "@/components/home/home-activity-video";
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
        <HomeActivityVideo />
        <HomeFaq />
      </main>
      <PublicFooter />
      <LegacyHomepageScripts />
    </>
  );
}
