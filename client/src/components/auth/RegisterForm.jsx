import React, { useState } from "react";
import RoleSelector from "./RoleSelector";
import { registerUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const inputStyle =
    "w-full pl-10 pr-4 py-2.5 border rounded-lg outline-none " +
    "bg-white text-gray-900 placeholder-gray-400 " +
    "border-gray-300 focus:ring-2 focus:ring-indigo-500 " +
    "dark:bg-slate-800 dark:text-white dark:border-slate-600";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser(formData);

      await login({
        email: formData.email,
        password: formData.password,
      });

      toast.success("Welcome to Festix! 🎉");

      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <RoleSelector
        selectedRole={formData.role}
        setRole={(role) => handleChange("role", role)}
      />

      {/* Full Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Full Name
        </label>

        <div className="relative">
          <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

          <input
            type="text"
            required
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={inputStyle}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
          Email Address
        </label>

        <div className="relative">
          <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

          <input
            type="email"
            required
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={inputStyle}
          />
        </div>
      </div>

      {/* Password */}
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
            onChange={(e) => handleChange("password", e.target.value)}
            className={inputStyle}
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow transition flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2 w-5 h-5" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};

export default RegisterForm;
