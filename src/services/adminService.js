import api from "./api";

const API_BASE = "/admin";

/* ---------------- DASHBOARD ---------------- */

export const fetchDashboardStats = async () => {
  const { data } = await api.get(`${API_BASE}/dashboard/stats`);
  return data;
};

export const fetchBookingTrends = async () => {
  const { data } = await api.get(`${API_BASE}/analytics/trends`);
  return data;
};

/* ---------------- USERS ---------------- */

export const fetchUsers = async (page = 1, search = "") => {
  const { data } = await api.get(`${API_BASE}/users`, {
    params: { page, limit: 10, search },
  });
  return data;
};

export const updateUserRole = async (userId, role) => {
  const { data } = await api.put(
    `${API_BASE}/users/${userId}/role`,
    { role }
  );
  return data;
};

export const toggleUserBlock = async (userId) => {
  const { data } = await api.patch(
    `${API_BASE}/users/${userId}/block`
  );
  return data;
};

/* ---------------- PARKS ---------------- */

export const fetchParks = async (page = 1, search = "") => {
  const { data } = await api.get(`${API_BASE}/parks`, {
    params: { page, limit: 10, search },
  });
  return data;
};

export const createPark = async (parkData) => {
  const { data } = await api.post(`${API_BASE}/parks`, parkData);
  return data;
};

export const updatePark = async (parkId, parkData) => {
  const { data } = await api.put(
    `${API_BASE}/parks/${parkId}`,
    parkData
  );
  return data;
};

export const deletePark = async (parkId) => {
  const { data } = await api.delete(
    `${API_BASE}/parks/${parkId}`
  );
  return data;
};

/* ---------------- SLOTS ---------------- */

export const fetchSlots = async (
  page = 1,
  search = "",
  parkingId = ""
) => {
  const { data } = await api.get(`${API_BASE}/slots`, {
    params: { page, limit: 10, search, parkingId },
  });
  return data;
};

export const createSlot = async (slotData) => {
  const { data } = await api.post(`${API_BASE}/slots`, slotData);
  return data;
};

export const updateSlot = async (slotId, slotData) => {
  const { data } = await api.put(
    `${API_BASE}/slots/${slotId}`,
    slotData
  );
  return data;
};

export const deleteSlot = async (slotId) => {
  const { data } = await api.delete(
    `${API_BASE}/slots/${slotId}`
  );
  return data;
};

/* ---------------- BOOKINGS ---------------- */

export const fetchBookings = async (
  page = 1,
  search = "",
  filters = {}
) => {
  const { data } = await api.get(`${API_BASE}/bookings`, {
    params: { page, limit: 10, search, ...filters },
  });
  return data;
};

export const updateBookingStatus = async (
  bookingId,
  status,
  paymentStatus = null
) => {
  const payload = {};

  if (status) payload.status = status;
  if (paymentStatus) payload.paymentStatus = paymentStatus;

  const { data } = await api.patch(
    `${API_BASE}/bookings/${bookingId}/status`,
    payload
  );

  return data;
};