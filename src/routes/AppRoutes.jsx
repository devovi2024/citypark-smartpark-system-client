import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

/* PUBLIC */
import Home from "../pages/Shared/Home/Home";
import Parkings from "../pages/parkings/Parkings";
import ParkingDetails from "../pages/parkings/ParkingDetails";
import About from "../pages/Shared/About";

/* BLOG */
import AllBlogs from "../pages/Shared/Home/blog/AllBlogs";
import BlogDetails from "../pages/Shared/Home/blog/BlogDetails";

/* AUTH */
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

/* USER */
import MyBookings from "../pages/MyBookings";
import Profile from "../components/profile/Profile";
import EditProfile from "../components/profile/EditProfile";

/* PAYMENT */
import Success from "../pages/payment/Success";
import Cancel from "../pages/payment/Cancel";

/* ADMIN */
import Admins from "../pages/Admins";

/* LAYOUTS */
import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";

/* ROUTE GUARDS */
import ProtectedRoute from "../routes/ProtectedRoute";
import AdminRoute from "../routes/AdminRoute";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/parkings", element: <Parkings /> },
      { path: "/parkings/:id", element: <ParkingDetails /> },
      { path: "/all-blogs", element: <AllBlogs /> },
      { path: "/blog/:id", element: <BlogDetails /> },

      /* USER */
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/my-bookings", element: <MyBookings /> },
          { path: "/profile", element: <Profile /> },
          { path: "/profile/edit", element: <EditProfile /> },
          { path: "/payment-success", element: <Success /> },
          { path: "/payment-cancel", element: <Cancel /> },
        ],
      },

      /* ADMIN */
      {
        element: <AdminRoute />,
        children: [
          { path: "/admin", element: <Admins /> },
          { path: "/admin/analytics", element: <Admins /> },
          { path: "/admin/users", element: <Admins /> },
          { path: "/admin/reports", element: <Admins /> },
          { path: "/admin/settings", element: <Admins /> },
        ],
      },
    ],
  },

  /* AUTH */
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}