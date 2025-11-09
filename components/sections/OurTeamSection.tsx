"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import backgroundImg from "../../assets/background.png";

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

// Leadership team interface
interface LeadershipMember {
  id: number;
  name: string;
  role: string;
  position: string;
  image: string;
  github?: string;
  linkedin?: string;
}

// Team member interface
interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  github?: string;
  linkedin?: string;
}

// Leadership team members
const leadershipMembers: LeadershipMember[] = [
  {
    id: 1,
    name: "Nimesha Kavindu Rathnayake",
    role: "Chairperson",
    position: "top",
    image: "/team/Nimesha Rathnayake.jpg",
    github: "https://github.com/Nimesha-Kavindu",
    linkedin: "https://www.linkedin.com/in/nimesha-rathnayake-b95471344",
  },
  {
    id: 2,
    name: "Hashan Vidanagamage",
    role: "Secretary",
    position: "left",
    image: "/team/V.G.Hashan - Secretary.jpg",
    github: "https://github.com/HashanVG",
    linkedin: "https://www.linkedin.com/in/hashan-vidanagamage-73b262391",
  },
  {
    id: 3,
    name: "Ruwanya Wijerathne",
    role: "Treasurer",
    position: "right",
    image: "/team/Ruwanya Wijerathne - Treasurer.jpg",
    linkedin: "https://www.linkedin.com/in/ruwanya-wijerathne-b90691323",
  },
];

// Team members array - easily add or modify members here
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Eranga Kavisanka",
    role: "Head of Teaching Panel",
    image: "/team/Eranga Kavisanka - Head of teaching panel.jpg",
    github: "https://github.com/Eranga035225",
    linkedin:
      "https://www.linkedin.com/in/eranga-kavisanka-ariyarathna-7249592a8",
  },
  {
    id: 5,
    name: "Vishishta Dilsara",
    role: "Head of Marketing and Design Panel",
    image: "/team/Vishishta Dilsara - Head-marketing and design panel.jpg",
  },
  {
    id: 2,
    name: "Maleesha Weerasooriya",
    role: "Head of Finance Team",
    image: "/team/Maleesha Weerasooriya - Head_finance team.jpg",
    github: "https://github.com/maleesha02",
    linkedin: "https://www.linkedin.com/in/maleesha-weerasooriya-7880b4326",
  },
  {
    id: 3,
    name: "Senidu Ravihara",
    role: "Web Master",
    image: "/team/Senidu Ravihara -web master.jpg",
    github: "https://github.com/SeniduRavihara",
    linkedin: "https://www.linkedin.com/in/senidu-ravihara",
  },
  {
    id: 4,
    name: "Thiran Ranathunga",
    role: "Event Management & Delegates Handling Head",
    image:
      "/team/Thiran Ranathunga - Event Management & Delegates Handling Head.jpg",
    github: "https://github.com/thiranRR",
    linkedin: "https://www.linkedin.com/in/thiran-ranathungar",
  },
];

