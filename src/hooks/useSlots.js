import { useEffect } from "react";
import { useSlotContext } from "../context/SlotContext";

export const useSlots = (parkingId) => {
  const { slots, loading, fetchSlotsByParking } = useSlotContext();

  useEffect(() => {
    if (parkingId) fetchSlotsByParking(parkingId);
  }, [parkingId]);

  return { slots, loading };
};