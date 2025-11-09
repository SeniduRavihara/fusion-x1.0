"use client";

import ScrollVideo from "@/components/ScrollVideo";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

interface TimelineVideoSectionProps {
  onVideoProgress?: (progress: number) => void;
}

const TimelineVideoSection = ({
  onVideoProgress,
}: TimelineVideoSectionProps) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initialize ScrollSmoother if not already done
      let smoother = ScrollSmoother.get();
      if (!smoother) {
        smoother = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 1.5,
          effects: true,
          smoothTouch: 0.1,
        });
      }

      // Video container entrance animation
      gsap.fromTo(
        videoContainerRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: videoContainerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, videoContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="lg:sticky lg:top-8 lg:self-start">
      <div ref={videoContainerRef} className="relative">
        <ScrollVideo
          src="/videos/robo-video-smooth.mp4"
          className="rounded-2xl overflow-hidden w-full"
        />
      </div>
    </div>
  );
};

export default TimelineVideoSection;
