import { usePayment } from "../../context/PaymentContext";

const PaymentButton = ({ bookingId }) => {
  const { startPayment, loading } = usePayment();

  return (
    <button
      onClick={() => startPayment(bookingId)}
      disabled={loading}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      {loading ? "Processing..." : "Pay Now"}
    </button>
  );
};

export default PaymentButton;