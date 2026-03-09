import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";
import { Ticket } from "lucide-react";

const Register = () => {
  const handleGoogleAuth = () => {
    // This triggers our backend passport/google route
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900">
      {/* Right Side: Form Section (Moved to right for variety) */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 sm:px-12 lg:flex-none lg:px-24 xl:px-32">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-xl">
                <Ticket className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black dark:text-white">
                Festix
              </span>
            </Link>
            <h2 className="mt-8 text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              Join thousands of event enthusiasts worldwide.
            </p>
          </div>

          <div className="mt-6">
            {/* Social Auth Option */}
            <button
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg"
                className="w-5 h-5"
                alt="Google"
              />
              Continue with Google
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="px-4 bg-white dark:bg-gray-900 text-gray-400 font-bold">
                  Or with email
                </span>
              </div>
            </div>

            <RegisterForm />

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-indigo-600 hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Left Side: Visual Content (Hidden on Mobile) */}
      <div className="hidden lg:block relative flex-1 w-0 order-first">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80"
          alt="Stage lighting"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent flex items-end">
          <div className="p-16 text-white">
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-yellow-400 text-xl">
                  ★
                </span>
              ))}
            </div>
            <p className="text-2xl italic font-medium mb-4">
              "The smoothest ticketing experience I've ever used. The QR entry
              system is flawless."
            </p>
            <p className="font-bold text-indigo-200 tracking-widest uppercase text-sm">
              — Marcus V, Festival Organizer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
