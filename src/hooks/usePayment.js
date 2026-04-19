import { usePayment as usePaymentContext } from "../context/PaymentContext";

export const usePayment = () => {
  return usePaymentContext();
};