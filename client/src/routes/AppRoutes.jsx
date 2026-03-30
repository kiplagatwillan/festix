import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

// Guards
import ProtectedRoute from "../components/common/ProtectedRoute";
import RoleGuard from "../components/common/RoleGuard";

// Lazy-loaded Pages
const Home = lazy(() => import("../pages/Home"));
const Events = lazy(() => import("../pages/Events"));
const EventDetails = lazy(() => import("../pages/EventDetails"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Profile = lazy(() => import("../pages/Profile"));
const MyTickets = lazy(() => import("../pages/MyTickets"));

// Organizer Pages
const MyEvents = lazy(() => import("../pages/organizer/MyEvents"));
const CreateEvent = lazy(() => import("../pages/organizer/CreateEvent"));
const EditEvent = lazy(() => import("../pages/organizer/CreateEvent"));

// Admin Pages
const AdminAnalytics = lazy(() => import("../pages/admin/AdminAnalytics"));
const ManageEvents = lazy(() => import("../pages/admin/ManageEvents"));
const ManageUsers = lazy(() => import("../pages/admin/ManageUsers"));

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
          {/* ======================== */}
          {/* Public + Authenticated Routes (MainLayout) */}
          {/* ======================== */}
          <Route element={<MainLayout />}>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />

            {/* Authenticated Attendee */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-tickets" element={<MyTickets />} />
              <Route path="/my-tickets/:id" element={<EventDetails />} />
            </Route>

            {/* Organizer / Admin */}
            <Route
              element={<RoleGuard allowedRoles={["ORGANIZER", "ADMIN"]} />}
            >
              <Route path="/organizer/my-events" element={<MyEvents />} />
              <Route path="/organizer/create-event" element={<CreateEvent />} />
              <Route path="/organizer/edit-event/:id" element={<EditEvent />} />

              <Route
                path="/organizer/dashboard"
                element={<Navigate to="/organizer/my-events" replace />}
              />
            </Route>

            {/* Admin only */}
            <Route element={<RoleGuard allowedRoles={["ADMIN"]} />}>
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/events" element={<ManageEvents />} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route>
          </Route>

          {/* ======================== */}
          {/* Auth Routes (Login/Register) */}
          {/* ======================== */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* ======================== */}
          {/* Catch-all Redirect */}
          {/* ======================== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

export default AppRoutes;
