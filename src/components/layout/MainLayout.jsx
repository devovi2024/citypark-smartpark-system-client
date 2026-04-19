import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../../pages/Shared/Home/Footer";

export default function MainLayout() {
  return (
    <div className="flex">
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="p-4 bg-gray-100 flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <Footer/>
      </div>
    </div>
  );
}