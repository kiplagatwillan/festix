import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../api/adminApi";
import { UserCheck, Shield, MoreVertical, Mail } from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await getAllUsers();
      setUsers(data);
    };
    loadUsers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          User Directory
        </h1>
        <p className="text-gray-500">
          Monitor and manage access levels for all {users.length} members.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-2xl">
                <UserCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {user.name}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Mail className="w-4 h-4 mr-2" /> {user.email}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
              <span
                className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                  user.role === "ADMIN"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                <Shield className="w-3 h-3" /> {user.role}
              </span>
              <span className="text-[10px] text-gray-400">
                ID: {user.id.substring(0, 8)}...
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageUsers;
