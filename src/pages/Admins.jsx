import React, { useState, useEffect } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import {
  FiMenu, FiUsers, FiMapPin, FiCalendar,
  FiPlus, FiEdit2, FiTrash2, FiX
} from 'react-icons/fi';

import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

/* ================= TOAST ================= */
const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed bottom-5 right-5 space-y-2 z-50">
    {toasts.map(t => (
      <div
        key={t.id}
        className="bg-black/80 text-white px-4 py-2 rounded-xl shadow-lg backdrop-blur flex items-center gap-2"
      >
        {t.message}
        <button onClick={() => removeToast(t.id)}><FiX /></button>
      </div>
    ))}
  </div>
);

/* ================= ADMIN ================= */
const Admins = () => {
  const {
    dashboardStats,
    parks,
    bookings,
    users,
    fetchDashboard,
    fetchParks,
    createPark,
    updatePark,
    deletePark,
    toasts,
    removeToast
  } = useAdmin();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [active, setActive] = useState('dashboard');

  const [showModal, setShowModal] = useState(false);
  const [editPark, setEditPark] = useState(null);

  /* ================= LOAD ================= */
  useEffect(() => {
    fetchDashboard();
    fetchParks(1, '');
  }, []);

  const stats = dashboardStats || {};

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    name: '',
    location: { city: '', address: '' },
    totalSlots: 0,
    pricePerHour: 0
  });

  useEffect(() => {
    if (editPark) setForm(editPark);
  }, [editPark]);

  /* ================= SAVE ================= */
  const handleSave = () => {
    if (editPark) updatePark(editPark._id, form);
    else createPark(form);

    setShowModal(false);
    setEditPark(null);
  };

  /* ================= UI CARD ================= */
  const Card = ({ title, value, color }) => (
    <div className={`p-5 rounded-2xl shadow-lg text-white ${color}`}>
      <p className="opacity-80">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200">

      {/* ================= SIDEBAR ================= */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white/70 backdrop-blur-xl shadow-xl transition-all`}>
        <button
          className="p-4 text-xl"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FiMenu />
        </button>

        <div className="space-y-3 p-3">
          <button onClick={() => setActive('dashboard')} className="flex gap-2 hover:bg-blue-100 p-2 rounded">
            📊 Dashboard
          </button>
          <button onClick={() => setActive('parks')} className="flex gap-2 hover:bg-blue-100 p-2 rounded">
            <FiMapPin /> Parks
          </button>
          <button onClick={() => setActive('users')} className="flex gap-2 hover:bg-blue-100 p-2 rounded">
            <FiUsers /> Users
          </button>
          <button onClick={() => setActive('bookings')} className="flex gap-2 hover:bg-blue-100 p-2 rounded">
            <FiCalendar /> Bookings
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* ================= DASHBOARD ================= */}
        {active === 'dashboard' && (
          <div className="space-y-6">

            <div className="grid grid-cols-4 gap-4">
              <Card title="Users" value={stats.totalUsers || 0} color="bg-gradient-to-r from-blue-500 to-blue-700" />
              <Card title="Bookings" value={stats.totalBookings || 0} color="bg-gradient-to-r from-green-500 to-green-700" />
              <Card title="Parks" value={stats.totalParks || 0} color="bg-gradient-to-r from-purple-500 to-purple-700" />
              <Card title="Revenue" value={`$${stats.totalRevenue || 0}`} color="bg-gradient-to-r from-pink-500 to-pink-700" />
            </div>

          </div>
        )}

        {/* ================= PARKS ================= */}
        {active === 'parks' && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-5">

            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Parking Management</h2>

              <button
                onClick={() => {
                  setEditPark(null);
                  setShowModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow"
              >
                <FiPlus /> Add Park
              </button>
            </div>

            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th>Name</th>
                  <th>City</th>
                  <th>Slots</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {parks.data?.map(p => (
                  <tr key={p._id} className="border-b hover:bg-gray-100">
                    <td>{p.name}</td>
                    <td>{p.location?.city}</td>
                    <td>{p.totalSlots}</td>
                    <td>${p.pricePerHour}</td>
                    <td className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditPark(p);
                          setShowModal(true);
                        }}
                        className="text-blue-600"
                      >
                        <FiEdit2 />
                      </button>

                      <button
                        onClick={() => deletePark(p._id)}
                        className="text-red-500"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}

      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur flex items-center justify-center">

          <div className="bg-white rounded-2xl p-6 w-[450px] shadow-2xl">

            <h2 className="text-xl font-bold mb-4">
              {editPark ? 'Edit Park' : 'Add Park'}
            </h2>

            <input
              className="w-full border p-2 rounded mb-2"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="w-full border p-2 rounded mb-2"
              placeholder="City"
              value={form.location.city}
              onChange={e =>
                setForm({
                  ...form,
                  location: { ...form.location, city: e.target.value }
                })
              }
            />

            <input
              className="w-full border p-2 rounded mb-2"
              placeholder="Address"
              value={form.location.address}
              onChange={e =>
                setForm({
                  ...form,
                  location: { ...form.location, address: e.target.value }
                })
              }
            />

            <input
              className="w-full border p-2 rounded mb-2"
              type="number"
              placeholder="Slots"
              value={form.totalSlots}
              onChange={e =>
                setForm({ ...form, totalSlots: +e.target.value })
              }
            />

            <input
              className="w-full border p-2 rounded mb-4"
              type="number"
              placeholder="Price"
              value={form.pricePerHour}
              onChange={e =>
                setForm({ ...form, pricePerHour: +e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl"
              >
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