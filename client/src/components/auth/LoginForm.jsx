import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // ✅ Production Styling: Deep Dark Inputs with Indigo Accents
  const inputStyle =
    "w-full pl-12 pr-4 py-4 rounded-2xl outline-none transition-all font-bold " +
    "bg-[#1e293b] border-2 border-transparent text-white placeholder-slate-500 " +
    "focus:border-indigo-500 focus:bg-[#0f172a] focus:ring-4 focus:ring-indigo-500/10";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Assuming your login function returns the user object with a role
      const user = await login(formData);
      toast.success(`Welcome back, ${user.name}!`);

      // RBAC: Role-Based Access Control Redirection
      if (user.role === "ORGANIZER") {
        navigate("/organizer/dashboard");
      } else {
        navigate("/events");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Check your credentials and try again",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
          Email Address
        </label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
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

      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
          Password
        </label>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
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
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl shadow-indigo-500/20 mt-4"
      >
        {loading ? (
          <Loader2 className="animate-spin w-6 h-6" />
        ) : (
          <>
            Sign In <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
};

export default LoginForm;
