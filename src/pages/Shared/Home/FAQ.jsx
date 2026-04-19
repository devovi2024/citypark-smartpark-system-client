import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as BiIcons from "react-icons/bi";
import faqImage from "../../../assets/faq.png";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "How do I book a parking slot?",
      answer:
        "Search your location, choose a parking, select a time slot, and confirm your booking with secure payment.",
      icon: <FaIcons.FaParking className="text-blue-500" />,
    },
    {
      question: "What payment methods are available?",
      answer:
        "We support bKash, Nagad, Rocket, debit/credit cards, and mobile banking.",
      icon: <FaIcons.FaCreditCard className="text-green-500" />,
    },
    {
      question: "Can I cancel my booking?",
      answer:
        "Yes, you can cancel anytime before the scheduled start time. Refunds take 2-3 business days.",
      icon: <FaIcons.FaUndoAlt className="text-yellow-500" />,
    },
    {
      question: "Is my vehicle safe?",
      answer:
        "All partner parking areas have 24/7 CCTV, security guards, and well-lit spaces.",
      icon: <MdIcons.MdSecurity className="text-red-500" />,
    },
    {
      question: "How do I find nearby parking?",
      answer:
        "Enable location services to find available parking spots near your destination in real-time.",
      icon: <MdIcons.MdLocationOn className="text-purple-500" />,
    },
    {
      question: "What happens if I overstay?",
      answer:
        "Extra charges apply based on the hourly rate. You'll get a notification before extra fees.",
      icon: <FaIcons.FaClock className="text-orange-500" />,
    },
    {
      question: "Do you provide support?",
      answer:
        "Yes! Our support team is available 24/7 via live chat, email, and phone.",
      icon: <BiIcons.BiSupport className="text-teal-500" />,
    },
  ];

  return (
    <div className="bg-gray-50  px-4 ">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-10">
          <FaIcons.FaQuestionCircle className="text-4xl text-blue-500 mx-auto mb-3" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">FAQs</h1>
          <div className="w-20 h-0.5 bg-blue-500 mx-auto mt-2 rounded-full"></div>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            Everything you need to know about parking system
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center">

          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="w-full max-w-md h-[280px] sm:h-[350px] lg:h-[420px] overflow-hidden rounded-2xl shadow-lg">
              <img
                src={faqImage}
                alt="FAQ"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-3">
            {faqData.map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-sm border transition-all ${
                  activeIndex === index
                    ? "border-blue-300"
                    : "border-gray-200"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {item.question}
                    </span>
                  </div>

                  {activeIndex === index ? (
                    <FaIcons.FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaIcons.FaChevronDown className="text-gray-500" />
                  )}
                </button>

                <div
                  className={`px-4 text-gray-600 text-sm sm:text-base overflow-hidden transition-all duration-300 ${
                    activeIndex === index
                      ? "max-h-40 pb-4 pt-1 border-t border-gray-100"
                      : "max-h-0"
                  }`}
                >
                  {item.answer}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default FAQ;