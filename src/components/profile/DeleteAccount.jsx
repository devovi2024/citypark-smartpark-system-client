import { deleteUser } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

export default function DeleteAccount() {
  const { logout } = useAuth();

  const handleDelete = async () => {
    await deleteUser();
    logout();
  };

  return (
    <div>
      <button onClick={handleDelete}>Delete Account</button>
    </div>
  );
}