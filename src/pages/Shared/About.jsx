// src/pages/About.jsx
import React from 'react';
import {
  FiMapPin, FiClock, FiShield, FiTrendingUp, FiUsers, FiCheckCircle,
  FiAward, FiGlobe, FiSmartphone, FiZap, FiHeart, FiStar
} from 'react-icons/fi';
import { FaCar, FaParking, FaCity } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className=" bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 ">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4  rounded-full text-sm font-medium mb-6">
              <FiStar className="text-yellow-500" /> Dhaka's #1 Smart Parking Solution
            </div>
          
            <div className="mt-10 flex justify-center gap-4">
              <Link to="/parkings">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition flex items-center gap-2">
                <FaParking /> Find Parking
              </button>
              </Link>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center gap-2">
                <FiSmartphone /> Download App
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                To eliminate parking frustration in Dhaka by providing real‑time availability, 
                seamless digital payments, and eco‑friendly solutions. We're building a smarter 
                urban future, one parking spot at a time.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-gray-700"><FiCheckCircle className="text-green-500" /> 98% User Satisfaction</div>
                <div className="flex items-center gap-2 text-gray-700"><FiTrendingUp className="text-blue-500" /> 50k+ Monthly Bookings</div>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-64 h-64 bg-blue-50 rounded-full flex items-center justify-center">
                <FaCity className="text-blue-200 text-8xl" />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose CityPark?</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Innovative features designed for Dhaka's dynamic lifestyle</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dhaka‑centric stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold">50+</div>
              <div className="text-blue-100 mt-2">Parking Zones in Dhaka</div>
            </div>
            <div>
              <div className="text-4xl font-bold">10k+</div>
              <div className="text-blue-100 mt-2">Active Daily Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold">30%</div>
              <div className="text-blue-100 mt-2">Less Traffic Congestion</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team / Leadership */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Meet the Minds Behind CityPark</h2>
            <p className="mt-4 text-gray-600">Passionate innovators from Dhaka's tech ecosystem</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-4xl font-bold text-blue-600 shadow-md">
                  {member.initial}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-blue-600 text-sm">{member.role}</p>
                <p className="text-gray-500 text-sm mt-2">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>



  
    </div>
  );
};

// Data arrays
const features = [
  { icon: <FiMapPin size={24} />, title: 'Real‑time Availability', description: 'Find open parking spots instantly via our live map, updated every second.' },
  { icon: <FiClock size={24} />, title: 'Smart Reservation', description: 'Book your spot in advance and skip the hassle of searching.' },
  { icon: <FiShield size={24} />, title: 'Secure Payments', description: 'Cashless, encrypted transactions via mobile banking or cards.' },
  { icon: <FiTrendingUp size={24} />, title: 'AI Predictions', description: 'Predict occupancy trends and avoid peak-hour rush.' },
  { icon: <FiUsers size={24} />, title: 'Multi‑user Support', description: 'Manage family vehicles or fleet accounts from one dashboard.' },
  { icon: <FiGlobe size={24} />, title: 'Eco‑Friendly', description: 'Reduce circling emissions – park green, save fuel.' },
];

const team = [
  { initial: 'RH', name: 'Rahim Hossain', role: 'CEO & Co-founder', bio: 'Ex-Google engineer passionate about urban mobility.' },
  { initial: 'NI', name: 'Nusrat Islam', role: 'CTO', bio: 'AI specialist, built Dhaka’s first smart parking prototype.' },
  { initial: 'SA', name: 'Shakil Ahmed', role: 'Head of Operations', bio: '10+ years in logistics & city planning.' },
  { initial: 'FP', name: 'Farzana Parveen', role: 'Product Lead', bio: 'User‑centric designer, winner of Smart City Award 2024.' },
];

export default About;