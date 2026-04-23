import api from "./api";

export const getAllParkings = async () => {
  const res = await api.get("/parkings");
  return res.data;
};

export const getParkingById = async (id) => {
  const res = await api.get(`/parkings/${id}`);
  return res.data;
};