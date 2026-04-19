import api from "./api";

export const getUser = () => api.get("/users/me");
export const updateUser = (data) => api.put("/users/update", data);
export const deleteUser = () => api.delete("/users/delete");