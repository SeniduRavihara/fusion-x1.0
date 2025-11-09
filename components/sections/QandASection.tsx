"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

import backgroundImg from "../../assets/background.png";

type QA = {
  id: number;
  question: string;
  answer: string;
};

const qaList: QA[] = [
  {
    id: 1,
    question: "What is Fusion X 1.0?",
    answer:
      "Fusion X 1.0 is a comprehensive 3-day AI learning program followed by a one-month final project phase. Participants learn Python basics, neural networks, and build AI projects with expert guidance.",
  },
  {
    id: 2,
    question: "Do I need prior programming or AI experience?",
    answer:
      "No prior experience is required. The program starts with Python basics and builds up to advanced AI concepts. We welcome beginners and provide all the support needed to succeed.",
  },
  {
    id: 3,
    question: "What will I learn during the 3-day sessions?",
    answer:
      "Day 1: Python fundamentals and programming basics. Day 2: Neural networks and machine learning concepts. Day 3: Hands-on project building with two collaborative AI projects.",
  },
  {
    id: 4,
    question: "What happens during the final project phase?",
    answer:
      "After the 3-day intensive program, you have one month to work on your own AI project. You'll receive ongoing mentorship, regular check-ins, and guidance to develop innovative AI solutions.",
  },
  {
    id: 5,
    question: "What kind of projects can I work on?",
    answer:
      "Any AI-related project that interests you! This could include computer vision applications, natural language processing, predictive analytics, chatbots, recommendation systems, or any innovative AI solution.",
  },
  {
    id: 6,
    question: "Is there any cost to participate?",
    answer:
      "The program details and registration fees will be announced soon. We strive to make AI education accessible to everyone interested in learning.",
  },
];

export default function QandASection() {
  const [openId, setOpenId] = useState<number | null>(qaList[0].id);

  // Refs for animations
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const qaItemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
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

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Q&A items staggered animation
      qaItemsRef.current.forEach((item, index) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Add hover animations
        const handleMouseEnter = () => {
          gsap.to(item, {
            scale: 1.02,
            boxShadow: "0 20px 40px rgba(147, 51, 234, 0.15)",
            duration: 0.3,
            ease: "power2.out",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(item, {
            scale: 1,
            boxShadow: "0 0 0 rgba(147, 51, 234, 0)",
            duration: 0.3,
            ease: "power2.out",
          });
        };

        item.addEventListener("mouseenter", handleMouseEnter);
        item.addEventListener("mouseleave", handleMouseLeave);

        // Cleanup
        return () => {
          item.removeEventListener("mouseenter", handleMouseEnter);
          item.removeEventListener("mouseleave", handleMouseLeave);
        };
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleQA = (id: number) => {
    const newOpenId = openId === id ? null : id;
    setOpenId(newOpenId);

    // Animate the toggle icon
    const itemIndex = qaList.findIndex((item) => item.id === id);
    const itemElement = qaItemsRef.current[itemIndex];
    if (itemElement) {
      const icon = itemElement.querySelector("svg");
      if (icon) {
        gsap.to(icon, {
          rotation: newOpenId === id ? 180 : 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      id="qa"
      className="w-full py-20 bg-black relative"
    >
      {/* Background pattern - top left corner */}
      <div className="absolute top-8 left-8 z-0 opacity-10">
        <Image
          src={backgroundImg}
          alt=""
          width={180}
          height={180}
          className="w-28 h-28 md:w-40 md:h-40 object-contain"
        />
      </div>

      {/* Background pattern - bottom right corner */}
      <div className="absolute bottom-8 right-8 z-0 opacity-10">
        <Image
          src={backgroundImg}
          alt=""
          width={180}
          height={180}
          className="w-28 h-28 md:w-40 md:h-40 object-contain"
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4"
          >
            Questions & Answers
          </h2>
          <p ref={subtitleRef} className="text-white/80 max-w-2xl mx-auto">
            Everything you need to know about Fusion X 1.0 — our AI learning
            program and final project phase.
          </p>
        </div>

        <div className="space-y-4">
          {qaList.map((item, index) => (
            <article
              key={item.id}
              ref={(el: HTMLDivElement | null) => {
                if (el) qaItemsRef.current[index] = el;
              }}
              className={`group relative rounded-2xl p-6 bg-linear-to-br from-neutral-900/60 to-neutral-900/30 border border-purple-800/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:border-purple-600/50`}
            >
              <button
                onClick={() => toggleQA(item.id)}
                aria-expanded={openId === item.id}
                className="w-full text-left flex items-start gap-4"
              >
                <div className="shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold">
                    Q
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {item.question}
                  </h3>
                  <div
                    className={`mt-4 text-white/80 overflow-hidden transition-[max-height] duration-300 ${
                      openId === item.id ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <p className="leading-relaxed">{item.answer}</p>
                  </div>
                </div>
                <div className="ml-4 flex items-center">
                  <svg
                    className="w-5 h-5 text-purple-400 transform transition-transform duration-300"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M6 8l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
