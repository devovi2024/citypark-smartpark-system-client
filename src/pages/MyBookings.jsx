import React, { useState, useMemo, useEffect } from 'react';
import { useBookingHook } from '../hooks/useBooking';
import { usePayment } from '../context/PaymentContext';
import { Link } from "react-router-dom";
import { 
  CalendarIcon, 
  MapPinIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  XMarkIcon,
  ArrowPathIcon,
  CreditCardIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ReceiptPercentIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  DocumentArrowDownIcon,
  DocumentPlusIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const MyBooking = () => {
  const { bookings, loading, cancelBooking, refreshBookings } = useBookingHook();
  const { startPayment, loading: paymentLoading } = usePayment();
  const [cancellingId, setCancellingId] = useState(null);
  const [processingPaymentId, setProcessingPaymentId] = useState(null);
  
  // Report requests state
  const [reportRequests, setReportRequests] = useState([]);
  const [requestingReport, setRequestingReport] = useState(false);

  // Load report requests from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('reportRequests');
    if (stored) {
      setReportRequests(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever reportRequests changes
  useEffect(() => {
    localStorage.setItem('reportRequests', JSON.stringify(reportRequests));
  }, [reportRequests]);

  // Helper: get current user ID (mock - replace with actual auth)
  const getCurrentUserId = () => {
    // In a real app, get from auth context
    return 'current_user_id';
  };

  const stats = useMemo(() => {
    if (!bookings.length) return null;
    const totalBookings = bookings.length;
    const totalSpent = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const averageSpent = totalSpent / totalBookings;
    const pendingPayments = bookings.filter(b => b.status?.toLowerCase() === 'pending').length;
    const completedBookings = bookings.filter(b => b.status?.toLowerCase() === 'completed').length;
    const locationCount = {};
    bookings.forEach(b => {
      const name = b.parkingSlot?.name || 'Standard Slot';
      locationCount[name] = (locationCount[name] || 0) + 1;
    });
    const mostFrequentLocation = Object.entries(locationCount).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A';
    return { totalBookings, totalSpent, averageSpent, pendingPayments, completedBookings, mostFrequentLocation };
  }, [bookings]);

  // Report request handler
  const requestReport = () => {
    setRequestingReport(true);
    const newRequest = {
      id: Date.now().toString(),
      userId: getCurrentUserId(),
      userName: "Current User", // Replace with actual user name
      status: 'pending',
      requestedAt: new Date().toISOString(),
      reportUrl: null,
    };
    setReportRequests(prev => [...prev, newRequest]);
    setTimeout(() => setRequestingReport(false), 500);
    alert("Report request submitted to admin. You will be notified when it's ready.");
  };

  // Get approved report for current user
  const approvedReport = reportRequests.find(r => r.userId === getCurrentUserId() && r.status === 'approved' && r.reportUrl);

  const downloadReport = () => {
    if (approvedReport?.reportUrl) {
      window.open(approvedReport.reportUrl, '_blank');
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setCancellingId(id);
      await cancelBooking(id);
      setCancellingId(null);
    }
  };

  const handlePay = async (booking) => {
    setProcessingPaymentId(booking._id);
    await startPayment(booking._id);
    setProcessingPaymentId(null);
  };

  const getStatusConfig = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed': return { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: CheckBadgeIcon, label: 'Confirmed' };
      case 'pending': return { bg: 'bg-amber-100', text: 'text-amber-800', icon: ExclamationTriangleIcon, label: 'Pending Payment' };
      case 'cancelled': return { bg: 'bg-rose-100', text: 'text-rose-800', icon: XMarkIcon, label: 'Cancelled' };
      case 'completed': return { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: CheckBadgeIcon, label: 'Completed' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', icon: ClockIcon, label: status || 'Unknown' };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try { return format(new Date(dateString), 'EEE, MMM d, yyyy'); } catch { return 'Invalid date'; }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    try { return format(new Date(dateString), 'h:mm a'); } catch { return 'Invalid time'; }
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
          <p className="mt-5 text-slate-600 font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="relative mb-10 overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/50 p-6">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-indigo-100/30 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-32 w-32 rounded-full bg-emerald-100/30 blur-2xl"></div>
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                My Parking Bookings
              </h1>
              <p className="text-slate-500 mt-1 text-sm">Manage and track your parking reservations</p>
            </div>
            <button
              onClick={refreshBookings}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Statistics Dashboard + Report Request */}
        {stats && (
          <div className="mb-12">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
              <div className="flex items-center gap-2">
                <ChartBarIcon className="h-6 w-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-slate-800">Booking Statistics</h2>
              </div>
              <div className="flex gap-3">
                {/* Request Report Button */}
                <button
                  onClick={requestReport}
                  disabled={requestingReport}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition disabled:opacity-50"
                >
                  <DocumentPlusIcon className="h-5 w-5" />
                  <span>{requestingReport ? 'Requesting...' : 'Request Report'}</span>
                </button>
                {/* Download Approved Report Button */}
                {approvedReport && (
                  <button
                    onClick={downloadReport}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition"
                  >
                    <DocumentArrowDownIcon className="h-5 w-5" />
                    <span>Download Report</span>
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-white/50">
                <div className="flex items-center justify-between">
                  <div><p className="text-slate-500 text-sm">Total Bookings</p><p className="text-3xl font-bold text-slate-800">{stats.totalBookings}</p></div>
                  <div className="bg-indigo-100 p-3 rounded-full"><CalendarDaysIcon className="h-6 w-6 text-indigo-600" /></div>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-white/50">
                <div className="flex items-center justify-between">
                  <div><p className="text-slate-500 text-sm">Total Spent</p><p className="text-3xl font-bold text-emerald-600">${stats.totalSpent.toFixed(2)}</p></div>
                  <div className="bg-emerald-100 p-3 rounded-full"><BanknotesIcon className="h-6 w-6 text-emerald-600" /></div>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-white/50">
                <div className="flex items-center justify-between">
                  <div><p className="text-slate-500 text-sm">Average / Booking</p><p className="text-3xl font-bold text-amber-600">${stats.averageSpent.toFixed(2)}</p></div>
                  <div className="bg-amber-100 p-3 rounded-full"><ReceiptPercentIcon className="h-6 w-6 text-amber-600" /></div>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-white/50">
                <div className="flex items-center justify-between">
                  <div><p className="text-slate-500 text-sm">Pending Payments</p><p className="text-3xl font-bold text-rose-600">{stats.pendingPayments}</p></div>
                  <div className="bg-rose-100 p-3 rounded-full"><ExclamationTriangleIcon className="h-6 w-6 text-rose-600" /></div>
                </div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-white/50">
                <div className="flex items-center justify-between">
                  <div><p className="text-slate-500 text-sm">Completed</p><p className="text-3xl font-bold text-teal-600">{stats.completedBookings}</p></div>
                  <div className="bg-teal-100 p-3 rounded-full"><CheckBadgeIcon className="h-6 w-6 text-teal-600" /></div>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-between items-center bg-white/50 backdrop-blur-sm rounded-xl p-3 px-5 border border-white/50">
              <div className="flex items-center gap-2"><MapPinIcon className="h-5 w-5 text-indigo-500" /><span className="text-slate-600 text-sm">Most booked location:</span></div>
              <span className="font-semibold text-slate-800">{stats.mostFrequentLocation}</span>
            </div>
          </div>
        )}

        {/* Bookings Grid */}
        {!loading && bookings.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-indigo-50 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                <MapPinIcon className="h-12 w-12 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">No bookings yet</h3>
              <p className="text-slate-500 mb-8">You haven't booked any parking slots. Start exploring available parking spots near you!</p>
             

              <div>
                <Link to="/parkings">
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
                    Find Parking
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {bookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              const StatusIcon = statusConfig.icon;
              const isProcessingPayment = processingPaymentId === booking._id;
              const isCancelling = cancellingId === booking._id;
              const canPay = booking.status?.toLowerCase() === 'pending';
              const canCancel = booking.status?.toLowerCase() === 'pending' || booking.status?.toLowerCase() === 'confirmed';
              return (
                <div key={booking._id} className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-slate-100 hover:border-indigo-200">
                  <div className="relative h-36 bg-gradient-to-r from-slate-700 to-slate-800 p-5">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${statusConfig.bg} ${statusConfig.text} shadow-sm`}>
                        <StatusIcon className="h-3.5 w-3.5" /> {statusConfig.label}
                      </span>
                    </div>
                    <div className="absolute bottom-5 left-5 flex items-center gap-3 z-10">
                      <div className="bg-white/20 backdrop-blur-md rounded-xl p-2 shadow-lg"><MapPinIcon className="h-6 w-6 text-white" /></div>
                      <div><p className="text-white/70 text-xs font-medium">Parking Location</p><p className="text-white font-bold text-md">{booking.parkingSlot?.name || 'Standard Slot'}</p></div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="bg-slate-100 p-1.5 rounded-lg"><CalendarIcon className="h-5 w-5 text-indigo-600" /></div>
                        <div><p className="text-xs text-slate-400 uppercase tracking-wide">Date</p><p className="text-sm font-semibold text-slate-800">{formatDate(booking.date)}</p></div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-slate-100 p-1.5 rounded-lg"><ClockIcon className="h-5 w-5 text-indigo-600" /></div>
                        <div><p className="text-xs text-slate-400 uppercase tracking-wide">Time</p><p className="text-sm font-semibold text-slate-800">{formatTime(booking.startTime)} – {formatTime(booking.endTime)}</p></div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="bg-slate-100 p-1.5 rounded-lg"><CurrencyDollarIcon className="h-5 w-5 text-indigo-600" /></div>
                        <div><p className="text-xs text-slate-400 uppercase tracking-wide">Total Price</p><p className="text-xl font-bold text-slate-800">${booking.totalPrice?.toFixed(2) || '0.00'}</p></div>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                      {canPay && <button onClick={() => handlePay(booking)} disabled={paymentLoading || isProcessingPayment} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-600 transition disabled:opacity-50">{isProcessingPayment ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : <CreditCardIcon className="h-4 w-4" />}<span>{isProcessingPayment ? 'Processing...' : 'Pay Now'}</span></button>}
                      {canCancel && <button onClick={() => handleCancel(booking._id)} disabled={isCancelling} className={`${canPay ? 'flex-1' : 'w-full'} inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-700 rounded-xl hover:bg-rose-100 transition disabled:opacity-50`}>{isCancelling ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-rose-600 border-t-transparent"></div> : <XMarkIcon className="h-4 w-4" />}<span>{isCancelling ? 'Cancelling...' : 'Cancel'}</span></button>}
                    </div>
                    <div className="mt-4 pt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"><p className="text-xs text-slate-400 font-mono">Booking ID: {booking._id}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBooking;