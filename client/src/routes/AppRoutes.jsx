import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Layouts
import MainLayout from "../layouts/MainLayout"; // Shared Navbar/Footer
import AuthLayout from "../layouts/AuthLayout"; // Centered for Login/Register

// Guards
import ProtectedRoute from "../components/common/ProtectedRoute";
import RoleGuard from "../components/common/RoleGuard";

// Lazy Loading for Performance (Industry Standard)
const Home = lazy(() => import("../pages/Home"));
const Events = lazy(() => import("../pages/Events"));
const EventDetails = lazy(() => import("../pages/EventDetails"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Profile = lazy(() => import("../pages/Profile"));
const MyTickets = lazy(() => import("../pages/MyTickets"));

// Organizer & Admin Pages
const AdminAnalytics = lazy(() => import("../pages/admin/AdminAnalytics"));
const ManageEvents = lazy(() => import("../pages/admin/ManageEvents"));
const ManageUsers = lazy(() => import("../pages/admin/ManageUsers"));

/**
 * World-Class Routing Engine
 * Features: Lazy Loading, Role-Based Access, and Framer Motion Transitions
 */
const AppRoutes = () => {
  const location = useLocation();

  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-gray-950">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* 1. Public Routes (Main Layout) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />

            {/* 2. Authenticated User Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-tickets" element={<MyTickets />} />
              <Route path="/my-tickets/:id" element={<EventDetails />} />{" "}
              {/* Reusing Details for ticket view */}
            </Route>

            {/* 3. Admin & Staff Routes (Role Guarded) */}
            <Route element={<RoleGuard allowedRoles={["ADMIN"]} />}>
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/events" element={<ManageEvents />} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route>

            {/* 4. Organizer Routes */}
            <Route
              element={<RoleGuard allowedRoles={["ORGANIZER", "ADMIN"]} />}
            >
              <Route path="/dashboard" element={<AdminAnalytics />} />{" "}
              {/* Organizer sees their specific analytics */}
            </Route>
          </Route>

          {/* 5. Auth Routes (Specific Layout) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* 6. Catch-all: 404 Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

export default AppRoutes;
