// src/context/AdminContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import * as adminService from '../services/adminService';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Dashboard data
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalParks: 0,
    totalSlots: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeBookings: 0,
    pendingPayments: 0,
  });
  const [bookingTrends, setBookingTrends] = useState([]);

  // List data with pagination
  const [users, setUsers] = useState({ data: [], total: 0, page: 1, totalPages: 1 });
  const [parks, setParks] = useState({ data: [], total: 0, page: 1, totalPages: 1 });
  const [slots, setSlots] = useState({ data: [], total: 0, page: 1, totalPages: 1 });
  const [bookings, setBookings] = useState({ data: [], total: 0, page: 1, totalPages: 1 });

  // Toast helpers
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Dashboard
  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const stats = await adminService.fetchDashboardStats();
      setDashboardStats(stats);
      const trends = await adminService.fetchBookingTrends();
      setBookingTrends(trends);
    } catch (error) {
      console.error('Dashboard error:', error);
      addToast(error.response?.data?.message || 'Failed to load dashboard', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Users
  const fetchUsers = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    try {
      const res = await adminService.fetchUsers(page, search);
      setUsers({
        data: (res.users || []).map(u => ({ ...u, id: u._id })),
        total: res.total || 0,
        page: res.page || page,
        totalPages: res.pages || 1,
      });
    } catch (error) {
      console.error('Fetch users error:', error);
      addToast(error.response?.data?.message || 'Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const toggleBlockUser = useCallback(async (userId) => {
    try {
      const updated = await adminService.toggleUserBlock(userId);
      setUsers(prev => ({
        ...prev,
        data: prev.data.map(u => u.id === userId ? { ...updated, id: updated._id } : u),
      }));
      addToast(`User ${updated.isBlocked ? 'blocked' : 'unblocked'} successfully`);
      fetchDashboard();
    } catch (error) {
      console.error('Toggle block error:', error);
      addToast(error.response?.data?.message || 'Action failed', 'error');
    }
  }, [addToast, fetchDashboard]);

  // Slots (defined before parks to avoid reference error)
  const fetchSlots = useCallback(async (page = 1, search = '', parkingId = '') => {
    setLoading(true);
    try {
      const res = await adminService.fetchSlots(page, search, parkingId);
      setSlots({
        data: (res.slots || []).map(s => ({ ...s, id: s._id })),
        total: res.total || 0,
        page: res.page || page,
        totalPages: res.pages || 1,
      });
    } catch (error) {
      console.error('Fetch slots error:', error);
      addToast(error.response?.data?.message || 'Failed to fetch slots', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const createSlot = useCallback(async (slotData) => {
    try {
      const newSlot = await adminService.createSlot(slotData);
      setSlots(prev => ({
        ...prev,
        data: [{ ...newSlot, id: newSlot._id }, ...prev.data],
        total: prev.total + 1,
      }));
      addToast('Slot created successfully');
      fetchDashboard();
    } catch (error) {
      console.error('Create slot error:', error);
      addToast(error.response?.data?.message || 'Failed to create slot', 'error');
    }
  }, [addToast, fetchDashboard]);

  const updateSlot = useCallback(async (slotId, slotData) => {
    try {
      const updated = await adminService.updateSlot(slotId, slotData);
      setSlots(prev => ({
        ...prev,
        data: prev.data.map(s => s.id === slotId ? { ...updated, id: updated._id } : s),
      }));
      addToast('Slot updated successfully');
      fetchDashboard();
    } catch (error) {
      console.error('Update slot error:', error);
      addToast(error.response?.data?.message || 'Failed to update slot', 'error');
    }
  }, [addToast, fetchDashboard]);

  const deleteSlot = useCallback(async (slotId) => {
    try {
      await adminService.deleteSlot(slotId);
      setSlots(prev => ({
        ...prev,
        data: prev.data.filter(s => s.id !== slotId),
        total: prev.total - 1,
      }));
      addToast('Slot deleted successfully');
      fetchDashboard();
    } catch (error) {
      console.error('Delete slot error:', error);
      addToast(error.response?.data?.message || 'Failed to delete slot', 'error');
    }
  }, [addToast, fetchDashboard]);

  // Parks (defined after slots)
  const fetchParks = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    try {
      const res = await adminService.fetchParks(page, search);
      setParks({
        data: (res.parks || []).map(p => ({ ...p, id: p._id })),
        total: res.total || 0,
        page: res.page || page,
        totalPages: res.pages || 1,
      });
    } catch (error) {
      console.error('Fetch parks error:', error);
      addToast(error.response?.data?.message || 'Failed to fetch parks', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const createPark = useCallback(async (parkData) => {
    try {
      const newPark = await adminService.createPark(parkData);
      setParks(prev => ({
        ...prev,
        data: [{ ...newPark, id: newPark._id }, ...prev.data],
        total: prev.total + 1,
      }));
      addToast('Park created successfully');
      fetchDashboard();
    } catch (error) {
      console.error('Create park error:', error);
      addToast(error.response?.data?.message || 'Failed to create park', 'error');
    }
  }, [addToast, fetchDashboard]);

  const updatePark = useCallback(async (parkId, parkData) => {
    try {
      const updated = await adminService.updatePark(parkId, parkData);
      setParks(prev => ({
        ...prev,
        data: prev.data.map(p => p.id === parkId ? { ...updated, id: updated._id } : p),
      }));
      addToast('Park updated successfully');
      fetchDashboard();
    } catch (error) {
      console.error('Update park error:', error);
      addToast(error.response?.data?.message || 'Failed to update park', 'error');
    }
  }, [addToast, fetchDashboard]);

  const deletePark = useCallback(async (parkId) => {
    try {
      await adminService.deletePark(parkId);
      setParks(prev => ({
        ...prev,
        data: prev.data.filter(p => p.id !== parkId),
        total: prev.total - 1,
      }));
      addToast('Park deleted successfully');
      fetchDashboard();
      // Now fetchSlots is defined, so this will work
      fetchSlots(1, '');
    } catch (error) {
      console.error('Delete park error:', error);
      addToast(error.response?.data?.message || 'Failed to delete park', 'error');
    }
  }, [addToast, fetchDashboard, fetchSlots]);

  // Bookings
  const fetchBookings = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    try {
      const res = await adminService.fetchBookings(page, search);
      setBookings({
        data: (res.bookings || []).map(b => ({ ...b, id: b._id })),
        total: res.total || 0,
        page: res.page || page,
        totalPages: res.pages || 1,
      });
    } catch (error) {
      console.error('Fetch bookings error:', error);
      addToast(error.response?.data?.message || 'Failed to fetch bookings', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const updateBooking = useCallback(async (bookingId, status, paymentStatus) => {
    try {
      const updated = await adminService.updateBookingStatus(bookingId, status, paymentStatus);
      setBookings(prev => ({
        ...prev,
        data: prev.data.map(b => b.id === bookingId ? { ...updated, id: updated._id } : b),
      }));
      addToast('Booking updated successfully');
      fetchDashboard();
    } catch (error) {
      console.error('Update booking error:', error);
      addToast(error.response?.data?.message || 'Failed to update booking', 'error');
    }
  }, [addToast, fetchDashboard]);

  const value = {
    loading,
    dashboardStats,
    bookingTrends,
    users,
    parks,
    slots,
    bookings,
    toasts,
    addToast,
    removeToast,
    fetchDashboard,
    fetchUsers,
    fetchParks,
    fetchSlots,
    fetchBookings,
    createPark,
    updatePark,
    deletePark,
    createSlot,
    updateSlot,
    deleteSlot,
    toggleBlockUser,
    updateBooking,
  };

  return React.createElement(AdminContext.Provider, { value }, children);
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
};