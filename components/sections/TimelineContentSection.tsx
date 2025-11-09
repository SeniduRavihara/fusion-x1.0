"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

const TimelineContentSection = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Description animation
      gsap.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Timeline items with scroll-triggered highlighting
      itemsRef.current.forEach((item, index) => {
        // Initial state - all items dimmed
        gsap.set(item, { opacity: 0.3, scale: 0.95 });

        // Create ScrollTrigger for each timeline item
        ScrollTrigger.create({
          trigger: item,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            // Highlight current item
            gsap.to(item, {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: "power2.out",
            });
            // Dim previous items
            itemsRef.current.forEach((prevItem, prevIndex) => {
              if (prevIndex < index) {
                gsap.to(prevItem, {
                  opacity: 0.6,
                  scale: 0.98,
                  duration: 0.3,
                });
              }
            });
          },
          onLeaveBack: () => {
            // Dim current item when scrolling back
            gsap.to(item, {
              opacity: 0.3,
              scale: 0.95,
              duration: 0.3,
            });
          },
        });

        // Staggered entrance animation
        gsap.fromTo(
          item,
          {
            opacity: 0,
            x: 50,
            scale: 0.9,
          },
          {
            opacity: 0.3,
            x: 0,
            scale: 0.95,
            duration: 0.8,
            delay: index * 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Progress indicator animation
      if (progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 3,
            ease: "none",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
            },
          }
        );
      }
    }, contentRef);

    return () => ctx.revert();
  }, []);

  const timelineItems = [
    {
      day: "Day 1",
      title: "Python Basics & Fundamentals",
      description:
        "Introduction to Python programming, data structures, and basic concepts essential for AI development.",
    },
    {
      day: "Day 2",
      title: "Neural Networks & Machine Learning",
      description:
        "Hands-on learning about neural networks, basic machine learning algorithms, and practical implementations.",
    },
    {
      day: "Day 3",
      title: "Project Building Workshop",
      description:
        "Collaborative session where participants build two AI projects with guidance from mentors.",
    },
  ];

  return (
    <div ref={contentRef} className="relative">
      <h2 ref={titleRef} className="text-3xl font-bold text-white mb-4">
        Timeline
      </h2>
      <p ref={descriptionRef} className="text-white/90 max-w-3xl mb-12">
        A comprehensive 3-day intensive AI learning experience followed by a
        one-month project development phase.
      </p>

      {/* Extended Timeline line */}
      <div
        className="absolute left-8 top-0 w-0.5 bg-linear-to-b from-purple-500 to-blue-500"
        style={{ height: "calc(100% + 200px)" }}
      ></div>

      <div className="space-y-16">
        {timelineItems.map((item, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) itemsRef.current[index] = el;
            }}
            className="relative flex items-start gap-8"
          >
            {/* Timeline dot */}
            <div className="relative z-10 w-16 h-16 rounded-full bg-linear-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
              {index + 1}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800 transition-all duration-500">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {item.day}: {item.title}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineContentSection;
