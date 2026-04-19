import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow h-full p-4">
      <h2 className="text-xl font-bold mb-6">Menu</h2>

      <nav className="flex flex-col gap-3">

        <NavLink to="/profile" className="hover:text-blue-500">Profile</NavLink>
        <NavLink to="/profile/edit" className="hover:text-blue-500">Edit Profile</NavLink>
        <NavLink to="/profile/delete" className="hover:text-red-500">Delete Account</NavLink>
      </nav>
    </div>
  );
}