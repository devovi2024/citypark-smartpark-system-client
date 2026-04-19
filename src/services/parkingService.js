import axiosInstance from "./api";

// GET ALL
export const getAllParkings = async () => {
  const res = await axiosInstance.get("/parkings");
  return res.data;
};

// GET ONE
export const getParkingById = async (id) => {
  const res = await axiosInstance.get(`/parkings/${id}`);
  return res.data;
};

