import api from "./api";

// CREATE
export const createBooking = async (data) => {
  const res = await api.post("/bookings", data);
  return res.data;
};

// GET MY BOOKINGS
export const getUserBookings = async () => {
  const res = await api.get("/bookings/me");
  return res.data;
};

// CANCEL
export const cancelBooking = async (id) => {
  const res = await api.patch(`/bookings/${id}/cancel`);
  return res.data;
};