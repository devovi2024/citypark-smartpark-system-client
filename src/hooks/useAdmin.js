// src/hooks/useAdmin.js
import { useAdminContext } from '../context/AdminContext';

export const useAdmin = () => {
  const context = useAdminContext();
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};