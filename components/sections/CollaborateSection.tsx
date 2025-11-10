import Image from "next/image";
import React from "react";

const CollaborateSection: React.FC = () => {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-lg mb-4">collaborate with</p>
        <div className="bg-gray-800 p-4 rounded-lg inline-block mx-auto">
          <Image
            src="/SLAAIlogo.jpg"
            alt="SLAAI Logo"
            width={200}
            height={100}
          />
        </div>
      </div>
    </section>
  );
};

export default CollaborateSection;
