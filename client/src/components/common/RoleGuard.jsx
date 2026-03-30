// src/components/common/RoleGuard.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RoleGuard = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // Show a spinner while auth state is loading
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If no user or role is not allowed, redirect to home
  if (!user || !allowedRoles.includes(user.role)) {
    console.warn("Access Denied: Role mismatch", {
      userRole: user?.role || "undefined",
      requiredRoles: allowedRoles,
    });
    return <Navigate to="/" replace />;
  }

  // Render child routes (protected pages)
  return <Outlet />;
};

export default RoleGuard;
