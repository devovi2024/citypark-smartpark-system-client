import React, { useEffect, useRef, useState } from 'react';
import {
  FaSearchLocation,
  FaMapMarkerAlt,
  FaCalendarCheck,
  FaCreditCard,
  FaCar,
  FaCheckCircle,
} from 'react-icons/fa';

const HowWorks = () => {
  const [visibleSteps, setVisibleSteps] = useState([]);
  const stepRefs = useRef([]);

  const steps = [
    {
      id: 1,
      title: 'Search Parking',
      description: 'Enter your destination in Dhaka and find nearby parking lots with real-time availability.',
      icon: <FaSearchLocation className="text-white text-3xl" />,
      bgGradient: 'from-blue-500 to-cyan-500',
      delay: 0,
    },
    {
      id: 2,
      title: 'Select Slot',
      description: 'Choose your preferred slot based on price, type, and distance.',
      icon: <FaMapMarkerAlt className="text-white text-3xl" />,
      bgGradient: 'from-indigo-500 to-purple-500',
      delay: 100,
    },
    {
      id: 3,
      title: 'Book Instantly',
      description: 'Confirm in seconds and get instant booking confirmation.',
      icon: <FaCalendarCheck className="text-white text-3xl" />,
      bgGradient: 'from-purple-500 to-pink-500',
      delay: 200,
    },
    {
      id: 4,
      title: 'Secure Payment',
      description: 'Pay via mobile banking or card with full security.',
      icon: <FaCreditCard className="text-white text-3xl" />,
      bgGradient: 'from-green-500 to-teal-500',
      delay: 300,
    },
    {
      id: 5,
      title: 'Park Vehicle',
      description: 'Scan QR code at entry and park easily.',
      icon: <FaCar className="text-white text-3xl" />,
      bgGradient: 'from-orange-500 to-red-500',
      delay: 400,
    },
    {
      id: 6,
      title: 'Enjoy Parking',
      description: 'Your slot is reserved. Park stress-free.',
      icon: <FaCheckCircle className="text-white text-3xl" />,
      bgGradient: 'from-emerald-500 to-green-600',
      delay: 500,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = stepRefs.current.findIndex((ref) => ref === entry.target);
            if (index !== -1 && !visibleSteps.includes(index)) {
              setVisibleSteps((prev) => [...prev, index]);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    stepRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, [visibleSteps]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            How <span className="text-blue-600">CityPark</span> Works
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            From search to parking in a few simple steps
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              ref={(el) => (stepRefs.current[idx] = el)}
              className={`transition-all duration-700 ${
                visibleSteps.includes(idx)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${step.delay}ms` }}
            >
              <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all">
                <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${step.bgGradient} opacity-10 group-hover:opacity-20`} />

                <div className="p-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.bgGradient} flex items-center justify-center mb-5 group-hover:scale-110 transition`}>
                    {step.icon}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl font-bold text-gray-300">0{step.id}</span>
                    <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                  </div>

                  <p className="text-gray-500">{step.description}</p>

                  <div className="mt-4 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowWorks;