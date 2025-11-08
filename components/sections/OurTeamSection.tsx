"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Inline chevron icons (small, no dependency)
function ChevronLeftIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={props.className}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={props.className}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
    </svg>
  );
}

// Team member interface
interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

// Team members array - easily add or modify members here
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Olivia Wilson",
    role: "Manager",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Avery Davis",
    role: "CEO",
    image:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Benjamin Shah",
    role: "Marketing",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Emma Rodriguez",
    role: "Designer",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    id: 5,
    name: "Michael Chen",
    role: "Developer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  },
];

export default function OurTeamSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Responsive items per view
  const getItemsPerView = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1280) return 4; // xl
      if (window.innerWidth >= 1024) return 3; // lg
      if (window.innerWidth >= 768) return 2; // md
      return 1; // sm and below
    }
    return 3; // default
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());
  const maxIndex = Math.max(0, teamMembers.length - itemsPerView);

  // Update items per view on resize
  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="relative min-h-screen bg-black py-20 px-4 overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-purple-900/20 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-purple-900/20 blur-3xl" />

      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-white text-center mb-20 tracking-tight">
          Meet Our Team
        </h1>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-purple-600/20 hover:bg-purple-600/40 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 border border-purple-500/30"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-purple-600/20 hover:bg-purple-600/40 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 border border-purple-500/30"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          {/* Carousel Wrapper */}
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerView)
                }%)`,
              }}
            >
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="shrink-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4 flex flex-col items-center group"
                >
                  {/* Card Container with Hover Effect */}
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:bg-gray-800/50 hover:shadow-2xl hover:shadow-purple-500/20 w-full max-w-sm">
                    {/* Image Container with Glow Effect */}
                    <div className="relative mb-6 flex justify-center">
                      {/* Outer glow ring */}
                      <div className="absolute inset-0 rounded-full bg-linear-to-br from-purple-600 via-pink-500 to-blue-500 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 scale-110" />

                      {/* Border ring */}
                      <div className="relative rounded-full p-1 bg-linear-to-br from-purple-600 via-pink-500 to-blue-500">
                        {/* Image */}
                        <div className="relative w-48 h-48 rounded-full overflow-hidden bg-black">
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-linear-to-br from-purple-600/40 via-transparent to-blue-600/40 mix-blend-overlay" />
                        </div>
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-300 italic">
                        {member.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-12">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "bg-purple-500 w-8"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
