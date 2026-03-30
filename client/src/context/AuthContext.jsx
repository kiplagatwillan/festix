// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { loginUser, registerUser, getProfile } from "../api/authApi";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();
const TOKEN_KEY = "festix_token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * ADVANCEMENT 1: Standardized Logout
   * Memoized with useCallback to prevent unnecessary re-renders
   */
  const logout = useCallback(() => {
    console.log("Logout triggered: clearing session...");
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  /**
   * ADVANCEMENT 2: Robust Session Verification
   * Checks token, fetches profile if token exists
   */
  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Profile request relies on interceptor to set Authorization header
      const userData = await getProfile();
      setUser(userData);
    } catch (error) {
      console.error("Auth check failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  /**
   * ADVANCEMENT 3: Atomic Login & Register
   * Returns user object immediately for role-based navigation
   */
  const login = useCallback(async (credentials) => {
    try {
      const { token, user: userData } = await loginUser(credentials);
      localStorage.setItem(TOKEN_KEY, token);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error; // re-throw for UI error handling
    }
  }, []);

  const register = useCallback(async (formData) => {
    try {
      const { token, user: userData } = await registerUser(formData);
      localStorage.setItem(TOKEN_KEY, token);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  }, []);

  /**
   * ADVANCEMENT 4: Listen for logout events across tabs
   */
  useEffect(() => {
    checkAuthStatus();

    const syncLogout = (e) => {
      if (e.key === TOKEN_KEY && !e.newValue) logout();
    };

    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, [checkAuthStatus, logout]);

  /**
   * ADVANCEMENT 5: Provide context and prevent flashing login
   */
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isOrganizer: user?.role === "ORGANIZER",
        isAdmin: user?.role === "ADMIN",
        login,
        register,
        logout,
      }}
    >
      {!loading ? (
        children
      ) : (
        <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
          <div className="animate-pulse text-indigo-600 font-bold text-xl">
            Festix...
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

/**
 * Custom Hook to use AuthContext safely
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
