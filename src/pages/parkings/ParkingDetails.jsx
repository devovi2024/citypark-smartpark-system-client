import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaCar,
  FaDollarSign,
  FaClipboardList,
  FaLocationArrow,
  FaTag,
  FaClock,
  FaShieldAlt,
  FaChargingStation,
  FaBity ,
  FaWifi,
  FaCheckCircle,
  FaSearch,
  FaArrowRight,
  FaTimes,
  FaBuilding,
  FaTicketAlt,
  FaLock,
  FaUserLock,
  FaImage,
  FaDirections,
} from "react-icons/fa";
import { getParkingById } from "../../services/parkingService";
import { useSlots } from "../../hooks/useSlots";
import { useBooking } from "../../context/BookingContext";
import { useSlotContext } from "../../context/SlotContext";
import { useAuth } from "../../context/AuthContext";

// import four-park image 
import Park1 from "../../assets/parks/four-park/bykepark 1.jpg"
import Park2 from "../../assets/parks/four-park/CarPark1.jpg"
import Park3 from "../../assets/parks/four-park/park3.jpg"
import Park4 from "../../assets/parks/four-park/park4.jpg"


// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom parking marker (red)
const parkingIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to center map on parking location
const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
};

const ParkingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [parking, setParking] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingHours, setBookingHours] = useState(1);
  const [filterFloor, setFilterFloor] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchSlot, setSearchSlot] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [gettingDirections, setGettingDirections] = useState(false);

  const { slots, loading: slotsLoading } = useSlots(id);
  const { setSlots } = useSlotContext();
  const { bookSlot } = useBooking();
  const { isAuthenticated } = useAuth();

  // Number of visible slots for non-authenticated users
  const VISIBLE_SLOTS_FOR_GUEST = 3;

  useEffect(() => {
    const loadParking = async () => {
      try {
        const data = await getParkingById(id);
        setParking(data);
      } catch (error) {
        console.error("Failed to load parking details:", error);
      }
    };
    loadParking();
  }, [id]);

  // Filter slots based on floor, type, search, and authentication
  const filteredSlots = useMemo(() => {
    if (!slots) return [];
    let result = slots.filter((slot) => {
      const matchFloor = filterFloor === "all" || slot.floor === parseInt(filterFloor);
      const matchType = filterType === "all" || slot.type === filterType;
      const matchSearch = slot.slotNumber.toLowerCase().includes(searchSlot.toLowerCase());
      return matchFloor && matchType && matchSearch;
    });
    if (!isAuthenticated) {
      result = result.slice(0, VISIBLE_SLOTS_FOR_GUEST);
    }
    return result;
  }, [slots, filterFloor, filterType, searchSlot, isAuthenticated]);

  const totalSlotsCount = slots?.length || 0;
  const availableSlotsCount = slots?.filter((s) => !s.isBooked).length || 0;
  const uniqueFloors = useMemo(() => [...new Set(slots?.map(s => s.floor))].sort((a, b) => a - b), [slots]);
  const uniqueTypes = useMemo(() => [...new Set(slots?.map(s => s.type).filter(Boolean))], [slots]);

  // --- Directions handler ---
  const getDirections = () => {
    if (!parking?.location?.lat || !parking?.location?.lng) {
      alert("Parking location coordinates are not available.");
      return;
    }
    setGettingDirections(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const googleMapsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${parking.location.lat},${parking.location.lng}`;
          window.open(googleMapsUrl, "_blank");
          setGettingDirections(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback: open parking location only
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${parking.location.lat},${parking.location.lng}`;
          window.open(mapsUrl, "_blank");
          setGettingDirections(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setGettingDirections(false);
    }
  };

  const handleBookClick = (slot) => {
    if (!isAuthenticated) {
      alert("Please log in to book a parking slot.");
      return;
    }
    if (slot.isBooked) return;
    setSelectedSlot(slot);
    setBookingHours(1);
    setShowBookingModal(true);
  };

  const handleLoginRedirect = () => {
    navigate("/login", { state: { from: location.pathname } });
  };

  const confirmBooking = async () => {
    if (!selectedSlot || isBooking) return;
    setIsBooking(true);
    try {
      const booking = await bookSlot(selectedSlot, bookingHours);
      if (!booking?._id) {
        alert("Booking failed. Please try again.");
        setIsBooking(false);
        return;
      }
      setBookingSuccess(selectedSlot.slotNumber);
      setTimeout(() => setBookingSuccess(null), 5000);
      setSlots((prev) =>
        prev.map((s) =>
          s._id === selectedSlot._id ? { ...s, isBooked: true } : s
        )
      );
      setShowBookingModal(false);
      setSelectedSlot(null);
    } catch (err) {
      console.error("Booking error:", err);
      alert(err.response?.data?.message || "An error occurred while booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const totalPrice = selectedSlot ? selectedSlot.pricePerHour * bookingHours : 0;

  if (!parking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading parking details...</p>
        </div>
      </div>
    );
  }

  const hasValidCoordinates = parking.location?.lat && parking.location?.lng;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-indigo-900 text-white py-16 px-4">
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold mb-4"
          >
            {parking.name}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mt-6"
          >
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <FaMapMarkerAlt /> {parking.location?.city || "Central District"}
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <FaCar /> {availableSlotsCount} / {totalSlotsCount} spots left
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <FaDollarSign /> {parking.pricePerHour}/hour
            </span>
          </motion.div>
        </div>
      </div>

       {/* 🔥 IMAGE BANNER */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 mb-10">
        <div className="rounded-3xl overflow-hidden shadow-xl relative">
          <img
            src={parking.image || Park1}
            alt="parking"
            className="w-full h-[350px] object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-end p-6 text-white">
            <div>
              <h2 className="text-2xl font-bold">{parking.name}</h2>
              <p>{parking.location?.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Two Column: Info & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Parking Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
          >
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Parking Information</h2>
              </div>
              <div className="space-y-5">
                <div className="flex gap-4 items-start">
                  <FaClipboardList className="text-gray-500 text-xl mt-1" />
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      {parking.description || "This premium parking facility offers 24/7 security, CCTV monitoring, and dedicated EV charging stations. Your vehicle will be safe while you enjoy the city."}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <FaLocationArrow className="text-gray-500 text-xl mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Exact Location</p>
                    <p className="text-gray-600">{parking.location?.address || "123 Main Street, Downtown"}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <FaTag className="text-gray-500 text-xl mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Facility Type</p>
                    <p className="text-gray-600">{parking.type || "Multi-level Smart Parking"}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <FaClock className="text-gray-500 text-xl mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Operating Hours</p>
                    <p className="text-gray-600">Open 24 hours a day, 7 days a week, including holidays</p>
                  </div>
                </div>
              </div>
            </div>
          
          </motion.div>

         {/* Interactive Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
          >
            <div className="p-6 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Live Location Map
                  </h2>
                </div>

                {/* Get Directions Button */}
                {hasValidCoordinates && (
                  <button
                    onClick={getDirections}
                    disabled={gettingDirections}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md text-sm font-medium disabled:opacity-50"
                  >
                    <FaDirections className="h-4 w-4" />
                    {gettingDirections ? "Getting location..." : "Get Directions"}
                  </button>
                )}
              </div>
            </div>

            <div className="h-80 w-full relative">
              {hasValidCoordinates ? (
                <MapContainer
                  center={[parking.location.lat, parking.location.lng]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                  className="z-0"
                  attributionControl={false}   
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  />

                  <Marker
                    position={[parking.location.lat, parking.location.lng]}
                    icon={parkingIcon}
                  >
                    <Popup>
                      <div className="text-center font-sans">
                        <strong className="text-indigo-700">{parking.name}</strong>
                        <br />
                        {parking.location?.address}
                        <br />
                        <span className="text-green-600">
                          ${parking.pricePerHour}/hour
                        </span>
                      </div>
                    </Popup>
                  </Marker>

                  <MapController
                    center={[parking.location.lat, parking.location.lng]}
                  />
                </MapContainer>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-100 rounded-b-2xl">
                  <p className="text-gray-500">Map</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Slots Section with Filters */}
        <div className="mb-12">
          <div className="flex  flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                Select Your Parking Slot
              </h2>
              <p className="text-gray-500 mt-1">Real-time availability - Best price guarantee</p>
            </div>
            {bookingSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border-l-4 border-green-500 text-green-700 px-5 py-3 rounded-xl shadow-md flex items-center gap-2"
              >
                <FaCheckCircle /> Slot {bookingSuccess} booked successfully!
              </motion.div>
            )}
          </div>

          {/* Guest Login Banner */}
          {!isAuthenticated && (
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <FaUserLock className="text-amber-600 text-xl" />
                <div>
                  <p className="text-amber-800 font-medium">Only {VISIBLE_SLOTS_FOR_GUEST} slots are shown</p>
                  <p className="text-amber-700 text-sm">Log in to view and book all available slots.</p>
                </div>
              </div>
              <button
                onClick={handleLoginRedirect}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition shadow-sm text-sm font-medium"
              >
                Login Now
              </button>
            </div>
          )}

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-5 shadow-md mb-8 flex flex-wrap gap-4 items-center justify-between border border-gray-100">
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={filterFloor}
                  onChange={(e) => setFilterFloor(e.target.value)}
                  className="appearance-none bg-gray-100 border border-gray-200 rounded-xl px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="all">All Floors</option>
                  {uniqueFloors.map(floor => (
                    <option key={floor} value={floor}>Floor {floor}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <FaArrowRight className="transform rotate-90 text-xs" />
                </div>
              </div>
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="appearance-none bg-gray-100 border border-gray-200 rounded-xl px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="all">All Types</option>
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <FaArrowRight className="transform rotate-90 text-xs" />
                </div>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search slot number..."
                  value={searchSlot}
                  onChange={(e) => setSearchSlot(e.target.value)}
                  className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-2 pl-9 w-48 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
            <div className="text-sm bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full flex items-center gap-1">
              <FaCar className="text-xs" /> {availableSlotsCount} spots available
            </div>
          </div>

          {/* Slots Grid */}
          {slotsLoading ? (
            <div className="grid grid-cols-3 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md p-5 animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredSlots.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
              <FaTicketAlt className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No matching slots</h3>
              <p className="text-gray-500 mt-2">Try changing your filters or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredSlots.map((slot, idx) => {
                  const isLockedForGuest = !isAuthenticated;
                  return (
                    <motion.div
                      key={slot._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className={`relative group bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${slot.isBooked ? 'opacity-60' : ''}`}>
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-lg font-bold text-gray-900">
                              Slot {slot.slotNumber}
                            </span>
                            {slot.isBooked ? (
                              <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">Booked</span>
                            ) : isLockedForGuest ? (
                              <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <FaLock className="text-xs" /> Locked
                              </span>
                            ) : (
                              <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">Available</span>
                            )}
                          </div>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <FaBuilding /> Floor {slot.floor}
                            </div>
                            {slot.type && (
                              <div className="flex items-center gap-2">
                                <FaTag /> {slot.type}
                              </div>
                            )}
                            <div className="flex items-center gap-2 font-semibold text-indigo-600">
                              <FaDollarSign /> {slot.pricePerHour}/hour
                            </div>
                          </div>
                          <button
                            onClick={() => handleBookClick(slot)}
                            disabled={slot.isBooked || isLockedForGuest}
                            className={`mt-5 w-full py-2.5 rounded-xl font-medium transition-all duration-200 ${
                              slot.isBooked || isLockedForGuest
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg active:scale-95'
                            }`}
                          >
                            {slot.isBooked ? 'Unavailable' : (isLockedForGuest ? 'Login to Book' : 'Book Now →')}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/*  Amenities Section */}
        <div className="mt-16 bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* Left Content */}
  <div className="p-8">
    <div className="flex items-center gap-3 mb-5">
      <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
      <h2 className="text-2xl font-bold text-gray-900">
        Smart Parking Experience
      </h2>
    </div>

    <p className="text-gray-600 leading-relaxed mb-6">
      CityPark — your reliable smart parking solution in Bangladesh.
      We ensure a safe, fast, and hassle-free parking experience with modern
      technology and user-friendly services designed for everyday convenience.
    </p>

    <ul className="space-y-3">
      <li className="flex items-start gap-3">
        <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
        <span className="text-gray-700">
          24/7 security with CCTV monitoring and trained staff
        </span>
      </li>

      <li className="flex items-start gap-3">
        <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
        <span className="text-gray-700">
          Smart parking slots with real-time availability tracking
        </span>
      </li>

      <li className="flex items-start gap-3">
        <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
        <span className="text-gray-700">
          Fast booking system with instant confirmation
        </span>
      </li>

      <li className="flex items-start gap-3">
        <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
        <span className="text-gray-700">
          Affordable pricing with flexible time options
        </span>
      </li>

      <li className="flex items-start gap-3">
        <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
        <span className="text-gray-700">
          Easy access for cars, bikes, and all vehicle types
        </span>
      </li>
    </ul>
  </div>

  {/* Right Gallery */}
  <div className="p-6 bg-gray-50">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <FaImage className="text-indigo-500" /> Parking Gallery
    </h3>

    <div className="grid grid-cols-2 gap-3">
      <img
        src={Park3}
        alt="Modern smart parking"
        className="rounded-xl object-cover w-full h-32 shadow-md hover:shadow-lg transition"
      />
      <img
        src={Park1}
        alt="Parking entry system"
        className="rounded-xl object-cover w-full h-32 shadow-md hover:shadow-lg transition"
      />
      <img
        src={Park2}
        alt="Secure parking area"
        className="rounded-xl object-cover w-full h-32 shadow-md hover:shadow-lg transition"
      />
      <img
        src={Park4}
        alt="CityPark facility"
        className="rounded-xl object-cover w-full h-32 shadow-md hover:shadow-lg transition"
      />
    </div>
  </div>
</div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && selectedSlot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
                <h3 className="text-white text-xl font-bold">Confirm Your Booking</h3>
                <button onClick={() => setShowBookingModal(false)} className="text-white hover:text-gray-200">
                  <FaTimes />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Slot Number:</span>
                    <span className="font-semibold text-gray-900">{selectedSlot.slotNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Floor:</span>
                    <span className="text-gray-900">{selectedSlot.floor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate:</span>
                    <span className="text-gray-900">${selectedSlot.pricePerHour} / hour</span>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Duration (hours)</label>
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={bookingHours}
                      onChange={(e) => setBookingHours(Math.min(24, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none text-gray-900"
                    />
                  </div>
                  <div className="border-t pt-3 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-indigo-600">${totalPrice}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                    disabled={isBooking}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmBooking}
                    disabled={isBooking}
                    className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBooking ? "Processing..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParkingDetails;