"use client";

import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import logoImg from "../../assets/Final Logo FusionX.png";

// Register ScrollSmoother plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollSmoother);
}

const HeaderSection = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Check if ScrollSmoother is active
      const smoother = ScrollSmoother.get();
      if (smoother) {
        // Use ScrollSmoother's scrollTo method
        smoother.scrollTo(element, true, "top top");
      } else {
        // Fallback to native scrollIntoView
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false); // Close mobile menu if open
  };
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="Home" className="inline-block">
            <Image src={logoImg} alt="FusionX Logo" width={50} height={50} />
          </Link>
        </div>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-8">
          <Link
            href="/registerpage"
            className="text-sm font-medium text-white hover:text-purple-400 transition-colors"
          >
            Register
          </Link>
          {/* <button
            onClick={() => scrollToSection("out-vision")}
            className="text-sm font-medium text-white hover:text-purple-400 transition-colors"
          >
            Our Vision
          </button> */}
          <button
            onClick={() => scrollToSection("timeline")}
            className="text-sm font-medium text-white hover:text-purple-400 transition-colors"
          >
            Timeline
          </button>
          <button
            onClick={() => scrollToSection("final-project")}
            className="text-sm font-medium text-white hover:text-purple-400 transition-colors"
          >
            Final Project
          </button>
          <button
            onClick={() => scrollToSection("our-team")}
            className="text-sm font-medium text-white hover:text-purple-400 transition-colors"
          >
            Our Team
          </button>
          <button
            onClick={() => scrollToSection("qa")}
            className="text-sm font-medium text-white hover:text-purple-400 transition-colors"
          >
            Q&amp;A
          </button>
        </nav>

        {/* mobile menu */}
        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            className="text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-md border-b border-neutral-800">
            <nav className="flex flex-col items-center py-6 space-y-4">
              <Link
                href="/registerpage"
                className="text-sm font-medium text-white hover:text-purple-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
              <button
                onClick={() => scrollToSection("out-vision")}
                className="text-sm font-medium text-white hover:text-purple-400 transition-colors"
              >
                Our Vision
              </button>
              <button
                onClick={() => scrollToSection("timeline")}
                className="text-sm font-medium text-white hover:text-purple-400 transition-colors"
              >
                Timeline
              </button>
              <button
                onClick={() => scrollToSection("final-project")}
                className="text-sm font-medium text-white hover:text-purple-400 transition-colors"
              >
                Final Project
              </button>
              <button
                onClick={() => scrollToSection("our-team")}
                className="text-sm font-medium text-white hover:text-purple-400 transition-colors"
              >
                Our Team
              </button>
              <button
                onClick={() => scrollToSection("qa")}
                className="text-sm font-medium text-white hover:text-purple-400 transition-colors"
              >
                Q&amp;A
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderSection;
