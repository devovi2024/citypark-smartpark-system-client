import { useEffect } from "react";
import { useAdminHook } from "../../hooks/useAdmin";

export default function AdminDashboard() {
  const { bookings = [], loading, fetchBookings } = useAdminHook();

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const totalBookings = bookings.length;

  const pending = bookings.filter(b => b.status === "pending").length;

  const confirmed = bookings.filter(b => b.status === "confirmed").length;

  const revenue = bookings
    .filter(b => b.paymentStatus === "paid")
    .reduce((acc, b) => acc + Number(b.totalPrice || 0), 0);

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500">Total Bookings</h2>
          <p className="text-2xl font-bold">{totalBookings}</p>
        </div>

        <div className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="text-gray-600">Pending</h2>
          <p className="text-2xl font-bold">{pending}</p>
        </div>

        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-gray-600">Confirmed</h2>
          <p className="text-2xl font-bold">{confirmed}</p>
        </div>

        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-gray-600">Revenue</h2>
          <p className="text-2xl font-bold">${revenue}</p>
        </div>

      </div>

      {/* RECENT BOOKINGS */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Recent Bookings</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th>User</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Price</th>
            </tr>
          </thead>

          <tbody>
            {bookings.slice(0, 5).map((b) => (
              <tr key={b._id} className="border-b">
                <td>{b.userId?.name || "N/A"}</td>
                <td>{b.status}</td>
                <td>{b.paymentStatus}</td>
                <td>${b.totalPrice}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}