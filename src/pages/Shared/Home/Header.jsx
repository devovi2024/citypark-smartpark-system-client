import { useState, useEffect } from "react";
import useParking from "../../../hooks/useParking";
import banner from "../../../assets/car-park.mp4";
import { Link } from "react-router-dom";
import {
  Car,
  Search,
  MapPin,
  Sparkles,
  Navigation,
  ChevronRight,
} from "lucide-react";

export default function Header() {
  const { parkings = [] } = useParking();
  const [tab, setTab] = useState("");
  const [search, setSearch] = useState("");
  const [showAllParks, setShowAllParks] = useState(false);

  useEffect(() => {
    const handleScroll = () => {};
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filtered = parkings.filter((p) => {
    const name = p.name?.toLowerCase() || "";
    const address = p.location?.address?.toLowerCase() || "";
    const city = p.location?.city?.toLowerCase() || "";
    return (
      name.includes(search.toLowerCase()) ||
      address.includes(search.toLowerCase()) ||
      city.includes(search.toLowerCase())
    );
  });

  const tabs = [
    { id: "parks", label: "Parking Lots", icon: Car },
    { id: "finds", label: "Find Parking", icon: Search },
    { id: "locations", label: "Locations", icon: MapPin },
  ];

  const displayedParks = showAllParks ? parkings : parkings.slice(0, 3);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
        >
          <source src={banner} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 mx-auto sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center justify-center min-h-screen">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">
              Smart Parking for <br />
              <span className="bg-gradient-to-r from-blue-300 to-indigo-200 bg-clip-text text-transparent">
                Dhaka City
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-100 max-w-lg mx-auto drop-shadow">
              Find, reserve, and pay for parking in seconds. Over 50+ locations across the capital.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/parkings"
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Navigation size={18} /> Find Parking
              </Link>
              <button className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl font-semibold hover:bg-white/30 transition flex items-center gap-2">
                <Sparkles size={18} /> How It Works
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center overflow-x-auto py-3">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTab(t.id);
                    if (t.id !== "parks") setShowAllParks(false);
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${
                    tab === t.id
                      ? "bg-white text-blue-600 shadow-md"
                      : "text-gray-600 hover:text-blue-600 hover:bg-white/50"
                  }`}
                >
                  <t.icon size={18} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {tab === "parks" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {showAllParks ? "All Parking Lots" : "Featured Parking Lots"}
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {parkings.length} locations
              </span>
            </div>

            <div className="grid grid-cols-3 gap-8">
              {displayedParks.map((p) => (
                <div
                  key={p._id}
                  className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* ✅ FIXED IMAGE */}
                  <div className="h-36 relative overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-1 bg-white/90 rounded-lg text-xs font-semibold text-gray-700">
                        {p.type || "Standard"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{p.name}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                      <MapPin size={14} />
                      <span>
                        {p.location?.city}, {p.location?.address?.split(",")[0]}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Available Spots</p>
                        <p className="text-2xl font-bold text-green-600">
                          {p.availableSlots}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Price / Hour</p>
                        <p className="text-xl font-bold text-blue-600">
                          ${p.pricePerHour}
                        </p>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${(p.availableSlots / p.totalSlots) * 100}%`,
                        }}
                      />
                    </div>

                    <Link
                      to={`/parkings/${p._id}`}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 rounded-xl text-gray-700 font-medium hover:bg-blue-600 hover:text-white transition-all"
                    >
                      Book Now <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {parkings.length > 3 && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setShowAllParks(!showAllParks)}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition flex items-center gap-2"
                >
                  {showAllParks ? "Show Less" : "View All"} ({parkings.length} lots)
                </button>
              </div>
            )}
          </div>
        )}

        {/* FIND TAB */}
        {tab === "finds" && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {filtered.map((p) => (
                  <Link
                    to={`/parkings/${p._id}`}
                    key={p._id}
                    className="flex justify-between p-4 border rounded-xl hover:shadow-md"
                  >
                    <div>
                      <h3>{p.name}</h3>
                      <p className="text-sm text-gray-500">{p.location?.city}</p>
                    </div>
                    <ChevronRight />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LOCATIONS */}
        {tab === "locations" && (
          <div className="grid grid-cols-3 gap-6">
            {parkings.map((p) => (
              <div key={p._id} className="p-5 border rounded-xl">
                <h3>{p.location?.city}</h3>
                <p>{p.location?.address}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}