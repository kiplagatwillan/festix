import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Menu,
  X,
  Ticket,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Settings,
  Calendar,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setShowProfileMenu(false);
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-[100] bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* --- LOGO SECTION --- */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-indigo-600 p-2 rounded-2xl group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-500/20">
              <Ticket className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
              Festix
            </span>
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden md:flex items-center space-x-10">
            {/* PUBLIC LINKS */}
            <div className="flex items-center space-x-8">
              <NavLink to="/events" label="Explore" />
              {/* Only show "Host an Event" to potential organizers/authenticated users */}
              {(!user || user.role === "ORGANIZER") && (
                <NavLink to="/host" label="Host" />
              )}
            </div>

            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />

            <div className="flex items-center space-x-6">
              <DarkModeToggle />

              {/* --- AUTHENTICATION STATE TOGGLE --- */}
              {user ? (
                /* 👤 LOGGED IN VIEW */
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-slate-100 dark:bg-slate-800 border border-transparent hover:border-indigo-500/50 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xs uppercase overflow-hidden">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.name?.charAt(0)
                      )}
                    </div>
                    <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                      {user.name?.split(" ")[0]}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${showProfileMenu ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* PROFILE DROPDOWN */}
                  <AnimatePresence>
                    {showProfileMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowProfileMenu(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-4 w-64 bg-white dark:bg-[#1e293b] rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-3 z-20"
                        >
                          <div className="px-4 py-3 mb-2 border-b border-slate-50 dark:border-slate-800">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Account Type
                            </p>
                            <p className="text-xs font-bold text-indigo-500 uppercase">
                              {user.role}
                            </p>
                          </div>

                          <DropdownItem
                            to="/profile"
                            icon={<User size={16} />}
                            label="My Profile"
                          />
                          <DropdownItem
                            to="/my-tickets"
                            icon={<CreditCard size={16} />}
                            label="My Tickets"
                          />

                          {(user.role === "ADMIN" ||
                            user.role === "ORGANIZER") && (
                            <DropdownItem
                              to="/organizer/dashboard"
                              icon={<LayoutDashboard size={16} />}
                              label="Dashboard"
                              className="text-indigo-600 dark:text-indigo-400"
                            />
                          )}

                          <div className="my-2 border-t border-slate-50 dark:border-slate-800" />

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-black text-sm"
                          >
                            <LogOut size={16} /> Sign Out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* 🔑 LOGGED OUT VIEW */
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-6 py-2.5 text-sm font-black text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
                  >
                    Join Festix
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* --- MOBILE TOGGLE --- */}
          <div className="md:hidden flex items-center space-x-4">
            <DarkModeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-[#0f172a] border-t border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <MobileLink
                  to="/events"
                  label="Events"
                  icon={<Calendar size={18} />}
                />
                <MobileLink
                  to="/my-tickets"
                  label="Tickets"
                  icon={<CreditCard size={18} />}
                />
              </div>

              {user ? (
                <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    to="/profile"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-600" />
                    <div>
                      <p className="font-black text-slate-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs font-bold text-slate-500">
                        View Profile
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 font-black flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-4 pt-4">
                  <Link
                    to="/login"
                    className="block w-full py-4 text-center font-black text-slate-600 dark:text-slate-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full py-4 text-center bg-indigo-600 text-white rounded-2xl font-black shadow-lg"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

/* --- HELPER COMPONENTS --- */

const NavLink = ({ to, label }) => (
  <Link
    to={to}
    className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
  >
    {label}
  </Link>
);

const DropdownItem = ({ to, icon, label, className = "" }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-bold text-sm text-slate-600 dark:text-slate-300 ${className}`}
  >
    {icon} {label}
  </Link>
);

const MobileLink = ({ to, label, icon }) => (
  <Link
    to={to}
    className="flex flex-col items-center justify-center gap-2 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
  >
    <div className="text-indigo-600">{icon}</div>
    <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">
      {label}
    </span>
  </Link>
);

export default Navbar;
