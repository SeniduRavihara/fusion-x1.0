"use client";

import SessionsStack from "./SessionsStack";
import TimelineVideoSection from "./TimelineVideoSection";

const TimelineSection = () => {
  return (
    <section id="timeline" className="w-full py-28 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            3-Day AI Learning Journey
          </h2>
          <p className="text-white/70 text-lg max-w-3xl">
            A comprehensive intensive learning experience designed to transform
            beginners into AI practitioners.
          </p>
        </div>

        {/* Two-column layout: Video (sticky) + Timeline Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column: Sticky Robot Video */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <TimelineVideoSection />
          </div>

          {/* Right Column: Stacked Cards */}
          <div className="relative">
            <SessionsStack />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