export default function OurTeamSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3); // Default for SSR
  const [dots, setDots] = useState<number[]>([]); // Start empty to avoid hydration mismatch
  const [isMobile, setIsMobile] = useState(false); // Track mobile state

  // Update items per view and dots on mount and resize
  useEffect(() => {
    const updateItemsPerView = () => {
      if (typeof window !== "undefined") {
        const mobile = window.innerWidth < 768;
        const wasMobile = isMobile;
        setIsMobile(mobile);

        // Reset current index when switching between mobile/desktop
        if (wasMobile !== mobile) {
          setCurrentIndex(0);
        }

        let newItemsPerView = 3; // default
        if (window.innerWidth >= 1280) newItemsPerView = 4; // xl
        else if (window.innerWidth >= 1024) newItemsPerView = 3; // lg
        else if (window.innerWidth >= 768) newItemsPerView = 2; // md
        else newItemsPerView = 1; // sm and below

        setItemsPerView(newItemsPerView);

        // Calculate number of dots based on the array we're using
        const membersArray = mobile
          ? [...leadershipMembers, ...teamMembers]
          : teamMembers;
        // Dots should equal the number of possible scroll positions
        const numDots = Math.max(1, membersArray.length - newItemsPerView + 1);
        setDots(Array.from({ length: numDots }, (_, i) => i));
      }
    };

    updateItemsPerView(); // Initial calculation

    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateItemsPerView);
      return () => window.removeEventListener("resize", updateItemsPerView);
    }
  }, [isMobile]);

  // Get the current members array based on mobile state
  const currentMembers = isMobile
    ? [...leadershipMembers, ...teamMembers]
    : teamMembers;
  const maxIndex = Math.max(0, currentMembers.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section
      id="our-team"
      className="relative min-h-screen bg-black py-20 px-4 overflow-hidden"
    >
      {/* Background pattern - top right corner */}
      <div className="absolute top-8 right-8 z-0 opacity-8">
        <Image
          src={backgroundImg}
          alt=""
          width={600}
          height={600}
          className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] object-contain"
        />
      </div>

      {/* Background pattern - bottom left corner */}
      <div className="absolute bottom-8 left-8 z-0 opacity-8">
        <Image
          src={backgroundImg}
          alt=""
          width={600}
          height={600}
          className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] object-contain"
        />
      </div>

      {/* Background decorative circles */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-purple-900/20 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-purple-900/20 blur-3xl" />

      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-white text-center mb-20 tracking-tight">
          Meet Our Team
        </h1>

        {/* Leadership Team - Triangle Layout - Hidden on Mobile */}
        <div className="mb-20 hidden md:block">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 tracking-tight">
            Leadership Team
          </h2>
          <div className="relative flex justify-center items-center min-h-[400px]">
            {/* Top Card - Chairperson */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:bg-gray-800/50 hover:shadow-2xl hover:shadow-purple-500/20 w-72 h-80 flex flex-col items-center">
                <div className="relative mb-4 flex justify-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-black">
                    <Image
                      src={leadershipMembers[0].image}
                      alt={leadershipMembers[0].name}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-purple-600/40 via-transparent to-blue-600/40 mix-blend-overlay" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 text-center">
                  {leadershipMembers[0].name}
                </h3>
                <p className="text-sm text-purple-400 font-medium mb-2 text-center">
                  {leadershipMembers[0].role}
                </p>
                {(leadershipMembers[0].github ||
                  leadershipMembers[0].linkedin) && (
                  <div className="flex justify-center gap-3 mt-2">
                    {leadershipMembers[0].github && (
                      <a
                        href={leadershipMembers[0].github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                        aria-label={`${leadershipMembers[0].name}'s GitHub`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    )}
                    {leadershipMembers[0].linkedin && (
                      <a
                        href={leadershipMembers[0].linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                        aria-label={`${leadershipMembers[0].name}'s LinkedIn`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Left Card - Secretary */}
            <div className="absolute bottom-0 left-1/4 transform -translate-x-1/2 translate-y-8">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:bg-gray-800/50 hover:shadow-2xl hover:shadow-purple-500/20 w-72 h-80 flex flex-col items-center">
                <div className="relative mb-4 flex justify-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-black">
                    <Image
                      src={leadershipMembers[1].image}
                      alt={leadershipMembers[1].name}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-purple-600/40 via-transparent to-blue-600/40 mix-blend-overlay" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 text-center">
                  {leadershipMembers[1].name}
                </h3>
                <p className="text-sm text-purple-400 font-medium mb-2 text-center">
                  {leadershipMembers[1].role}
                </p>
                {(leadershipMembers[1].github ||
                  leadershipMembers[1].linkedin) && (
                  <div className="flex justify-center gap-3 mt-2">
                    {leadershipMembers[1].github && (
                      <a
                        href={leadershipMembers[1].github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                        aria-label={`${leadershipMembers[1].name}'s GitHub`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    )}
                    {leadershipMembers[1].linkedin && (
                      <a
                        href={leadershipMembers[1].linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                        aria-label={`${leadershipMembers[1].name}'s LinkedIn`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Right Card - Treasurer */}
            <div className="absolute bottom-0 right-1/4 transform translate-x-1/2 translate-y-8">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:bg-gray-800/50 hover:shadow-2xl hover:shadow-purple-500/20 w-72 h-80 flex flex-col items-center">
                <div className="relative mb-4 flex justify-center">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-black">
                    <Image
                      src={leadershipMembers[2].image}
                      alt={leadershipMembers[2].name}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-purple-600/40 via-transparent to-blue-600/40 mix-blend-overlay" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 text-center">
                  {leadershipMembers[2].name}
                </h3>
                <p className="text-sm text-purple-400 font-medium mb-2 text-center">
                  {leadershipMembers[2].role}
                </p>
                {(leadershipMembers[2].github ||
                  leadershipMembers[2].linkedin) && (
                  <div className="flex justify-center gap-3 mt-2">
                    {leadershipMembers[2].github && (
                      <a
                        href={leadershipMembers[2].github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                        aria-label={`${leadershipMembers[2].name}'s LinkedIn`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    )}
                    {leadershipMembers[2].linkedin && (
                      <a
                        href={leadershipMembers[2].linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                        aria-label={`${leadershipMembers[2].name}'s LinkedIn`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 tracking-tight">
            {isMobile ? "All Team Members" : "Team Members"}
          </h2>
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
          <div className="overflow-hidden px-4">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerView)
                }%)`,
              }}
            >
              {currentMembers.map((member, index) => (
                <div
                  key={`${member.name}-${index}`}
                  className="shrink-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4 flex flex-col items-center group px-2 h-96"
                >
                  {/* Card Container with Hover Effect */}
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:bg-gray-800/50 hover:shadow-2xl hover:shadow-purple-500/20 w-full h-96 flex flex-col">
                    {/* Image Container */}
                    <div className="relative mb-6 flex justify-center">
                      {/* Image */}
                      <div className="relative w-48 h-48 rounded-full overflow-hidden bg-black">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-linear-to-br from-purple-600/40 via-transparent to-blue-600/40 mix-blend-overlay" />
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
                      {/* Social Links */}
                      {(member.github || member.linkedin) && (
                        <div className="flex justify-center gap-4 mt-3">
                          {member.github && (
                            <a
                              href={member.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-white transition-colors duration-300"
                              aria-label={`${member.name}'s GitHub`}
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                              </svg>
                            </a>
                          )}
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-white transition-colors duration-300"
                              aria-label={`${member.name}'s LinkedIn`}
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                              </svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-12">
            {dots.map((index) => (
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
