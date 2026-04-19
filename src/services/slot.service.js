import api from "./api";

export const getSlotsByParking = async (parkingId) => {
  const res = await api.get(`/slots/parking/${parkingId}`);
  return res.data;
};