import { useEffect } from "react";
import { useAdminHook } from "../../hooks/useAdmin";

const AdminBookings = () => {
  const {
    bookings,
    loading,
    fetchBookings,
    updateStatus,
    updatePayment,
  } = useAdminHook();

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Bookings</h2>

      {bookings.map((b) => (
        <div key={b._id} className="p-4 border mb-3 rounded">
          <p>User: {b.userId?.name}</p>
          <p>Status: {b.status}</p>
          <p>Payment: {b.paymentStatus}</p>

          {/* STATUS CONTROL */}
          <select
            value={b.status}
            onChange={(e) => updateStatus(b._id, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          {/* PAYMENT CONTROL */}
          <select
            value={b.paymentStatus}
            onChange={(e) => updatePayment(b._id, e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default AdminBookings;