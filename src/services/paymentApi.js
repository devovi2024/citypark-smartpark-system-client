import api from "./api";

export const createPaymentSession = async (bookingId) => {
  const res = await api.post("/payments/create-session", {
    bookingId,
  });

  return res.data;
};