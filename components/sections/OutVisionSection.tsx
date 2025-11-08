"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BackgroundBeams } from "../ui/background-beams";
import "./OutVisionSection.css";

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
    },
  };

  const visionText =
    "Fusion X 1.0 is dedicated to democratizing artificial intelligence education and empowering the next generation of innovators. Through our intensive 3-day AI learning program, we provide hands-on experience with Python programming, neural networks, and practical project development. Our mission is to bridge the gap between theoretical knowledge and real-world application, fostering a community of AI enthusiasts who can tackle tomorrow's challenges with confidence.";
  const words = visionText.split(" ");

  // Create decorative dots grid
  const createDots = () => {
    const dots = [];
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 3; j++) {
        dots.push(
          <div
            key={`${i}-${j}`}
            className={`dot absolute w-1 h-1 bg-purple-400/30 rounded-full ${
              isVisible ? "animate-fadeIn" : "opacity-0"
            }`}
            style={{
              left: `${i * 5}%`,
              top: `${j * 10 + 5}%`,
              animationDelay: `${(i + j) * 10}ms`,
            }}
          />
        );
      }
    }
    return dots;
  };

  return (
    <div ref={sectionRef} className="w-full  mt-20 overflow-hidden">
      <div className="w-full min-h-[550px] xsm:min-h-[400px] md:min-h-[380px] flex flex-col items-start justify-center relative overflow-hidden">
        {/* Floating decorative circles */}
        <div
          className={`absolute top-10 right-4 w-20 h-20 border border-purple-500/20 rounded-full ${
            isVisible ? "animate-scaleIn" : "opacity-0 scale-0"
          }`}
          style={{ animationDelay: "100ms" }}
        ></div>
        <div
          className={`absolute top-32 right-16 w-12 h-12 border border-purple-500/15 rounded-full ${
            isVisible ? "animate-scaleIn" : "opacity-0 scale-0"
          }`}
          style={{ animationDelay: "200ms" }}
        ></div>
        <div
          className={`absolute bottom-20 left-4 w-16 h-16 border border-purple-500/10 rounded-full ${
            isVisible ? "animate-scaleIn" : "opacity-0 scale-0"
          }`}
          style={{ animationDelay: "300ms" }}
        ></div>

        <div
          id="vision-box"
          className={`bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 backdrop-blur-sm border border-purple-500/20 rounded-3xl text-center xsm:text-start w-[95%] xsm:w-[80%] min-h-[80%] xsm:min-h-full flex items-center justify-center relative flex-col ${
            isVisible ? "animate-slideUp" : "opacity-0 translate-y-16"
          }`}
        >
          {/* Background grid */}
          <div className="absolute inset-0 bg-grid-purple-500/[0.03] bg-size-[20px_20px]" />

          {/* Decorative dots */}
          <div className="absolute opacity-10 inset-0 overflow-hidden">
            {createDots()}
          </div>

          {/* Accent borders */}
          <div
            className={`absolute top-10 left-0 h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent ${
              isVisible ? "animate-expandWidth" : "w-0"
            }`}
            style={{ animationDelay: "600ms" }}
          ></div>
          <div
            className={`absolute bottom-10 left-0 h-px bg-linear-to-r from-transparent via-purple-500/30 to-transparent ${
              isVisible ? "animate-expandWidth" : "w-0"
            }`}
            style={{ animationDelay: "800ms" }}
          ></div>

          {/* Content container */}
          <div className="relative z-10 w-full h-full flex flex-col xsm:flex-row items-center justify-between p-6">
            <motion.div
              className="w-full xsm:w-2/3 text-left mb-6 xsm:mb-0 xsm:mr-6"
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={textVariants}
            >
              {/* Accent slash before heading */}
              <div className="flex items-center mb-4">
                <div className="w-6 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 mr-3"></div>
                <h3 className="text-white text-lg font-medium tracking-wide">
                  OUR VISION
                </h3>
              </div>

              <p className="text-white leading-relaxed">
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

            <div className="relative w-full xsm:w-1/3 flex justify-center">
              {/* Animated rings around image */}
              <div className="absolute inset-0 border border-purple-500/20 rounded-full animate-ping opacity-30"></div>
              <div
                className="absolute inset-4 border border-purple-500/10 rounded-full animate-ping opacity-20"
                style={{ animationDelay: "700ms" }}
              ></div>

              {/* <div
                className={`relative ${isVisible ? "animate-float" : ""}`}
                id="vision-image"
              >
                <Image
                  src="/images/vision.png"
                  alt="Vision Illustration"
                  className="w-[250px] xsm:w-[350px] z-[100] object-cover"
                  width={500}
                  height={375}
                />
              </div> */}
            </div>
          </div>

          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-20 h-20">
            <div className="absolute top-0 right-0 w-20 h-px bg-linear-to-l from-purple-500/30 to-transparent"></div>
            <div className="absolute top-0 right-0 w-px h-20 bg-linear-to-b from-purple-500/30 to-transparent"></div>
          </div>

          <BackgroundBeams className="opacity-30" />
        </div>
      </div>
    </div>
  );
};

export default OutVisionSection;
