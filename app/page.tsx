import { HomeFaq } from "@/components/home/home-faq";
import { HomeActivityVideo } from "@/components/home/home-activity-video";
import { HomeAbout } from "@/components/home/home-about";
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
        <HomeAbout />
      </main>
      <PublicFooter />
      <LegacyHomepageScripts />
    </>
  );
}
