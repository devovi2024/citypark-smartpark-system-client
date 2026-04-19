import useParking from "../../hooks/useParking";
import { useEffect, useState } from "react";

const ParkingFilter = () => {
  const { search, setSearch, city, setCity, allParkings, loading } = useParking();
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (Array.isArray(allParkings)) {
      const uniqueCities = [...new Set(
        allParkings
          .map(p => p?.location?.city)
          .filter(Boolean)
      )];
      setCities(uniqueCities);
    }
  }, [allParkings]);

  if (loading) {
    return (
      <div className="bg-white/60 rounded-2xl p-5 mb-8">
        <div className="flex gap-4">
          <div className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse" />
          <div className="w-40 h-12 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 rounded-2xl p-5 mb-8">
      <div className="flex gap-4">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 border rounded-xl"
        />

        {/* CITY */}
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-3 border rounded-xl"
        >
          <option value="all">All Cities</option>
          {cities.map((c, i) => (
            <option key={i}>{c}</option>
          ))}
        </select>

      </div>
    </div>
  );
};

export default ParkingFilter;