import { Link, Outlet } from "react-router-dom";

export default function AdminExploreLayout() {
  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white p-4 space-y-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>

        <Link to="/admin/explore/management" className="block hover:text-green-400">
          Booking Management
        </Link>

        <Link to="/admin/explore/payments" className="block hover:text-green-400">
          Payment Control
        </Link>

        <Link to="/admin/explore/settings" className="block hover:text-green-400">
          Settings
        </Link>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </div>

    </div>
  );
}