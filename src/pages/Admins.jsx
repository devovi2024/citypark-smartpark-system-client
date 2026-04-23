import React, { useState, useEffect } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import {
  FiMenu, FiUsers, FiMapPin, FiCalendar, FiGrid,
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiX
} from 'react-icons/fi';

import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

/* ================= TOAST ================= */
const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed bottom-5 right-5 space-y-2 z-50">
    {toasts?.map(t => (
      <div key={t.id} className="bg-black text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
        {t.message}
        <button onClick={() => removeToast(t.id)}><FiX /></button>
      </div>
    ))}
  </div>
);

/* ================= MAIN ADMIN ================= */
const Admins = () => {
  const {
    dashboardStats,
    parks,
    slots,
    bookings,
    users,

    fetchDashboard,
    fetchParks,
    fetchSlots,
    fetchBookings,
    fetchUsers,

    createPark,
    updatePark,
    deletePark,

    createSlot,
    updateSlot,
    deleteSlot,

    toggleBlockUser,
    updateBooking,

    toasts,
    removeToast
  } = useAdmin();

  /* ================= STATE ================= */
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [showParkModal, setShowParkModal] = useState(false);
  const [editingPark, setEditingPark] = useState(null);

  const [showSlotModal, setShowSlotModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);

  const [parkSearch, setParkSearch] = useState('');

  /* ================= LOAD ================= */
  useEffect(() => {
    fetchDashboard();
    fetchParks(1, '');
    fetchSlots(1, '');
    fetchBookings(1, '');
    fetchUsers(1, '');
  }, []);

  /* ================= SAFE DATA ================= */
  const stats = dashboardStats || {};

  const totalUsers = stats.totalUsers || 0;
  const totalBookings = stats.totalBookings || 0;
  const totalParks = stats.totalParks || 0;
  const totalSlots = stats.totalSlots || 0;
  const totalRevenue = stats.totalRevenue || 0;

  /* ================= PARK FORM ================= */
  const [parkForm, setParkForm] = useState({
    name: '',
    description: '',
    image: '',
    location: { address: '', city: '', lat: 0, lng: 0 },
    totalSlots: 0,
    availableSlots: 0,
    pricePerHour: 0,
    type: 'street'
  });

  useEffect(() => {
    if (editingPark) setParkForm(editingPark);
  }, [editingPark]);

  /* ================= SLOT FORM ================= */
  const [slotForm, setSlotForm] = useState({
    parkingId: '',
    slotNumber: '',
    type: 'car',
    isBooked: false,
    pricePerHour: 0
  });

  useEffect(() => {
    if (editingSlot) setSlotForm(editingSlot);
  }, [editingSlot]);

  /* ================= SAVE PARK ================= */
  const handleSavePark = () => {
    if (editingPark) updatePark(editingPark._id, parkForm);
    else createPark(parkForm);

    setShowParkModal(false);
    setEditingPark(null);
  };

  /* ================= SAVE SLOT ================= */
  const handleSaveSlot = () => {
    if (editingSlot) updateSlot(editingSlot._id, slotForm);
    else createSlot(slotForm);

    setShowSlotModal(false);
    setEditingSlot(null);
  };

  /* ================= UI CARD ================= */
  const Card = ({ title, value }) => (
    <div className="bg-white rounded-2xl shadow p-5">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );

  /* ================= RENDER ================= */
  return (
    <div className="flex h-screen bg-gray-100">

      {/* ================= SIDEBAR ================= */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-xl transition-all`}>
        <button className="p-3" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <FiMenu />
        </button>

        <div className="p-2 space-y-2">
          <button onClick={() => setActive('dashboard')} className="flex gap-2 p-2 hover:bg-gray-200 rounded">
            Dashboard
          </button>
          <button onClick={() => setActive('parks')} className="flex gap-2 p-2 hover:bg-gray-200 rounded">
            <FiMapPin /> Parks
          </button>
          <button onClick={() => setActive('slots')} className="flex gap-2 p-2 hover:bg-gray-200 rounded">
            <FiGrid /> Slots
          </button>
          <button onClick={() => setActive('users')} className="flex gap-2 p-2 hover:bg-gray-200 rounded">
            <FiUsers /> Users
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* DASHBOARD */}
        {active === 'dashboard' && (
          <div className="grid grid-cols-4 gap-4">
            <Card title="Users" value={totalUsers} />
            <Card title="Bookings" value={totalBookings} />
            <Card title="Parks" value={totalParks} />
            <Card title="Revenue" value={`$${totalRevenue}`} />
          </div>
        )}

        {/* ================= PARKS ================= */}
        {active === 'parks' && (
          <div className="bg-white p-4 rounded-2xl shadow">

            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Parking</h2>

              <button
                onClick={() => {
                  setEditingPark(null);
                  setShowParkModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                <FiPlus /> Add
              </button>
            </div>

            <table className="w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>City</th>
                  <th>Slots</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {parks?.data?.map(p => (
                  <tr key={p._id} className="border-b">
                    <td>{p.name}</td>
                    <td>{p.location?.city}</td>
                    <td>{p.totalSlots}</td>
                    <td>{p.pricePerHour}</td>
                    <td className="flex gap-2">
                      <button onClick={() => { setEditingPark(p); setShowParkModal(true); }}>
                        <FiEdit2 />
                      </button>
                      <button onClick={() => deletePark(p._id)}>
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}

        {/* ================= SLOTS ================= */}
        {active === 'slots' && (
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-xl font-bold mb-4">Slots</h2>

            <table className="w-full">
              <thead>
                <tr>
                  <th>Park</th>
                  <th>Slot</th>
                  <th>Type</th>
                  <th>Booked</th>
                  <th>Price</th>
                </tr>
              </thead>

              <tbody>
                {slots?.data?.map(s => (
                  <tr key={s._id} className="border-b">
                    <td>{s.parkingId?.name}</td>
                    <td>{s.slotNumber}</td>
                    <td>{s.type}</td>
                    <td>{s.isBooked ? 'Yes' : 'No'}</td>
                    <td>{s.pricePerHour}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}

      </div>

      {/* ================= PARK MODAL ================= */}
      {showParkModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[450px]">

            <h2 className="text-xl font-bold mb-3">
              {editingPark ? 'Edit Park' : 'Add Park'}
            </h2>

            <input className="border p-2 w-full mb-2"
              placeholder="Name"
              value={parkForm.name}
              onChange={e => setParkForm({ ...parkForm, name: e.target.value })}
            />

            <input className="border p-2 w-full mb-2"
              placeholder="City"
              value={parkForm.location.city}
              onChange={e => setParkForm({
                ...parkForm,
                location: { ...parkForm.location, city: e.target.value }
              })}
            />

            <input className="border p-2 w-full mb-2"
              placeholder="Address"
              value={parkForm.location.address}
              onChange={e => setParkForm({
                ...parkForm,
                location: { ...parkForm.location, address: e.target.value }
              })}
            />

            <input className="border p-2 w-full mb-2"
              type="number"
              placeholder="Slots"
              value={parkForm.totalSlots}
              onChange={e => setParkForm({ ...parkForm, totalSlots: +e.target.value })}
            />

            <input className="border p-2 w-full mb-2"
              type="number"
              placeholder="Price"
              value={parkForm.pricePerHour}
              onChange={e => setParkForm({ ...parkForm, pricePerHour: +e.target.value })}
            />

            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setShowParkModal(false)}>Cancel</button>
              <button onClick={handleSavePark} className="bg-blue-600 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>

          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Admins;