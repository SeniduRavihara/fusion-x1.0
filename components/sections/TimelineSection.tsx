"use client";

import TimelineContentSection from "./TimelineContentSection";
import TimelineVideoSection from "./TimelineVideoSection";

const TimelineSection = () => {
  return (
    <section id="timeline" className="w-full py-28 bg-transparent min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Two-column layout: Video (sticky) + Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column: Sticky Robot Video */}
          <TimelineVideoSection />

          {/* Right Column: Timeline Content */}
          <TimelineContentSection />
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
