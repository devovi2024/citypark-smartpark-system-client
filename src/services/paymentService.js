import api from "./api";

export const createPaymentSession = async (bookingId, token) => {
  const res = await api.post(
    "/payments/create-session",
    { bookingId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};