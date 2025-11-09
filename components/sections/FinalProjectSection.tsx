"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

import backgroundImg from "../../assets/background.png";
import finalProjectImg from "../../assets/final-project-image.png";

const FinalProjectSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Content animation
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Timeline dot animation
      const timelineDot = sectionRef.current?.querySelector(".timeline-dot");
      if (timelineDot) {
        gsap.fromTo(
          timelineDot,
          { scale: 0, rotation: -180 },
          {
            scale: 1,
            rotation: 0,
            duration: 0.8,
            delay: 0.6,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: timelineDot,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  return (
    <section
      ref={sectionRef}
      id="final-project"
      className="w-full pb-20 pt-10 bg-transparent relative"
    >
      {/* Background pattern - top left corner */}
      <div className="absolute top-8 left-8 z-0 opacity-8">
        <Image
          src={backgroundImg}
          alt=""
          width={180}
          height={180}
          className="w-28 h-28 md:w-40 md:h-40 object-contain"
        />
      </div>

      {/* Background pattern - bottom right corner */}
      <div className="absolute bottom-8 right-8 z-0 opacity-8">
        <Image
          src={backgroundImg}
          alt=""
          width={180}
          height={180}
          className="w-28 h-28 md:w-40 md:h-40 object-contain"
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="relative">
          {/* Large connecting border */}
          <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-linear-to-b from-blue-500 to-purple-600"></div>

          {/* Timeline dot for final project */}
          <div className="absolute left-0 top-12 z-10 w-16 h-16 rounded-full bg-linear-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg border-4 border-neutral-900">
            4
          </div>

          {/* Main content with left margin to account for timeline */}
          <div className="ml-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div ref={contentRef}>
              <h2 ref={titleRef} className="text-3xl font-bold text-white mb-4">
                Final Project
              </h2>
              <p className="text-white/90 mb-6">
                After completing the intensive 3-day AI learning program,
                participants embark on a one-month journey to create their own
                AI-powered projects.
              </p>
              <p className="text-white/80 mb-6">
                This extended phase allows you to apply everything you&apos;ve
                learned and explore your creativity. Whether it&apos;s computer
                vision applications, natural language processing, predictive
                analytics, or any other AI domain that interests you, the final
                project is your opportunity to build something meaningful.
              </p>
              <p className="text-white/70 mb-6">
                You&apos;ll receive ongoing mentorship and support throughout
                the month, with regular check-ins and guidance to help you
                overcome challenges and refine your ideas.
              </p>
              <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
                <h3 className="text-xl font-semibold text-white mb-3">
                  Project Requirements
                </h3>
                <ul className="text-white/80 space-y-2">
                  <li>
                    • Must incorporate AI/ML concepts learned during the program
                  </li>
                  <li>• Can be individual or team-based</li>
                  <li>
                    • Should solve a real-world problem or demonstrate
                    innovation
                  </li>
                  <li>• Final presentation and demo required</li>
                </ul>
              </div>
            </div>

            <div
              ref={imageRef}
              className="hidden md:block relative -top-[70px]"
            >
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src={finalProjectImg}
                  alt="Final Project Development"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover "
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white text-lg font-medium">
                    One Month of Innovation
                  </p>
                  <p className="text-white/80 text-sm">
                    Build your AI masterpiece
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalProjectSection;
