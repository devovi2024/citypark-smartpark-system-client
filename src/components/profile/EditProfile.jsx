import { useState } from "react";
import { updateUser } from "../../services/userService";

export default function EditProfile() {
  const [name, setName] = useState("");

  const handleUpdate = async () => {
    await updateUser({ name });
    alert("Updated");
  };

  return (
    <div>
      <input placeholder="New name" onChange={(e) => setName(e.target.value)} />
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}