import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { ParkingProvider } from "./context/ParkingContext";
import { SlotProvider } from "./context/SlotContext";
import { BookingProvider } from "./context/BookingContext";
import { PaymentProvider } from "./context/PaymentContext";
import { AdminProvider } from "./context/AdminContext"; // Fixed import

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ParkingProvider>
        <SlotProvider>
          <BookingProvider>
            <PaymentProvider>
              <AdminProvider>
                <App />
              </AdminProvider>
            </PaymentProvider>
          </BookingProvider>
        </SlotProvider>
      </ParkingProvider>
    </AuthProvider>
  </React.StrictMode>
);