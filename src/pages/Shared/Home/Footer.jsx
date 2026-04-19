import React, { useState, useEffect } from 'react';
import {
  FaMapMarkerAlt, FaClock, FaCar, FaParking,
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin,
  FaApple, FaGooglePlay, FaEnvelope, FaPhoneAlt,
  FaInfoCircle, FaQuestionCircle, FaShieldAlt, FaUsers,
  FaArrowRight, FaSyncAlt
} from 'react-icons/fa';
import { MdLocalParking, MdFeedback, MdSupportAgent } from 'react-icons/md';
import { GiTrafficCone } from 'react-icons/gi';

const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [availableSpots, setAvailableSpots] = useState(342);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const TOTAL_PARKING_SPOTS = 1250;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAvailableSpots(prev => {
        const change = Math.floor(Math.random() * 61) - 30;
        let newSpots = prev + change;
        newSpots = Math.min(580, Math.max(120, newSpots));
        return newSpots;
      });
      setLastUpdated(new Date());
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 600);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getCongestionLevel = () => {
    const hour = currentTime.getHours();
    if ((hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 20)) {
      return { level: 'High Congestion', textColor: 'text-red-400', icon: '🔴' };
    } else if ((hour >= 12 && hour <= 16) || (hour >= 21 && hour <= 22)) {
      return { level: 'Moderate Congestion', textColor: 'text-yellow-400', icon: '🟡' };
    }
    return { level: 'Low Congestion', textColor: 'text-green-400', icon: '🟢' };
  };

  const congestion = getCongestionLevel();

  const occupancyRate = ((TOTAL_PARKING_SPOTS - availableSpots) / TOTAL_PARKING_SPOTS) * 100;

  const formattedTime = currentTime.toLocaleTimeString('en-BD', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Dhaka'
  });

  const formattedDate = currentTime.toLocaleDateString('en-BD', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Dhaka'
  });

  const quickLinks = [
    { name: 'Find Parking', href: '#', icon: <FaParking className="mr-2" /> },
    { name: 'Smart Booking', href: '#', icon: <FaClock className="mr-2" /> },
    { name: 'Parking Zones', href: '#', icon: <FaMapMarkerAlt className="mr-2" /> },
    { name: 'Live Tracker', href: '#', icon: <FaCar className="mr-2" /> }
  ];

  const supportLinks = [
    { name: 'Help Center', href: '#', icon: <MdSupportAgent className="mr-2" /> },
    { name: 'Report Issue', href: '#', icon: <MdFeedback className="mr-2" /> },
    { name: 'Safety Tips', href: '#', icon: <FaShieldAlt className="mr-2" /> },
    { name: 'FAQ', href: '#', icon: <FaQuestionCircle className="mr-2" /> }
  ];

  const companyLinks = [
    { name: 'About CityPark', href: '#', icon: <FaInfoCircle className="mr-2" /> },
    { name: 'Our Partners', href: '#', icon: <FaUsers className="mr-2" /> },
    { name: 'Sustainability', href: '#', icon: <GiTrafficCone className="mr-2" /> },
    { name: 'Blog', href: '#', icon: <FaArrowRight className="mr-2" /> }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-12">
      <div className="container mx-auto px-4 md:px-6">

        <div className="mb-10 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-700 shadow-xl">
          <div className="flex flex-row justify-between items-start lg:items-center gap-4">

            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-3 rounded-full">
                <FaParking className="text-green-400 text-2xl" />
              </div>


        
            </div>

            <div className="flex flex-wrap items-center gap-6">

              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{availableSpots}</div>
                <div className="text-xs text-gray-400">Free Spots</div>
              </div>

              <div className="text-center">
                <div className={`text-sm font-semibold ${congestion.textColor}`}>
                  {congestion.icon} {congestion.level}
                </div>
                <div className="text-xs text-gray-400">Traffic</div>
              </div>

              <div className="min-w-[140px]">
                <div className="flex justify-between text-xs mb-1">
                  <span>Occupancy</span>
                  <span>{occupancyRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full"
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
              </div>

            </div>

            <div className="text-right text-xs text-gray-400">
              <div className="flex items-center gap-2 justify-end">
                <FaClock />
                {formattedTime}
              </div>
              <div>{formattedDate}</div>
              <div>{lastUpdated.toLocaleTimeString()}</div>
            </div>

          </div>
        </div>

        <div className="grid grid-cols-5 gap-8 py-6 border-b border-gray-700">

          <div>
            <div className="flex items-center gap-2 mb-4">
              <MdLocalParking className="text-green-400 text-2xl" />
              <span className="text-xl font-bold">CityPark</span>
            </div>
            <p className="text-gray-300 text-sm">
              Smart parking solution for Dhaka city.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Quick Links</h4>
            {quickLinks.map((l, i) => (
              <a key={i} href={l.href} className="block text-gray-300 text-sm hover:text-green-400">
                {l.name}
              </a>
            ))}
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Support</h4>
            {supportLinks.map((l, i) => (
              <a key={i} href={l.href} className="block text-gray-300 text-sm hover:text-green-400">
                {l.name}
              </a>
            ))}
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Company</h4>
            {companyLinks.map((l, i) => (
              <a key={i} href={l.href} className="block text-gray-300 text-sm hover:text-green-400">
                {l.name}
              </a>
            ))}
          </div>

          <div>
            <h4 className="mb-3 font-semibold">Contact</h4>
            <p className="text-sm text-gray-300">Dhaka, Bangladesh</p>
            <p className="text-sm text-gray-300">hello@citypark.com.bd</p>
            <p className="text-sm text-gray-300">+880 1234-567890</p>
          </div>

        </div>

        <div className="pt-6  py-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <div>
            &copy; {new Date().getFullYear()} CityPark — Smart Parking System for Dhaka City. All rights reserved.
          </div>
          <div className="flex gap-4 text-xs">
            <a href="#" className="hover:text-green-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-green-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-green-400 transition">Cookie Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;