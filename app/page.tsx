import CollaborateSection from "@/components/sections/CollaborateSection";
import FinalProjectSection from "@/components/sections/FinalProjectSection";
import FooterSection from "@/components/sections/FooterSection";
import HeaderSection from "@/components/sections/HeaderSection";
import HeroSection from "@/components/sections/HeroSection";
import OurTeamSection from "@/components/sections/OurTeamSection";
import OutVisionSection from "@/components/sections/OutVisionSection";
import QandASection from "@/components/sections/QandASection";
import TimelineSection from "@/components/sections/TimelineSection";

export default function Home() {
  return (
    <div className="bg-[#0A0F1A] text-white pt-20">
      <HeaderSection />
      <HeroSection />
      <OutVisionSection />
      <TimelineSection />
      <FinalProjectSection />
      <CollaborateSection />
      <OurTeamSection />
      <QandASection />
      <FooterSection />
    </div>
  );
}
