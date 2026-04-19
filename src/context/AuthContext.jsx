import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token && storedUser !== "undefined") {
        const parsedUser = JSON.parse(storedUser);

        if (parsedUser?.role === "admin" || parsedUser?.role === "user") {
          setUser(parsedUser);
        } else {
          localStorage.clear();
        }
      }
    } catch (err) {
      console.error("Auth parse error:", err);
      localStorage.clear();
    }

    setLoading(false);
  }, []);

  const login = (data) => {
    const safeUser = {
      ...data.user,
      role: data.user.role === "admin" ? "admin" : "user",
    };

    setUser(safeUser);
    localStorage.setItem("user", JSON.stringify(safeUser));
    localStorage.setItem("token", data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  // ✅ MAIN FIX
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAdmin,
        isUser,
        isAuthenticated, // ✅ add this
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);