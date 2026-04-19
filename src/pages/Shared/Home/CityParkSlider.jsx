import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import {
  Car,
  Clock,
  MapPin,
  BatteryCharging,
  Gauge,
  Signal,
  Users,
  Zap,
  Leaf,
  Smartphone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "swiper/css";

const slidesData = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1562911791-c7a97b729ec5?q=80&w=2070&auto=format",
    title: "Central Park Garage",
    description:
      "Smart sensors & real-time guidance. 324 total spots with 87 currently free. Reduce search time by 68%.",
    icon1: { Icon: Car, label: "Free Spots", value: "87 available" },
    icon2: { Icon: Clock, label: "Avg. Occupancy", value: "68% filled" },
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=2070&auto=format",
    title: "Tech Hub Plaza",
    description:
      "Automated parking assistant with dynamic pricing & contactless entry. 24/7 AI-driven availability.",
    icon1: { Icon: MapPin, label: "Metro Access", value: "6 min walk" },
    icon2: { Icon: BatteryCharging, label: "EV Chargers", value: "20 stations" },
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2070&auto=format",
    title: "Harbor View Terminal",
    description:
      "License plate recognition, reduced CO₂ emissions, and 24/7 security with IoT monitoring.",
    icon1: { Icon: Gauge, label: "Real-Time Accuracy", value: "85% precision" },
    icon2: { Icon: Signal, label: "Connectivity", value: "5G IoT mesh" },
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format",
    title: "City Center Hub",
    description:
      "High-density zone with predictive availability & mobile app integration. Instant booking.",
    icon1: { Icon: Users, label: "Monthly Passes", value: "200+ active" },
    icon2: { Icon: Zap, label: "Booking Speed", value: "Instant" },
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?q=80&w=2070&auto=format",
    title: "Green Campus",
    description:
      "Solar-powered parking, green initiative, and 15-min fast charging for eco-friendly mobility.",
    icon1: { Icon: Leaf, label: "Eco-Rating", value: "Carbon neutral" },
    icon2: { Icon: Smartphone, label: "App Control", value: "Full remote" },
  },
];

const CityParkSlider = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => swiperInstance?.slidePrev();
  const next = () => swiperInstance?.slideNext();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 relative">
      <div className="relative group rounded-3xl overflow-hidden shadow-2xl">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          loop
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          onSwiper={setSwiperInstance}
          onSlideChange={(s) => setActiveIndex(s.realIndex)}
          className="h-[500px] md:h-[600px]"
        >
          {slidesData.map((slide, idx) => (
            <SwiperSlide key={slide.id}>
              <div
                className="w-full h-full relative bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                    <h2 className="text-2xl md:text-4xl font-bold text-white">
                      {slide.title}
                    </h2>
                    <p className="text-white/90 mt-2 mb-5 text-sm md:text-base">
                      {slide.description}
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-white/20">
                        <slide.icon1.Icon className="w-5 h-5 text-cyan-300" />
                        <div>
                          <p className="text-xs text-white/70">
                            {slide.icon1.label}
                          </p>
                          <p className="text-white text-sm font-semibold">
                            {slide.icon1.value}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-white/20">
                        <slide.icon2.Icon className="w-5 h-5 text-emerald-300" />
                        <div>
                          <p className="text-xs text-white/70">
                            {slide.icon2.label}
                          </p>
                          <p className="text-white text-sm font-semibold">
                            {slide.icon2.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-4 right-4 text-white text-xs bg-black/50 px-3 py-1 rounded-full">
                  {String(idx + 1).padStart(2, "0")} /{" "}
                  {String(slidesData.length).padStart(2, "0")}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
        >
          <ChevronRight />
        </button>

        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
          {slidesData.map((_, i) => (
            <button
              key={i}
              onClick={() => swiperInstance?.slideToLoop(i)}
              className={`rounded-full transition-all ${
                activeIndex === i
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CityParkSlider;