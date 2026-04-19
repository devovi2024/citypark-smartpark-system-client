// src/services/adminService.js
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/admin'; // Change to your backend URL

// Helper to get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Dashboard
export const fetchDashboardStats = async () => {
  const { data } = await axios.get(`${API_BASE}/dashboard/stats`, getAuthHeaders());
  return data;
};

export const fetchBookingTrends = async () => {
  const { data } = await axios.get(`${API_BASE}/analytics/trends`, getAuthHeaders());
  return data;
};

// Users
export const fetchUsers = async (page = 1, search = '') => {
  const { data } = await axios.get(`${API_BASE}/users`, {
    params: { page, limit: 10, search },
    ...getAuthHeaders(),
  });
  return data;
};

export const updateUserRole = async (userId, role) => {
  const { data } = await axios.put(`${API_BASE}/users/${userId}/role`, { role }, getAuthHeaders());
  return data;
};

export const toggleUserBlock = async (userId) => {
  const { data } = await axios.patch(`${API_BASE}/users/${userId}/block`, {}, getAuthHeaders());
  return data;
};

// Parks
export const fetchParks = async (page = 1, search = '') => {
  const { data } = await axios.get(`${API_BASE}/parks`, {
    params: { page, limit: 10, search },
    ...getAuthHeaders(),
  });
  return data;
};

export const createPark = async (parkData) => {
  const { data } = await axios.post(`${API_BASE}/parks`, parkData, getAuthHeaders());
  return data;
};

export const updatePark = async (parkId, parkData) => {
  const { data } = await axios.put(`${API_BASE}/parks/${parkId}`, parkData, getAuthHeaders());
  return data;
};

export const deletePark = async (parkId) => {
  const { data } = await axios.delete(`${API_BASE}/parks/${parkId}`, getAuthHeaders());
  return data;
};

// Slots
export const fetchSlots = async (page = 1, search = '', parkingId = '') => {
  const { data } = await axios.get(`${API_BASE}/slots`, {
    params: { page, limit: 10, search, parkingId },
    ...getAuthHeaders(),
  });
  return data;
};

export const createSlot = async (slotData) => {
  const { data } = await axios.post(`${API_BASE}/slots`, slotData, getAuthHeaders());
  return data;
};

export const updateSlot = async (slotId, slotData) => {
  const { data } = await axios.put(`${API_BASE}/slots/${slotId}`, slotData, getAuthHeaders());
  return data;
};

export const deleteSlot = async (slotId) => {
  const { data } = await axios.delete(`${API_BASE}/slots/${slotId}`, getAuthHeaders());
  return data;
};

// Bookings
export const fetchBookings = async (page = 1, search = '', filters = {}) => {
  const { data } = await axios.get(`${API_BASE}/bookings`, {
    params: { page, limit: 10, search, ...filters },
    ...getAuthHeaders(),
  });
  return data;
};

export const updateBookingStatus = async (bookingId, status, paymentStatus = null) => {
  const payload = {};
  if (status) payload.status = status;
  if (paymentStatus) payload.paymentStatus = paymentStatus;
  const { data } = await axios.patch(`${API_BASE}/bookings/${bookingId}/status`, payload, getAuthHeaders());
  return data;
};