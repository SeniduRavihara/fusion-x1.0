"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

import backgroundImg from "../../assets/background.png";
import heroImg from "../../assets/hero-image.png";

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero title animation
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
        }
      );

      // Subtitle animation with delay
      gsap.fromTo(
        subtitleRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.3,
          ease: "power2.out",
        }
      );

      // Button animation with delay
      gsap.fromTo(
        buttonRef.current,
        {
          opacity: 0,
          y: 20,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: 0.6,
          ease: "back.out(1.7)",
        }
      );

      // Image animation from right
      gsap.fromTo(
        imageRef.current,
        {
          opacity: 0,
          x: 100,
          scale: 0.8,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.2,
          delay: 0.4,
          ease: "power3.out",
        }
      );

      // Parallax effect for background
      gsap.to(heroRef.current, {
        backgroundPosition: "50% 100px",
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);
  return (
    <section
      ref={heroRef}
      className="relative w-full h-[calc(100vh-5rem)] overflow-hidden bg-[#000000]"
    >
      {/* logo moved to site header */}

      {/* Background pattern - left top corner */}
      <div className="absolute -top-20 left-8 z-10 opacity-20">
        <Image
          src={backgroundImg}
          alt=""
          width={1000}
          height={1000}
          className="w-[800px] h-[800px] md:w-[1000px] md:h-[1000px] object-contain"
        />
      </div>

      {/* subtle overlay to act like a texture (hex pattern asset not found) */}
      <div
        aria-hidden
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(rgba(64,169,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          mixBlendMode: "overlay",
          opacity: 0.6,
        }}
      />

      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-2 items-center h-[calc(100vh-5rem)]">
        {/* Left column - text */}

        <div className="flex flex-col justify-center h-full px-8 py-20 lg:px-24 lg:py-0">
          <h1
            ref={titleRef}
            style={{ fontFamily: "var(--font-fusionx)" }}
            className="font-fusionx text-[#40A9FF] leading-tight text-5xl sm:text-6xl md:text-[5rem]"
          >
            FusionX 1.0
          </h1>
          <p
            ref={subtitleRef}
            className="mt-6 max-w-xl text-[#F0F4F8] text-base sm:text-lg"
          >
            Empowering the Next Generation with Artificial Intelligence
          </p>

          <div ref={buttonRef} className="mt-8">
            <Link
              href="/registerpage"
              className="group relative inline-flex items-center gap-4"
            >
              {/* Outer purple glow */}
              <div className="absolute -inset-2 bg-purple-600/40 blur-xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Main button container */}
              <div className="relative flex items-center w-[300px]">
                {/* Text container with border */}
                <div className="relative bg-black border-2 border-purple-600 rounded-full px-10 py-4 pr-20 group-hover:border-purple-500 transition-colors duration-300">
                  <span className="text-white text-lg md:text-xl font-normal tracking-wide whitespace-nowrap">
                    Register Now
                  </span>
                </div>

                {/* Arrow circle - positioned to overlap */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center group-hover:bg-purple-500 transition-all duration-300 group-hover:scale-110">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-7 h-7 text-white group-hover:translate-x-1 transition-transform duration-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Right column - image */}
        <div
          ref={imageRef}
          className="hidden md:flex relative mt-10 h-full items-end justify-center px- py-12 lg:py-0"
        >
          <div className="w-full max-w-3xl h-full flex items-end">
            <Image
              src={heroImg}
              alt="Robot"
              className="object-contain w-full h-auto"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          </div>
        </div>
      </div>

      {/* Background pattern - bottom right corner (between hero and mission) */}
      {/* <div className="absolute bottom-8 right-8 z-10 opacity-15">
        <Image
          src={backgroundImg}
          alt=""
          width={600}
          height={600}
          className="w-96 h-96 md:w-[500px] md:h-[500px] object-contain"
        />
      </div> */}
    </section>
  );
};

export default HeroSection;
