import React from 'react';
import { Star, Zap, Shield, Award, Coffee, Globe } from 'lucide-react';

const sponsorsData = [
  {
    id: 1,
    name: "NexGen Mobility",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
    description: "Electric fleet solutions",
    icon: <Zap className="w-4 h-4 text-yellow-500" />,
    tag: "Platinum Partner",
  },
  {
    id: 2,
    name: "CitySense AI",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop",
    description: "Smart traffic analytics",
    icon: <Shield className="w-4 h-4 text-blue-500" />,
    tag: "Tech Pioneer",
  },
  {
    id: 3,
    name: "EcoCharge",
    logo: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=100&h=100&fit=crop",
    description: "EV charging network",
    icon: <Star className="w-4 h-4 text-green-500" />,
    tag: "Green Leader",
  },
  {
    id: 4,
    name: "ParkVision",
    logo: "https://images.unsplash.com/photo-1562911791-c7a97b729ec5?w=100&h=100&fit=crop",
    description: "LPR & occupancy sensors",
    icon: <Award className="w-4 h-4 text-purple-500" />,
    tag: "Innovation Award",
  },
  {
    id: 5,
    name: "UrbanFlow",
    logo: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=100&h=100&fit=crop",
    description: "Mobility as a Service",
    icon: <Coffee className="w-4 h-4 text-amber-500" />,
    tag: "Preferred Partner",
  },
  {
    id: 6,
    name: "DataPark",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop",
    description: "Parking big data",
    icon: <Globe className="w-4 h-4 text-cyan-500" />,
    tag: "Global Alliance",
  },
];

const duplicatedSponsors = [...sponsorsData, ...sponsorsData];

const SponsoredSlider = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 md:py-16">

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-indigo-50 rounded-full px-4 py-1.5 mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full bg-indigo-400"></span>
            <span className="relative h-2 w-2 rounded-full bg-indigo-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Sponsored by industry leaders
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Trusted <span className="text-indigo-600">innovators</span> worldwide
        </h2>
      </div>

      <div className="relative overflow-hidden rounded-2xl">

        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <div className="flex overflow-hidden group">
          <div
            className="flex gap-6 md:gap-8 py-6"
            style={{
              animation: "marqueeRightToLeft 40s linear infinite",
            }}
          >
            {duplicatedSponsors.map((sponsor, idx) => (
              <div
                key={`${sponsor.id}-${idx}`}
                className="flex-shrink-0 w-[260px] md:w-[300px] bg-white/70 rounded-2xl shadow-lg border border-gray-100"
              >
                <div className="p-5">

                  <div className="flex items-start justify-between">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="w-14 h-14 rounded-xl object-cover shadow-md"
                    />
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 uppercase">
                      {sponsor.tag}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-bold text-gray-800 text-lg">{sponsor.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">{sponsor.description}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {sponsor.icon}
                      <span className="text-xs text-gray-400">partner</span>
                    </div>
                    <span className="text-indigo-500 text-xs font-medium cursor-pointer">
                      Learn more →
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes marqueeRightToLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

    </div>
  );
};

export default SponsoredSlider;