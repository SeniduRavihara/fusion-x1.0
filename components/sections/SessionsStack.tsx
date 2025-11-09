"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const timelineData = [
  {
    day: "Day 1",
    title: "Python Basics & Fundamentals",
    description:
      "Introduction to Python programming, data structures, and basic concepts essential for AI development.",
    color: "from-purple-600 to-blue-500",
  },
  {
    day: "Day 2",
    title: "Neural Networks & Machine Learning",
    description:
      "Hands-on learning about neural networks, basic machine learning algorithms, and practical implementations.",
    color: "from-blue-600 to-cyan-500",
  },
  {
    day: "Day 3",
    title: "Project Building Workshop",
    description:
      "Collaborative session where participants build two AI projects with guidance from mentors.",
    color: "from-cyan-600 to-teal-500",
  },
];

const SessionsStack = ({ direction = "vertical" }) => {
  const section = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!section.current) return;

    const ctx = gsap.context(() => {
      if (!section.current) return;
      const items = section.current.querySelectorAll(".item");
      if (!items.length) return;

      items.forEach((item, index) => {
        if (index !== 0) {
          gsap.set(
            item,
            direction === "horizontal" ? { xPercent: 200 } : { yPercent: 200 }
          );
        }
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          pin: true,
          start: "top top",
          end: () => `+=${items.length * 30}%`,
          scrub: 1,
          invalidateOnRefresh: true,
          markers: true,
        },
        defaults: { ease: "none" },
      });

      items.forEach((item, index) => {
        timeline.to(item, { scale: 0.85 });

        if (items[index + 1]) {
          timeline.to(
            items[index + 1],
            direction === "horizontal" ? { xPercent: 0 } : { yPercent: 0 },
            "<"
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, [direction]);

  return (
    <div className="w-full min-h-screen" ref={section}>
      <div
        role="list"
        className="list relative flex items-center justify-center"
      >
        {timelineData.map((item, index) => (
          <div
            key={index}
            role="listitem"
            className={`item absolute top-40 w-full max-w-2xl h-80 bg-gradient-to-br ${item.color} rounded-2xl shadow-2xl p-8 border border-white/10`}
          >
            {/* Day Badge */}
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <span className="text-white font-bold text-lg">{item.day}</span>
            </div>

            {/* Title */}
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-white/90 text-lg leading-relaxed">
              {item.description}
            </p>

            {/* Decorative element */}
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10 blur-2xl"></div>
            <div className="absolute bottom-4 left-4 w-32 h-32 rounded-full bg-white/5 blur-3xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionsStack;
