import React, { useState, useEffect } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import {
  FiMenu, FiX, FiHome, FiCalendar, FiUsers, FiMapPin, FiPieChart, FiSettings,
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiDownload, FiChevronLeft, FiChevronRight,
  FiUser, FiDollarSign, FiAlertCircle, FiCheckCircle, FiClock,
  FiGrid, FiStar, FiMoreHorizontal, FiSave, FiLoader
} from 'react-icons/fi';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed bottom-4 right-4 z-50 space-y-2">
    {toasts.map(toast => (
      <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
        {toast.type === 'success' ? <FiCheckCircle /> : toast.type === 'error' ? <FiAlertCircle /> : <FiAlertCircle />}
        <span>{toast.message}</span>
        <button onClick={() => removeToast(toast.id)}><FiX /></button>
      </div>
    ))}
  </div>
);

const Admins = () => {
  const {
    loading,
    dashboardStats,
    bookingTrends,
    users,
    parks,
    slots,
    bookings,
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
    toasts,
    addToast,
    removeToast
  } = useAdmin();

  // Local UI states
  const [activeMenu, setActiveMenu] = useState('systems');
  const [parksSubView, setParksSubView] = useState('parking');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showParkModal, setShowParkModal] = useState(false);
  const [editingPark, setEditingPark] = useState(null);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [parkSearch, setParkSearch] = useState('');
  const [slotSearch, setSlotSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');

  useEffect(() => {
    fetchDashboard();
    fetchUsers(1, '');
    fetchParks(1, '');
    fetchSlots(1, '');
    fetchBookings(1, '');
  }, []);

  // Debounced searches
  useEffect(() => {
    const timer = setTimeout(() => fetchParks(1, parkSearch), 300);
    return () => clearTimeout(timer);
  }, [parkSearch, fetchParks]);

  useEffect(() => {
    const timer = setTimeout(() => fetchSlots(1, slotSearch), 300);
    return () => clearTimeout(timer);
  }, [slotSearch, fetchSlots]);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(1, userSearch), 300);
    return () => clearTimeout(timer);
  }, [userSearch, fetchUsers]);

  useEffect(() => {
    const timer = setTimeout(() => fetchBookings(1, bookingSearch), 300);
    return () => clearTimeout(timer);
  }, [bookingSearch, fetchBookings]);

  const totalRevenue = dashboardStats.totalRevenue || 0;
  const totalUsers = dashboardStats.totalUsers || 0;
  const totalBookings = dashboardStats.totalBookings || 0;
  const totalParks = dashboardStats.totalParks || 0;
  const totalSlots = dashboardStats.totalSlots || 0;

  const bookingStatusData = [
    { name: 'Active', value: bookings.data.filter(b => b.status === 'confirmed').length },
    { name: 'Completed', value: bookings.data.filter(b => b.status === 'completed').length },
    { name: 'Upcoming', value: bookings.data.filter(b => b.status === 'pending').length },
    { name: 'Cancelled', value: bookings.data.filter(b => b.status === 'cancelled').length },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const monthlyRevenueData = bookingTrends.map(item => ({ name: item._id, revenue: item.revenue, bookings: item.count }));
  const runningBookings = bookings.data.filter(b => b.status === 'confirmed' && new Date(b.startTime).toDateString() === new Date().toDateString());

  const menuItems = [
    { id: 'systems', label: 'Systems', icon: <FiHome /> },
    { id: 'bookings', label: 'Bookings', icon: <FiCalendar /> },
    { id: 'users', label: 'Users', icon: <FiUsers /> },
    { id: 'parks', label: 'Parks', icon: <FiMapPin />, hasDropdown: true },
    { id: 'analytics', label: 'Analytics', icon: <FiPieChart /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings /> },

  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'systems': return <SystemsDashboard />;
      case 'bookings': return <BookingsManagement />;
      case 'users': return <UsersManagement />;
      case 'parks': return parksSubView === 'parking' ? <ParksManagement /> : <SlotsManagement />;
      case 'analytics': return <AnalyticsDashboard />;
      case 'settings': return <SettingsPanel />;
      default: return <SystemsDashboard />;
    }
  };

  // Dashboard component (uses context data)
  const SystemsDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <DashboardCard title="Total Users" value={totalUsers} icon={<FiUsers />} color="bg-blue-500" />
        <DashboardCard title="Total Bookings" value={totalBookings} icon={<FiCalendar />} color="bg-green-500" />
        <DashboardCard title="Total Parks" value={totalParks} icon={<FiMapPin />} color="bg-purple-500" />
        <DashboardCard title="Total Slots" value={totalSlots} icon={<FiGrid />} color="bg-orange-500" />
        <DashboardCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={<FiDollarSign />} color="bg-pink-500" />
      </div>
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-xl font-bold mb-4"><FiClock className="inline mr-2" /> Running Bookings</h3>
        <div className="max-h-64 overflow-y-auto space-y-3">
          {runningBookings.length ? runningBookings.map(b => (
            <div key={b.id} className="border rounded-lg p-3 flex justify-between">
              <div><p className="font-semibold">{b.parkingId?.name} - {b.slotId?.slotNumber}</p><p className="text-sm">User: {b.userId?.name}</p></div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
            </div>
          )) : <p>No active bookings.</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl shadow"><h3 className="font-bold mb-3">Weekly Bookings</h3><ResponsiveContainer width="100%" height={200}><AreaChart data={monthlyRevenueData}><CartesianGrid /><XAxis dataKey="name" /><YAxis /><Tooltip /><Area type="monotone" dataKey="bookings" stroke="#8884d8" fill="#8884d8" /></AreaChart></ResponsiveContainer></div>
        <div className="bg-white p-5 rounded-xl shadow"><h3 className="font-bold mb-3">Booking Status</h3><ResponsiveContainer width="100%" height={200}><PieChart><Pie data={bookingStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>{bookingStatusData.map((e,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
      </div>
      <div className="bg-white p-5 rounded-xl shadow"><h3 className="text-xl font-bold">Monthly Revenue</h3><ResponsiveContainer width="100%" height={250}><LineChart data={monthlyRevenueData}><CartesianGrid /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="revenue" stroke="#ff7300" /></LineChart></ResponsiveContainer></div>
    </div>
  );

  const BookingsManagement = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="text-xl font-bold mb-3">All Bookings</h3>
        <div className="flex justify-between mb-3"><div className="relative"><FiSearch className="absolute left-3 top-3" /><input type="text" placeholder="Search" className="pl-10 border rounded-lg p-2" value={bookingSearch} onChange={e=>setBookingSearch(e.target.value)} /></div></div>
        <div className="overflow-x-auto">
          <table className="w-full"><thead><tr><th>User</th><th>Park/Slot</th><th>Amount</th><th>Booking Status</th><th>Payment Status</th></tr></thead><tbody>
            {bookings.data.map(b=>(
              <tr key={b.id} className="border-b">
                <td>{b.userId?.name}</td>
                <td>{b.parkingId?.name} - {b.slotId?.slotNumber}</td>
                <td>${b.totalPrice}</td>
                <td><select value={b.status} onChange={e=>updateBooking(b.id, e.target.value, null)} className="border rounded p-1"><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></td>
                <td><select value={b.paymentStatus} onChange={e=>updateBooking(b.id, null, e.target.value)} className="border rounded p-1"><option value="pending">Pending</option><option value="paid">Paid</option><option value="failed">Failed</option></select></td>
              </tr>
            ))}
          </tbody></table>
        </div>
        <Pagination page={bookings.page} totalPages={bookings.totalPages} onPageChange={(p)=>fetchBookings(p, bookingSearch)} />
      </div>
    </div>
  );

  const UsersManagement = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex justify-between"><h3 className="text-xl font-bold">Users</h3><div className="relative"><FiSearch className="absolute left-3 top-3" /><input type="text" placeholder="Search" className="pl-10 border rounded-lg p-2" value={userSearch} onChange={e=>setUserSearch(e.target.value)} /></div></div>
        <div className="overflow-x-auto"><table className="w-full"><thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead><tbody>
          {users.data.map(u=>(
            <tr key={u.id} className="border-b"><td className="cursor-pointer text-blue-600" onClick={()=>{setSelectedUser(u); setShowUserDetailModal(true);}}>{u.name}</td><td>{u.email}</td><td>{u.isBlocked ? 'Blocked' : 'Active'}</td><td><button onClick={()=>toggleBlockUser(u.id)} className={`px-3 py-1 rounded text-white ${u.isBlocked ? 'bg-green-500' : 'bg-red-500'}`}>{u.isBlocked ? 'Unblock' : 'Block'}</button></td></tr>
          ))}
        </tbody></table></div>
        <Pagination page={users.page} totalPages={users.totalPages} onPageChange={(p)=>fetchUsers(p, userSearch)} />
      </div>
      {showUserDetailModal && selectedUser && <UserDetailModal user={selectedUser} bookings={bookings.data} onClose={()=>setShowUserDetailModal(false)} />}
    </div>
  );

  const ParksManagement = () => (
    <div className="bg-white rounded-xl shadow p-5 space-y-4">
      <div className="flex justify-between"><h3 className="text-2xl font-bold">Parking Lots</h3><button onClick={()=>{setEditingPark(null); setShowParkModal(true);}} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"><FiPlus /> Add Park</button></div>
      <div className="relative"><FiSearch className="absolute left-3 top-3" /><input placeholder="Search" className="pl-10 border rounded-lg p-2 w-full" value={parkSearch} onChange={e=>setParkSearch(e.target.value)} /></div>
      <table className="w-full"><thead><tr><th>Name</th><th>Location</th><th>Total Slots</th><th>Available</th><th>Price/hr</th><th>Actions</th></tr></thead><tbody>
        {parks.data.map(p=>(
          <tr key={p.id} className="border-b"><td>{p.name}</td><td>{p.location?.address || p.location}</td><td>{p.totalSlots}</td><td>{p.availableSlots}</td><td>${p.pricePerHour}</td><td><button onClick={()=>{setEditingPark(p); setShowParkModal(true);}} className="text-blue-500 mr-2"><FiEdit2 /></button><button onClick={()=>deletePark(p.id)} className="text-red-500"><FiTrash2 /></button></td></tr>
        ))}
      </tbody></table>
      <Pagination page={parks.page} totalPages={parks.totalPages} onPageChange={(p)=>fetchParks(p, parkSearch)} />
      <ParkModal isOpen={showParkModal} onClose={()=>setShowParkModal(false)} onSave={(data)=>editingPark ? updatePark(editingPark.id, data) : createPark(data)} editingPark={editingPark} />
    </div>
  );

  const SlotsManagement = () => (
    <div className="bg-white rounded-xl shadow p-5 space-y-4">
      <div className="flex justify-between"><h3 className="text-2xl font-bold">Slots</h3><button onClick={()=>{setEditingSlot(null); setShowSlotModal(true);}} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"><FiPlus /> Add Slot</button></div>
      <div className="relative"><FiSearch className="absolute left-3 top-3" /><input placeholder="Search" className="pl-10 border rounded-lg p-2 w-full" value={slotSearch} onChange={e=>setSlotSearch(e.target.value)} /></div>
      <table className="w-full"><thead><tr><th>Park</th><th>Slot Number</th><th>Type</th><th>Booked</th><th>Price/hr</th><th>Actions</th></tr></thead><tbody>
        {slots.data.map(s=>(
          <tr key={s.id} className="border-b"><td>{s.parkingId?.name}</td><td>{s.slotNumber}</td><td>{s.type}</td><td>{s.isBooked ? 'Yes' : 'No'}</td><td>${s.pricePerHour}</td><td><button onClick={()=>{setEditingSlot(s); setShowSlotModal(true);}} className="text-blue-500 mr-2"><FiEdit2 /></button><button onClick={()=>deleteSlot(s.id)} className="text-red-500"><FiTrash2 /></button></td></tr>
        ))}
      </tbody></table>
      <Pagination page={slots.page} totalPages={slots.totalPages} onPageChange={(p)=>fetchSlots(p, slotSearch)} />
      <SlotModal isOpen={showSlotModal} onClose={()=>setShowSlotModal(false)} onSave={(data)=>editingSlot ? updateSlot(editingSlot.id, data) : createSlot(data)} editingSlot={editingSlot} parks={parks.data} />
    </div>
  );

  const AnalyticsDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Users" value={totalUsers} /><StatCard label="Bookings" value={totalBookings} /><StatCard label="Parks" value={totalParks} /><StatCard label="Slots" value={totalSlots} /><StatCard label="Revenue" value={`$${totalRevenue}`} />
      </div>
      <div className="bg-white p-5 rounded-xl shadow"><h3 className="text-xl font-bold mb-4">Revenue & Bookings Trend</h3><ResponsiveContainer width="100%" height={300}><LineChart data={monthlyRevenueData}><XAxis dataKey="name" /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Line yAxisId="left" dataKey="revenue" stroke="#8884d8" name="Revenue" /><Line yAxisId="right" dataKey="bookings" stroke="#82ca9d" name="Bookings" /></LineChart></ResponsiveContainer></div>
    </div>
  );

  const SettingsPanel = () => <div className="bg-white p-6 rounded-xl shadow"><h3 className="text-xl font-bold">Settings</h3><p>Profile, notifications, system settings (demo).</p></div>;

  // Helper components
  const DashboardCard = ({ title, value, icon, color }) => (
    <div className={`${color} bg-opacity-10 rounded-xl p-5 flex justify-between items-center`}>
      <div><p className="text-gray-600">{title}</p><p className="text-2xl font-bold">{value}</p></div>
      <div className={`${color} p-3 rounded-full text-white`}>{icon}</div>
    </div>
  );
  const StatCard = ({ label, value }) => (<div className="bg-white p-5 rounded-xl shadow text-center"><p className="text-gray-500">{label}</p><p className="text-2xl font-bold">{value}</p></div>);
  const Pagination = ({ page, totalPages, onPageChange }) => totalPages > 1 && (<div className="flex justify-center gap-2 mt-4">{Array.from({length: totalPages}, (_,i)=>i+1).map(p=><button key={p} onClick={()=>onPageChange(p)} className={`px-3 py-1 rounded ${p===page ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>{p}</button>)}</div>);

  const ParkModal = ({ isOpen, onClose, onSave, editingPark }) => {
    const [form, setForm] = useState({ name: '', location: '', totalSlots: 0, availableSlots: 0, pricePerHour: 0 });
    useEffect(()=>{ if(editingPark) setForm(editingPark); else setForm({ name: '', location: '', totalSlots: 0, availableSlots: 0, pricePerHour: 0 }); },[editingPark, isOpen]);
    if(!isOpen) return null;
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-xl p-6 w-96"><h3 className="text-xl font-bold mb-4">{editingPark ? 'Edit Park' : 'Add Park'}</h3><div className="space-y-3"><input placeholder="Name" className="w-full border p-2 rounded" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /><input placeholder="Location" className="w-full border p-2 rounded" value={form.location} onChange={e=>setForm({...form,location:e.target.value})} /><input type="number" placeholder="Total Slots" className="w-full border p-2 rounded" value={form.totalSlots} onChange={e=>setForm({...form,totalSlots:+e.target.value})} /><input type="number" placeholder="Available Slots" className="w-full border p-2 rounded" value={form.availableSlots} onChange={e=>setForm({...form,availableSlots:+e.target.value})} /><input type="number" placeholder="Price/Hour" className="w-full border p-2 rounded" value={form.pricePerHour} onChange={e=>setForm({...form,pricePerHour:+e.target.value})} /></div><div className="flex justify-end gap-3 mt-6"><button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button><button onClick={()=>{onSave(form); onClose();}} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button></div></div></div>);
  };

  const SlotModal = ({ isOpen, onClose, onSave, editingSlot, parks }) => {
    const [form, setForm] = useState({ parkingId: '', slotNumber: '', type: 'Car', isBooked: false, pricePerHour: 0 });
    useEffect(()=>{ if(editingSlot) setForm(editingSlot); else if(parks.length) setForm({ ...form, parkingId: parks[0].id }); },[editingSlot, isOpen, parks]);
    if(!isOpen) return null;
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-xl p-6 w-96"><h3 className="text-xl font-bold mb-4">{editingSlot ? 'Edit Slot' : 'Add Slot'}</h3><select className="w-full border p-2 rounded my-2" value={form.parkingId} onChange={e=>setForm({...form,parkingId:e.target.value})}>{parks.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select><input placeholder="Slot Number" className="w-full border p-2 rounded my-2" value={form.slotNumber} onChange={e=>setForm({...form,slotNumber:e.target.value})} /><select className="w-full border p-2 rounded" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Car</option><option>Bike</option><option>EV</option></select><input type="number" placeholder="Price/Hour" className="w-full border p-2 rounded my-2" value={form.pricePerHour} onChange={e=>setForm({...form,pricePerHour:+e.target.value})} /><div className="flex justify-end gap-3 mt-6"><button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button><button onClick={()=>{onSave(form); onClose();}} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button></div></div></div>);
  };

  const UserDetailModal = ({ user, bookings, onClose }) => {
    const userBookings = bookings.filter(b=>b.userId?._id === user.id);
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-xl w-full max-w-2xl p-6"><div className="flex justify-between"><h2 className="text-2xl font-bold">{user.name}</h2><button onClick={onClose}><FiX /></button></div><div className="mt-4"><h3 className="font-bold">Bookings</h3>{userBookings.map(b=><div key={b.id} className="border p-2 my-2 rounded"><p>{b.parkingId?.name} - {b.slotId?.slotNumber} | ${b.totalPrice} | {b.status}</p></div>)}</div></div></div>);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col z-20`}>
        <div className="p-4 flex justify-between items-center border-b"><h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>ParkFlow Admin</h1><button onClick={()=>setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? <FiChevronLeft /> : <FiMenu />}</button></div>
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map(item=>(
            <div key={item.id}>
              <button onClick={()=>{ if(item.id==='parks') setActiveMenu('parks'); else setActiveMenu(item.id); if(item.id!=='parks') setParksSubView('parking'); }} className={`flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 ${activeMenu===item.id ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''}`}><span className="text-xl">{item.icon}</span><span className={`${!sidebarOpen && 'hidden'}`}>{item.label}</span></button>
              {item.id==='parks' && activeMenu==='parks' && sidebarOpen && (<div className="ml-8 mt-1 space-y-1"><button onClick={()=>setParksSubView('parking')} className={`block w-full text-left px-2 py-1 text-sm ${parksSubView==='parking' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>Parking Lots</button><button onClick={()=>setParksSubView('slots')} className={`block w-full text-left px-2 py-1 text-sm ${parksSubView==='slots' ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>Slots</button></div>)}
            </div>
          ))}
        </nav>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {loading ? <div className="flex justify-center h-64 items-center"><FiLoader className="animate-spin text-4xl text-blue-600" /></div> : renderContent()}
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Admins;