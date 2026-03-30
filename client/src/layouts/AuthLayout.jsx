import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AuthLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
      {/* Ambient Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />

      {/* Page Transition Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="z-10 w-full max-w-md px-4"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>

      {/* Minimalist Bottom Bar */}
      <div className="absolute bottom-6 w-full text-center">
        <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">
          &copy; 2026 Festix Security Engine — Verified & Encrypted
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
