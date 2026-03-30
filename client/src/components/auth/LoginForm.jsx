import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const inputStyle =
    "w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none bg-white text-gray-900 placeholder-gray-400 border-gray-300 focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white dark:border-slate-600";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(formData);
      toast.success(`Welcome back, ${user.name}!`);

      // One-time redirection logic
      if (user.role === "ORGANIZER") {
        navigate("/organizer/my-events");
      } else if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/events"); // Standard user landing
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="email"
            required
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={inputStyle}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="password"
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={inputStyle}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center transition"
      >
        {loading ? (
          <Loader2 className="animate-spin mr-2 w-5 h-5" />
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
