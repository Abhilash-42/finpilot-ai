import { createContext, useContext, useEffect, useState } from "react";
import {
  login as loginService,
  register as registerService,
  getCurrentUser,
} from "@/services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      localStorage.removeItem("access_token");
      setUser(null);
    }

    setLoading(false);
  };

  const login = async (credentials) => {
    const response = await loginService(credentials);

    localStorage.setItem("access_token", response.access_token);

    const currentUser = await getCurrentUser();

    setUser(currentUser);

    return currentUser;
  };

  const register = async (userData) => {
    return await registerService(userData);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);