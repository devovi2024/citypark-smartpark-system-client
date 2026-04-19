import { createContext, useContext, useState } from "react";
import api from "../services/api";

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const startPayment = async (bookingId) => {
    try {
      setLoading(true);

      console.log("BookingId sent to payment:", bookingId);

      if (!bookingId) {
        alert("Booking ID missing");
        return;
      }

      const res = await api.post("/payments/create-session", {
        bookingId,
      });

      if (!res.data?.url) {
        alert("Payment URL not found");
        return;
      }

      // ✅ Stripe redirect
      window.location.href = res.data.url;
    } catch (err) {
      console.log("Payment Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentContext.Provider value={{ startPayment, loading }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);

  if (!context) {
    throw new Error("usePayment must be used inside PaymentProvider");
  }

  return context;
};