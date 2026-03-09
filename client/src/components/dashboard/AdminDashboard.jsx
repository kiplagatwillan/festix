import React from "react";
import { ShieldAlert, Users, Landmark, Activity } from "lucide-react";
import AnalyticsCharts from "./AnalyticsCharts";

const AdminDashboard = ({ globalStats, categoryData }) => {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            System Overview
          </h1>
          <p className="text-gray-500">
            Global platform performance and user management.
          </p>
        </div>
        <button className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" /> System Logs
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl shadow-indigo-200 dark:shadow-none">
          <Users className="w-10 h-10 mb-4 opacity-80" />
          <p className="text-indigo-100 text-sm">Total Registered Users</p>
          <h2 className="text-4xl font-black mt-1">{globalStats.totalUsers}</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
          <Landmark className="w-10 h-10 mb-4 text-emerald-500" />
          <p className="text-gray-500 text-sm">Platform Volume (GMV)</p>
          <h2 className="text-4xl font-black mt-1 dark:text-white">
            ${globalStats.totalVolume}
          </h2>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
          <Activity className="w-10 h-10 mb-4 text-orange-500" />
          <p className="text-gray-500 text-sm">Server Health</p>
          <h2 className="text-4xl font-black mt-1 text-emerald-500">99.9%</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsCharts data={categoryData} />
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 dark:text-white">
            Pending Event Approvals
          </h3>
          <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl">
            <p className="text-gray-400">
              All caught up! No events pending review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
