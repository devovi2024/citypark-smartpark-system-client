import { useEffect } from "react";
import { useBooking } from "../context/BookingContext";

export const useBookingHook = () => {
  const {
    bookings,
    loading,
    bookSlot,
    fetchUserBookings,
    cancelBooking,
  } = useBooking();

  useEffect(() => {
    fetchUserBookings();
  }, []);

  return {
    bookings,
    loading,
    bookSlot,
    cancelBooking,
    refreshBookings: fetchUserBookings,
  };
};