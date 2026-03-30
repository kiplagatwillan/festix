import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";
import { Ticket } from "lucide-react";

const Register = () => {
  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900">
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
          </div>
          <div className="mt-6">
            <button
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition-all shadow-sm"
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
      <div className="hidden lg:block relative flex-1 w-0 order-first">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80"
          alt="Stage"
        />
      </div>
    </div>
  );
};

export default Register;
