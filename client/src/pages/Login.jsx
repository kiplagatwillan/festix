import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { Ticket, ArrowRight } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900">
      <div className="flex-1 flex flex-col justify-center px-8 py-12 sm:px-12 lg:flex-none lg:px-24 xl:px-32">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mx-auto w-full max-w-sm lg:w-96"
        >
          <div className="mb-10">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-indigo-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <Ticket className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black dark:text-white">
                Festix
              </span>
            </Link>
            <h2 className="mt-8 text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
              Enter your credentials to access your tickets.
            </p>
          </div>
          <div className="mt-8">
            <LoginForm />
            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-indigo-600 hover:text-indigo-500 flex items-center justify-center gap-1 mt-2"
                >
                  Create an account <ArrowRight className="w-4 h-4" />
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="hidden lg:block relative flex-1 w-0">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80"
          alt="Concert"
        />
        <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[2px] flex items-center justify-center">
          <div className="p-12 text-white max-w-lg">
            <h3 className="text-4xl font-black mb-4">
              Experience the world's best events.
            </h3>
            <p className="text-lg text-indigo-50 font-medium opacity-90">
              Festix is your gateway to unforgettable moments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
