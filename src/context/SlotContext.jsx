import { createContext, useContext, useState } from "react";
import * as slotService from "../services/slot.service";

const SlotContext = createContext();

export const SlotProvider = ({ children }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSlotsByParking = async (parkingId) => {
    try {
      setLoading(true);

      const data = await slotService.getSlotsByParking(parkingId);

      setSlots(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SlotContext.Provider value={{ slots, setSlots, loading, fetchSlotsByParking }}>
      {children}
    </SlotContext.Provider>
  );
};

export const useSlotContext = () => useContext(SlotContext);