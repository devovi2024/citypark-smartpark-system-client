import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../../pages/Shared/Home/Footer";

export default function MainLayout() {
  const location = useLocation();

  const hideFooter = location.pathname.startsWith("/admin");

  return (
    <div className="flex">
      <div className="flex flex-col flex-1">
        <Navbar />

        <main className="p-4 bg-gray-100 flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {!hideFooter && <Footer />}
      </div>
    </div>
  );
}