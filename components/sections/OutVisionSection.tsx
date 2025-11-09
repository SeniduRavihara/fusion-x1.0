"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import backgroundImg from "../../assets/background.png";
import { BackgroundBeams } from "../ui/background-beams";

const OutVisionSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Create intersection observer to detect when the section is visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only need to trigger once
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.5,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  const visionText =
    "Fusion X 1.0 is dedicated to democratizing artificial intelligence education and empowering the next generation of innovators. Through our intensive 3-day AI learning program, we provide hands-on experience with Python programming, neural networks, and practical project development. Our mission is to bridge the gap between theoretical knowledge and real-world application, fostering a community of AI enthusiasts who can tackle tomorrow's challenges with confidence.";
  const words = visionText.split(" ");

  return (
    <section
      id="vision"
      className="w-full py-20 bg-black min-h-screen relative"
    >
      {/* Background pattern - top right corner */}
      <div className="absolute top-8 right-8 z-0 opacity-10">
        <Image
          src={backgroundImg}
          alt=""
          width={400}
          height={400}
          className="w-64 h-64 md:w-96 md:h-96 object-contain"
        />
      </div>

      {/* Background pattern - bottom left corner */}
      <div className="absolute bottom-8 left-8 z-0 opacity-10">
        <Image
          src={backgroundImg}
          alt=""
          width={400}
          height={400}
          className="w-64 h-64 md:w-96 md:h-96 object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Vision Content */}
        <div
          ref={sectionRef}
          className="w-full flex flex-col items-center justify-center relative overflow-hidden"
        >
          <motion.div
            className="bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl w-full max-w-6xl p-8 md:p-12 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Background grid */}
            <div className="absolute inset-0 bg-grid-purple-500/[0.03] bg-size-[20px_20px] rounded-3xl" />

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-20 h-20 border border-purple-500/20 rounded-full animate-pulse"></div>
            <div
              className="absolute bottom-4 left-4 w-16 h-16 border border-purple-500/15 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>

            {/* Accent borders */}
            <div className="absolute top-8 left-0 h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent w-full"></div>
            <div className="absolute bottom-8 left-0 h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent w-full"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <motion.div
                className="flex-1 text-center md:text-left"
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={textVariants}
              >
                <div className="flex items-center justify-center md:justify-start mb-6">
                  <div className="w-8 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 mr-4"></div>
                  <h3 className="text-purple-400 text-xl font-semibold tracking-wide">
                    OUR MISSION
                  </h3>
                </div>

                <p className="text-white/90 text-lg leading-relaxed">
                  {words.map((word, i) => (
                    <motion.span
                      key={i}
                      className="inline-block mr-1"
                      variants={wordVariants}
                    >
                      {word}
                    </motion.span>
                  ))}
                </p>
              </motion.div>

              {/* Visual element placeholder */}
              <div className="hidden md:flex flex-1 justify-center">
                <div className="relative w-80 h-80 border border-purple-500/20 rounded-full flex items-center justify-center">
                  <div className="absolute inset-4 border border-purple-500/10 rounded-full animate-ping opacity-30"></div>
                  <div className="text-purple-400 text-6xl font-bold opacity-20">
                    AI
                  </div>
                </div>
              </div>
            </div>

            <BackgroundBeams className="opacity-20" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OutVisionSection;
