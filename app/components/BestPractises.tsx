import React from 'react';
import Image from 'next/image';

const BestPractises = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 w-full">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-16">Best Practices</h2>
        <div className="space-y-12 sm:space-y-0 sm:flex sm:justify-between">
          {[
            { title: "Be Respectful", description: "Treat your fellow riders with respect and kindness.", icon: "/respect.jpg" },
            { title: "Communicate Clearly", description: "Keep your fellow riders informed about any changes or updates.", icon: "/timer.jpg" },
            { title: "Be Punctual", description: "Arrive on time to ensure a smooth ride for everyone.", icon: "/communication.jpg" }
          ].map((practice, index) => (
            <div key={index} className="relative flex flex-col items-center sm:w-1/3">
              <div className="w-20 h-20 mb-4">
                <Image
                  src={practice.icon}
                  alt={practice.title}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">{practice.title}</h3>
              <p className="text-gray-600 text-center">{practice.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestPractises;
