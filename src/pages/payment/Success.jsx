import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../services/api";

export default function Success() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/payments/verify/${sessionId}`);
        setPayment(res.data);
      } catch (err) {
        console.log("Verify error:", err.response?.data || err.message);
      }
    };

    if (sessionId) verify();
  }, [sessionId]);

  return (
    <div>
      <h1>Payment Success 🎉</h1>

      {payment ? (
        <>
          <p>Status: {payment.status}</p>
          <p>Amount: {payment.amount}</p>
        </>
      ) : (
        <p>Verifying...</p>
      )}
    </div>
  );
}