import { useAuth } from "../../context/AuthContext";

import Sidebardar from "../../components/layout/Sidebar";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      {/* sidebar  */}

      <Sidebardar />
      
    </div>
  );
}