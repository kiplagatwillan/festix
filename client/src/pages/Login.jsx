import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { Ticket, ArrowRight } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen flex bg-[#0f172a]">
      {/* LEFT COLUMN: FORM */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 sm:px-12 lg:flex-none lg:w-[550px] xl:w-[650px] bg-[#0f172a] z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto w-full max-w-sm"
        >
          <div className="mb-12">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-indigo-600 p-3 rounded-2xl group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-500/40">
                <Ticket className="text-white w-7 h-7" />
              </div>
              <span className="text-3xl font-black text-white tracking-tighter">
                Festix
              </span>
            </Link>

            <h2 className="mt-12 text-4xl font-black text-white tracking-tight">
              Welcome back
            </h2>
            <p className="mt-3 text-slate-400 font-medium text-lg leading-relaxed">
              Enter your credentials to access your tickets.
            </p>
          </div>

          <LoginForm />

          <div className="mt-12 pt-8 border-t border-slate-800">
            <p className="text-center text-slate-400 font-medium">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="block mt-4 font-black text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-2 transition-colors"
              >
                Create an account <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* RIGHT COLUMN: VISUAL HYPER-GLOSS */}
      <div className="hidden lg:block relative flex-1 w-0 overflow-hidden">
        <img
          className="absolute inset-0 h-full w-full object-cover scale-105"
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80"
          alt="Concert Energy"
        />
        {/* Deep Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0f172a] via-[#0f172a]/40 to-transparent flex items-center px-24">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-xl"
          >
            <h3 className="text-6xl font-black text-white leading-tight mb-6">
              Experience the <br />
              <span className="text-indigo-500">world's best</span> events.
            </h3>
            <p className="text-xl text-slate-300 font-medium opacity-90 leading-relaxed border-l-4 border-indigo-600 pl-6">
              Festix is your premium gateway to <br /> unforgettable moments
              across Africa.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
