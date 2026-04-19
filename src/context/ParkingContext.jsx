import { createContext, useEffect, useState } from "react";
import * as parkingService from "../services/parkingService";

export const ParkingContext = createContext();

export const ParkingProvider = ({ children }) => {
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FILTER STATES
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("all");

  const fetchParkings = async () => {
    try {
      const data = await parkingService.getAllParkings();
      setParkings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkings();
  }, []);

  // 🔥 FILTER LOGIC
  const filteredParkings = parkings.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.address?.toLowerCase().includes(search.toLowerCase());

    const matchCity =
      city === "all" || p.location?.city === city;

    return matchSearch && matchCity;
  });

  return (
    <ParkingContext.Provider
      value={{
        parkings: filteredParkings,
        allParkings: parkings,
        loading,
        search,
        setSearch,
        city,
        setCity,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};