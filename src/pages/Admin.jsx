import React, { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  CalendarCheck,
  ParkingSquare,
  Grid3X3,
  Plus,
  Edit,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Car,
  MapPin,
  Users,
  Search,
  Eye,
  RefreshCw,
  Building,
  DollarSign,
  Hash,
  Clock,
  CreditCard,
} from 'lucide-react';

const Admin = () => {
  const {
    bookings = [],
    parkings = [],
    slots = [],
    loading,
    fetchBookings,
    updateStatus,
    updatePayment,
    fetchParkings,
    addParking,
    editParking,
    removeParking,
    fetchSlots,
    addSlot,
    editSlot,
    removeSlot,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('bookings');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Modal States
  const [showParkingModal, setShowParkingModal] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Parking Form State
  const [parkingForm, setParkingForm] = useState({
    name: '',
    description: '',
    location: { address: '', city: '', lat: '', lng: '' },
    type: '',
    totalSlots: '',
    availableSlots: '',
    pricePerHour: '',
  });

  // Slot Form State
  const [slotForm, setSlotForm] = useState({
    parkingId: '',
    slotNumber: '',
    floor: '',
    type: '',
    pricePerHour: '',
    isBooked: false,
  });

  useEffect(() => {
    fetchBookings();
    fetchParkings();
    fetchSlots();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // ================= BOOKING HANDLERS =================
  const handleUpdateStatus = async (id, status) => {
    try {
      await updateStatus(id, status);
      showToast(`Booking status updated to ${status}`, 'success');
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleUpdatePayment = async (id, paymentStatus) => {
    try {
      await updatePayment(id, paymentStatus);
      showToast(`Payment status updated to ${paymentStatus}`, 'success');
    } catch (err) {
      showToast('Failed to update payment status', 'error');
    }
  };

  // ================= PARKING HANDLERS =================
  const openParkingModal = (parking = null) => {
    if (parking) {
      setEditingItem(parking);
      setParkingForm({
        name: parking.name,
        description: parking.description || '',
        location: {
          address: parking.location?.address || '',
          city: parking.location?.city || '',
          lat: parking.location?.lat || '',
          lng: parking.location?.lng || '',
        },
        type: parking.type || '',
        totalSlots: parking.totalSlots,
        availableSlots: parking.availableSlots,
        pricePerHour: parking.pricePerHour,
      });
    } else {
      setEditingItem(null);
      setParkingForm({
        name: '',
        description: '',
        location: { address: '', city: '', lat: '', lng: '' },
        type: '',
        totalSlots: '',
        availableSlots: '',
        pricePerHour: '',
      });
    }
    setShowParkingModal(true);
  };

  const handleParkingSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        ...parkingForm,
        totalSlots: Number(parkingForm.totalSlots),
        availableSlots: Number(parkingForm.availableSlots),
        pricePerHour: Number(parkingForm.pricePerHour),
        location: {
          ...parkingForm.location,
          lat: parkingForm.location.lat ? Number(parkingForm.location.lat) : undefined,
          lng: parkingForm.location.lng ? Number(parkingForm.location.lng) : undefined,
        },
      };
      if (editingItem) {
        await editParking(editingItem._id, formData);
        showToast('Parking updated successfully', 'success');
      } else {
        await addParking(formData);
        showToast('Parking created successfully', 'success');
      }
      setShowParkingModal(false);
      fetchParkings();
    } catch (err) {
      showToast('Operation failed', 'error');
    }
  };

  const handleDeleteParking = async (id) => {
    if (window.confirm('Are you sure you want to delete this parking?')) {
      try {
        await removeParking(id);
        showToast('Parking deleted successfully', 'success');
        fetchParkings();
      } catch (err) {
        showToast('Failed to delete parking', 'error');
      }
    }
  };

  // ================= SLOT HANDLERS =================
  const openSlotModal = (slot = null) => {
    if (slot) {
      setEditingItem(slot);
      setSlotForm({
        parkingId: slot.parkingId?._id || slot.parkingId,
        slotNumber: slot.slotNumber,
        floor: slot.floor || '',
        type: slot.type || '',
        pricePerHour: slot.pricePerHour,
        isBooked: slot.isBooked || false,
      });
    } else {
      setEditingItem(null);
      setSlotForm({
        parkingId: '',
        slotNumber: '',
        floor: '',
        type: '',
        pricePerHour: '',
        isBooked: false,
      });
    }
    setShowSlotModal(true);
  };

  const handleSlotSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        ...slotForm,
        floor: Number(slotForm.floor),
        pricePerHour: Number(slotForm.pricePerHour),
      };
      if (editingItem) {
        await editSlot(editingItem._id, formData);
        showToast('Slot updated successfully', 'success');
      } else {
        await addSlot(formData);
        showToast('Slot created successfully', 'success');
      }
      setShowSlotModal(false);
      fetchSlots();
    } catch (err) {
      showToast('Operation failed', 'error');
    }
  };

  const handleDeleteSlot = async (id) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      try {
        await removeSlot(id);
        showToast('Slot deleted successfully', 'success');
        fetchSlots();
      } catch (err) {
        showToast('Failed to delete slot', 'error');
      }
    }
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      (booking.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       booking.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       booking.parkingId?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || booking.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const navItems = [
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, color: 'text-indigo-500' },
    { id: 'parkings', label: 'Parking Lots', icon: ParkingSquare, color: 'text-emerald-500' },
    { id: 'slots', label: 'Parking Slots', icon: Grid3X3, color: 'text-amber-500' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden font-sans">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-2 fade-in duration-300 ${
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-80 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-2xl z-10 flex flex-col">
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Car className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"> CityPark</h1>
              <p className="text-xs text-gray-500">Admin Command Center</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-white' : item.color} />
              <span className="font-medium">{item.label}</span>
              {activeTab === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
              )}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200/50">
          <div className="bg-indigo-50/50 rounded-xl p-4">
            <p className="text-xs text-indigo-600 font-medium">System Status</p>
            <p className="text-sm text-gray-700 mt-1">All systems operational</p>
            <div className="mt-3 flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-gray-500">Live API Connected</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/70 backdrop-blur-md border-b border-gray-200/50 px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h2>
            <p className="text-sm text-gray-500 mt-0.5">Manage and monitor all {activeTab}</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (activeTab === 'bookings') fetchBookings();
                if (activeTab === 'parkings') fetchParkings();
                if (activeTab === 'slots') fetchSlots();
              }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <RefreshCw size={18} className="text-gray-500" />
            </button>
            {activeTab !== 'bookings' && (
              <button
                onClick={() => activeTab === 'parkings' ? openParkingModal() : openSlotModal()}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Plus size={18} />
                <span className="font-medium">Create {activeTab === 'parkings' ? 'Parking' : 'Slot'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-8">
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
            </div>
          )}

          {/* ================= BOOKINGS SECTION ================= */}
          {activeTab === 'bookings' && !loading && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-3 flex-1 max-w-md">
                  <Search size={18} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by user name, email or parking..."
                    className="flex-1 bg-transparent outline-none text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                  <select
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                  >
                    <option value="all">All Payments</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              {/* Bookings Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredBookings.map((booking) => (
                  <div key={booking._id} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white text-sm font-medium">Booking #{booking._id.slice(-6)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'confirmed' ? 'bg-green-400 text-white' :
                          booking.status === 'pending' ? 'bg-yellow-400 text-white' :
                          booking.status === 'cancelled' ? 'bg-red-400 text-white' :
                          'bg-blue-400 text-white'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <Users size={20} className="text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{booking.userId?.name || 'N/A'}</h3>
                          <p className="text-sm text-gray-500">{booking.userId?.email || 'No email'}</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Parking</p>
                          <p className="font-medium text-gray-800">{booking.parkingId?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{booking.parkingId?.location?.city || ''}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Slot Number</p>
                          <p className="font-mono font-medium text-gray-800">#{booking.slotId?.slotNumber || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Time</p>
                          <p className="text-sm text-gray-700">
                            {booking.startTime ? new Date(booking.startTime).toLocaleDateString() : 'N/A'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.startTime ? new Date(booking.startTime).toLocaleTimeString() : ''} - {booking.endTime ? new Date(booking.endTime).toLocaleTimeString() : ''}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Price</p>
                          <p className="text-xl font-bold text-indigo-600">${booking.totalPrice}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                        <select
                          value={booking.status}
                          onChange={(e) => handleUpdateStatus(booking._id, e.target.value)}
                          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                        <select
                          value={booking.paymentStatus}
                          onChange={(e) => handleUpdatePayment(booking._id, e.target.value)}
                          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredBookings.length === 0 && (
                <div className="text-center py-12 text-gray-400 bg-white rounded-2xl">No bookings found</div>
              )}
            </div>
          )}

          {/* ================= PARKINGS SECTION ================= */}
          {activeTab === 'parkings' && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parkings.map((parking) => (
                <div key={parking._id} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-500 relative">
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openParkingModal(parking)} className="p-2 bg-white/90 rounded-full text-indigo-600 hover:scale-110 transition">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteParking(parking._id)} className="p-2 bg-white/90 rounded-full text-rose-600 hover:scale-110 transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-1 bg-white/90 rounded-lg text-xs font-semibold text-gray-700">{parking.type || 'Standard'}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800">{parking.name}</h3>
                    <div className="flex items-center gap-1 mt-1 text-gray-500 text-sm">
                      <MapPin size={14} />
                      <span>{parking.location?.city || 'City not set'}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{parking.description || 'No description'}</p>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500">Total Slots</p>
                        <p className="font-semibold text-gray-800 flex items-center gap-1">
                          <Hash size={12} /> {parking.totalSlots}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Available</p>
                        <p className="font-semibold text-emerald-600">{parking.availableSlots}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500">Price Per Hour</p>
                        <p className="font-bold text-indigo-600 text-lg flex items-center gap-1">
                          <DollarSign size={16} /> {parking.pricePerHour}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {parkings.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-400 bg-white rounded-2xl">
                  No parking lots created yet. Click "Create Parking" to add one.
                </div>
              )}
            </div>
          )}

          {/* ================= SLOTS SECTION ================= */}
          {activeTab === 'slots' && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slots.map((slot) => (
                <div key={slot._id} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <div className={`h-24 ${slot.isBooked ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'} relative`}>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openSlotModal(slot)} className="p-2 bg-white/90 rounded-full text-indigo-600 hover:scale-110 transition">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteSlot(slot._id)} className="p-2 bg-white/90 rounded-full text-rose-600 hover:scale-110 transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                      <span className="text-white font-bold text-lg">Slot #{slot.slotNumber}</span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${slot.isBooked ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'}`}>
                        {slot.isBooked ? 'Booked' : 'Available'}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Building size={16} className="text-gray-400" />
                      <span className="font-medium text-gray-800">{slot.parkingId?.name || 'Unknown Parking'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Floor</p>
                        <p className="font-semibold text-gray-800">{slot.floor || 'Ground'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Type</p>
                        <p className="font-semibold text-gray-800">{slot.type || 'Standard'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500">Price Per Hour</p>
                        <p className="text-xl font-bold text-indigo-600 flex items-center gap-1">
                          <DollarSign size={18} /> {slot.pricePerHour}
                        </p>
                      </div>
                    </div>
                    {slot.parkingId?.location?.city && (
                      <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={12} />
                        <span>{slot.parkingId.location.city}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {slots.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-400 bg-white rounded-2xl">
                  No slots available. Click "Create Slot" to add one.
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ================= PARKING MODAL ================= */}
      {showParkingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingItem ? 'Edit Parking' : 'Create New Parking'}</h3>
              <button onClick={() => setShowParkingModal(false)} className="p-1 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleParkingSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" required className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" value={parkingForm.name} onChange={(e) => setParkingForm({...parkingForm, name: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows="2" className="w-full border border-gray-300 rounded-xl px-4 py-2" value={parkingForm.description} onChange={(e) => setParkingForm({...parkingForm, description: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" className="w-full border border-gray-300 rounded-xl px-4 py-2" value={parkingForm.location.address} onChange={(e) => setParkingForm({...parkingForm, location: {...parkingForm.location, address: e.target.value}})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" className="w-full border border-gray-300 rounded-xl px-4 py-2" value={parkingForm.location.city} onChange={(e) => setParkingForm({...parkingForm, location: {...parkingForm.location, city: e.target.value}})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Slots *</label>
                  <input type="number" required className="w-full border border-gray-300 rounded-xl px-4 py-2" value={parkingForm.totalSlots} onChange={(e) => setParkingForm({...parkingForm, totalSlots: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Slots *</label>
                  <input type="number" required className="w-full border border-gray-300 rounded-xl px-4 py-2" value={parkingForm.availableSlots} onChange={(e) => setParkingForm({...parkingForm, availableSlots: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Hour *</label>
                  <input type="number" step="0.01" required className="w-full border border-gray-300 rounded-xl px-4 py-2" value={parkingForm.pricePerHour} onChange={(e) => setParkingForm({...parkingForm, pricePerHour: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <input type="text" className="w-full border border-gray-300 rounded-xl px-4 py-2" value={parkingForm.type} onChange={(e) => setParkingForm({...parkingForm, type: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowParkingModal(false)} className="px-4 py-2 border rounded-xl hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md">{editingItem ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= SLOT MODAL ================= */}
      {showSlotModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold">{editingItem ? 'Edit Slot' : 'Create New Slot'}</h3>
              <button onClick={() => setShowSlotModal(false)} className="p-1 rounded-full hover:bg-gray-100"><X size={20} /></button>
            </div>
            <form onSubmit={handleSlotSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parking Lot *</label>
                <select required className="w-full border border-gray-300 rounded-xl px-4 py-2" value={slotForm.parkingId} onChange={(e) => setSlotForm({...slotForm, parkingId: e.target.value})}>
                  <option value="">Select Parking</option>
                  {parkings.map(p => <option key={p._id} value={p._id}>{p.name} ({p.location?.city})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slot Number *</label>
                  <input type="text" required className="w-full border border-gray-300 rounded-xl px-4 py-2" value={slotForm.slotNumber} onChange={(e) => setSlotForm({...slotForm, slotNumber: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                  <input type="number" className="w-full border border-gray-300 rounded-xl px-4 py-2" value={slotForm.floor} onChange={(e) => setSlotForm({...slotForm, floor: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <input type="text" className="w-full border border-gray-300 rounded-xl px-4 py-2" value={slotForm.type} onChange={(e) => setSlotForm({...slotForm, type: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Hour *</label>
                  <input type="number" step="0.01" required className="w-full border border-gray-300 rounded-xl px-4 py-2" value={slotForm.pricePerHour} onChange={(e) => setSlotForm({...slotForm, pricePerHour: e.target.value})} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isBooked" checked={slotForm.isBooked} onChange={(e) => setSlotForm({...slotForm, isBooked: e.target.checked})} />
                <label htmlFor="isBooked" className="text-sm text-gray-700">Mark as Booked</label>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowSlotModal(false)} className="px-4 py-2 border rounded-xl hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">{editingItem ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;