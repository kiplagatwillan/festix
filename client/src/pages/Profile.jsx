import React from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Shield, LogOut } from "lucide-react";

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600" />
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6">
            <div className="w-24 h-24 bg-white dark:bg-gray-700 rounded-3xl flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800">
              <User className="w-12 h-12 text-indigo-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold dark:text-white">{user?.name}</h1>
          <p className="text-gray-500 mb-8 flex items-center gap-2">
            <Mail className="w-4 h-4" /> {user?.email}
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-indigo-500" />
                <span className="font-bold dark:text-white">Account Role</span>
              </div>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-black rounded-lg uppercase">
                {user?.role}
              </span>
            </div>

            <button
              onClick={logout}
              className="w-full mt-6 flex items-center justify-center gap-2 py-4 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
            >
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
