import { useContext } from "react";
import { ParkingContext } from "../context/ParkingContext";

const useParking = () => {
  return useContext(ParkingContext);
};

export default useParking;