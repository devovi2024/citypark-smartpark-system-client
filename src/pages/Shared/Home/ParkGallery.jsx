import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";

const DEFAULT_PARKINGS = [
  {
    id: 1,
    name: "Central Plaza Parking",
    location: "Downtown, Main Street",
    image: "https://images.unsplash.com/photo-1470224114664-0c4f6e1f7d7c?w=800&h=600&fit=crop",
    description: "Located in the heart of downtown, Central Plaza Parking offers 24/7 security and premium covered spots.",
    article: "This parking facility features 500+ spaces, EV charging stations, and direct mall access. Recently renovated with smart lighting and real-time availability sensors.",
  },
  {
    id: 2,
    name: "City Center Garage",
    location: "City Center, 5th Ave",
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&h=600&fit=crop",
    description: "Modern multi-level garage with automated entry and exit.",
    article: "Convenient for office workers and shoppers. Monthly passes available with 24/7 security patrols and dedicated bike racks.",
  },
  {
    id: 3,
    name: "Mall Parking",
    location: "Westfield Shopping Mall",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
    description: "Direct access to the mall, covered parking with wide spots.",
    article: "Special rates for movie-goers and restaurant customers. Over 1000 spaces, including VIP zones near the main entrance.",
  },
  {
    id: 4,
    name: "Airport Long Stay",
    location: "International Airport",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
    description: "Secure long-term parking with free shuttle to terminals.",
    article: "Open 24/7 with luggage assistance. Pre-book to save up to 40%. CCTV monitored and insurance included.",
  },
  {
    id: 5,
    name: "Downtown Parking",
    location: "Downtown, River Road",
    image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800&h=600&fit=crop",
    description: "Affordable hourly parking near restaurants and nightlife.",
    article: "Evening flat rate after 6 PM. Easy access to riverwalk and concert venues.",
  },
  {
    id: 6,
    name: "Harbor View Parking",
    location: "Harbor District",
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&h=600&fit=crop",
    description: "Scenic parking with ocean views, near ferry terminal.",
    article: "Reserved spots for electric vehicles. Bike storage and restrooms available.",
  },
];

const ParkGallery = ({ parkings = [] }) => {
  const navigate = useNavigate();
  const data = parkings.length === 0 ? DEFAULT_PARKINGS : parkings;

  const buildPyramidRows = (items) => {
    const rows = [];
    let index = 0;
    let rowSize = 1;
    while (index < items.length) {
      rows.push(items.slice(index, index + rowSize));
      index += rowSize;
      rowSize++;
    }
    return rows;
  };

  const pyramidRows = buildPyramidRows(data);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 250, damping: 18 },
    },
  };

  const handleCardClick = (parking) => {
    navigate(`/parking-detail/${parking.id}`, { state: { parking } });
  };

  return (
    <div className="w-full bg-white md:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          ref={sectionRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col items-center gap-6 md:gap-8"
        >
          {pyramidRows.map((row, rowIdx) => (
            <motion.div
              key={rowIdx}
              variants={rowVariants}
              className="flex flex-wrap justify-center gap-5 md:gap-7"
            >
              {row.map((parking) => (
                <motion.div
                  key={parking.id}
                  variants={cardVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  onClick={() => handleCardClick(parking)}
                  className="relative w-64 sm:w-72 md:w-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer group"
                >
                  <div className="relative h-56 md:h-64 bg-gray-200">
                    <img
                      src={parking.image}
                      alt={parking.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg md:text-xl font-bold truncate">
                      {parking.name}
                    </h3>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/10" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ))}
        </motion.div>

        {data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No parking facilities available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkGallery;