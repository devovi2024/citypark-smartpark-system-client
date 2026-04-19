import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { FaQuoteLeft, FaStar, FaHeart, FaAward, FaTwitter, FaLeaf, FaBolt, FaTachometerAlt, FaClock, FaMobileAlt, FaSignal, FaBrain, FaChartLine, FaCommentDots, FaAsymmetrik  } from 'react-icons/fa';
import { GiSparkles } from 'react-icons/gi';
import { MdTrendingUp } from 'react-icons/md';

// Import Swiper core styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const TestimonialSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      role: "Head of Urban Mobility",
      company: "CityPark Solutions",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "This smart parking system reduced our downtown congestion by 42% within three months. The real-time data integration is flawless and the user experience is outstanding.",
      rating: 5,
      icon1: <FaCommentDots className="w-4 h-4 text-blue-400" />,
      icon2: <FaAward className="w-4 h-4 text-amber-400" />,
      iconLabel1: "Verified Partner",
      iconLabel2: "Top Innovator",
    },
    {
      id: 2,
      name: "Marcus Rivera",
      role: "CTO, GreenFleet",
      company: "EV Infrastructure",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Finally a parking solution that thinks ahead. The predictive availability feature alone saves our drivers over 15 minutes per trip. Highly recommended for any smart city project.",
      rating: 5,
      icon1: <GiSparkles className="w-4 h-4 text-purple-400" />,
      icon2: <FaHeart className="w-4 h-4 text-rose-400" />,
      iconLabel1: "AI Driven",
      iconLabel2: "User Loved",
    },
    {
      id: 3,
      name: "Elena Kowalski",
      role: "Sustainability Director",
      company: "EcoMetro",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "CityPark's system helped us cut CO₂ emissions from circling cars by 58%. The dashboard is intuitive and the API integration was seamless. A game changer.",
      rating: 5,
      icon1: <FaLeaf className="w-4 h-4 text-emerald-400" />,
      icon2: <FaBolt className="w-4 h-4 text-yellow-400" />,
      iconLabel1: "Carbon Saved",
      iconLabel2: "Energy Smart",
    },
    {
      id: 4,
      name: "James Okafor",
      role: "Fleet Manager",
      company: "LogiChain",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      text: "Managing 200+ delivery vans used to be a nightmare. Now with real-time spot suggestions, our drivers find parking in under 2 minutes. Absolute efficiency.",
      rating: 5,
      icon1: <FaTachometerAlt className="w-4 h-4 text-sky-400" />,
      icon2: <FaClock className="w-4 h-4 text-indigo-400" />,
      iconLabel1: "Time Saved",
      iconLabel2: "24/7 Support",
    },
    {
      id: 5,
      name: "Priya Mehta",
      role: "Product Lead",
      company: "MobilityX",
      avatar: "https://randomuser.me/api/portraits/women/89.jpg",
      text: "The attention to detail in the UI and the reliability of the sensor network is top-notch. Our users rate the parking experience 4.9 stars on average.",
      rating: 5,
      icon1: <FaMobileAlt className="w-4 h-4 text-green-400" />,
      icon2: <FaSignal className="w-4 h-4 text-cyan-400" />,
      iconLabel1: "App Ready",
      iconLabel2: "IoT Connected",
    },
    {
      id: 6,
      name: "Dr. Alan Cross",
      role: "Research Fellow",
      company: "Urban AI Lab",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      text: "We analyzed 6 months of traffic data – CityPark reduces parking search time by 71% and increases turnover rates. A must-have for modern cities.",
      rating: 5,
      icon1: <FaBrain className="w-4 h-4 text-violet-400" />,
      icon2: <MdTrendingUp className="w-4 h-4 text-lime-400" />,
      iconLabel1: "AI Validated",
      iconLabel2: "ROI +38%",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 bg-gradient-to-br from-slate-50 to-gray-100 rounded-3xl my-8">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 shadow-sm">
          <FaQuoteLeft className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">Trusted by industry leaders</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          What our <span className="text-indigo-600">partners</span> say
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto mt-4 text-lg">
          Real results from real cities — transforming urban parking with AI
        </p>
      </div>

      {/* Premium 3D Coverflow Slider */}
      <div className="relative">
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="testimonial-coverflow"
        >
          {testimonials.map((item, idx) => (
            <SwiperSlide key={item.id} className="!w-[280px] md:!w-[380px] lg:!w-[420px] py-8">
              {({ isActive }) => (
                <div
                  className={`transition-all duration-500 ease-out rounded-3xl backdrop-blur-sm ${
                    isActive
                      ? 'bg-white/90 shadow-2xl scale-105 ring-2 ring-indigo-500/30'
                      : 'bg-white/60 shadow-lg scale-90 opacity-80 hover:opacity-100'
                  } p-6 md:p-8 border border-white/50`}
                >
                  {/* Quote Icon & Rating */}
                  <div className="flex justify-between items-start mb-4">
                    <FaQuoteLeft className={`w-8 h-8 ${isActive ? 'text-indigo-500' : 'text-gray-400'} opacity-70`} />
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6 italic">
                    "{item.text}"
                  </p>

                  {/* Avatar & Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-200"
                    />
                    <div>
                      <h4 className="font-bold text-gray-800">{item.name}</h4>
                      <p className="text-xs text-gray-500">
                        {item.role} • {item.company}
                      </p>
                    </div>
                  </div>

                  {/* Two Unique Icons with Labels */}
                  <div className="mt-5 pt-4 border-t border-gray-200 flex justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-50 rounded-full">
                        {item.icon1}
                      </div>
                      <span className="text-xs font-medium text-gray-600">{item.iconLabel1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-50 rounded-full">
                        {item.icon2}
                      </div>
                      <span className="text-xs font-medium text-gray-600">{item.iconLabel2}</span>
                    </div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button className="swiper-button-prev-custom absolute left-2 md:left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur text-gray-700 flex items-center justify-center shadow-md hover:bg-indigo-500 hover:text-white transition-all duration-200 focus:outline-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="swiper-button-next-custom absolute right-2 md:right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur text-gray-700 flex items-center justify-center shadow-md hover:bg-indigo-500 hover:text-white transition-all duration-200 focus:outline-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Pagination styling (scoped) */}
      <style jsx>{`
        .testimonial-coverflow .swiper-pagination-bullet {
          background: #cbd5e1;
          opacity: 0.7;
          transition: all 0.2s;
        }
        .testimonial-coverflow .swiper-pagination-bullet-active {
          background: #6366f1;
          width: 1.5rem;
          border-radius: 0.5rem;
        }
        .testimonial-coverflow .swiper-pagination {
          bottom: -0.5rem !important;
        }
      `}</style>

 
    </div>
  );
};

export default TestimonialSlider;