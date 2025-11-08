import FinalProjectSection from "@/components/sections/FinalProjectSection";
import FooterSection from "@/components/sections/FooterSection";
import HeaderSection from "@/components/sections/HeaderSection";
import HeroSection from "@/components/sections/HeroSection";
import OurTeamSection from "@/components/sections/OurTeamSection";
import OutVisionSection from "@/components/sections/OutVisionSection";
import QandASection from "@/components/sections/QandASection";
import TimelineSection from "@/components/sections/TimelineSection";
import HexagonalBackground from "@/components/HexagonalBackground";

export default function Home() {
  return (
    <div className="relative bg-[#0A0F1A] text-white pt-20 min-h-screen">
      <HexagonalBackground className="fixed inset-0 z-0" opacity={0.6} />
      <div className="relative z-10">
        <HeaderSection />
        <HeroSection />
        <OutVisionSection />
        <TimelineSection />
        <FinalProjectSection />
        <OurTeamSection />
        <QandASection />
        <FooterSection />
      </div>
    </div>
  );
}
