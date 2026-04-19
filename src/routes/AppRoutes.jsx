import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

/* PUBLIC */
import Home from "../pages/Shared/Home/Home";
import Parkings from "../pages/parkings/Parkings";
import ParkingDetails from "../pages/parkings/ParkingDetails";
import About from "../pages/Shared/About.jsx";

/* BLOG */
import AllBlogs from "../pages/Shared/Home/blog/AllBlogs.jsx";
import BlogDetails from "../pages/Shared/Home/blog/BlogDetails.jsx";

/* AUTH */
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

/* USER */
// import Dashboard from "../pages/dashboard/Dashboard";
import MyBookings from "../pages/MyBookings";
import Profile from "../components/profile/Profile";
import EditProfile from "../components/profile/EditProfile";

/* PAYMENT */
import Success from "../pages/payment/Success";
import Cancel from "../pages/payment/Cancel";

/* ADMIN */
import Admins from "../pages/Admins"; // Note: Removed .jsx extension

/* LAYOUTS */
import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";

/* ROUTE GUARDS */
import ProtectedRoute from "../routes/ProtectedRoute";
import AdminRoute from "../routes/AdminRoute";

const router = createBrowserRouter([
  /* ================= PUBLIC ROUTES ================= */
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/parkings", element: <Parkings /> },
      { path: "/parkings/:id", element: <ParkingDetails /> },
      { path: "/all-blogs", element: <AllBlogs /> },
      { path: "/blog/:id", element: <BlogDetails /> },
    ],
  },

  /* ================= AUTH ROUTES ================= */
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  /* ================= USER PROTECTED ================= */
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          // { path: "/dashboard", element: <Dashboard /> },
          { path: "/my-bookings", element: <MyBookings /> },
          { path: "/profile", element: <Profile /> },
          { path: "/profile/edit", element: <EditProfile /> },
          { path: "/payment-success", element: <Success /> },
          { path: "/payment-cancel", element: <Cancel /> },
        ],
      },
    ],
  },

  /* ================= ADMIN ROUTES ================= */
  {
    element: <AdminRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/admin", element: <Admins /> },
          { path: "/admin/*", element: <Admins /> }, // Optional: catch all admin subroutes
        ],
      },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}