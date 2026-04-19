import { createContext, useContext, useState } from "react";
import * as bookingService from "../services/bookingService";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Updated bookSlot: now accepts slot object and hours
  const bookSlot = async (slot, hours = 1) => {
    try {
      setLoading(true);
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + hours * 60 * 60 * 1000);

      const payload = {
        slotId: slot._id,
        parkingId: slot.parkingId, // ensure your slot object has parkingId
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        hours: hours,
        totalPrice: slot.pricePerHour * hours,
      };

      const booking = await bookingService.createBooking(payload);
      setBookings((prev) => [booking, ...prev]);
      return booking;
    } catch (err) {
      console.error("Booking error:", err);
      throw err; // re-throw so component can handle it
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingService.getUserBookings();
      setBookings(res?.bookings || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    try {
      await bookingService.cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <BookingContext.Provider
      value={{ bookings, loading, bookSlot, fetchUserBookings, cancelBooking }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);