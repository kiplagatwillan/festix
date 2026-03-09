import React from "react";
import { Calendar, Users, DollarSign, TrendingUp } from "lucide-react";
import RevenueChart from "./RevenueChart";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
          {value}
        </h4>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const OrganizerDashboard = ({ stats, chartData }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Events"
          value={stats.activeEvents}
          icon={Calendar}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Tickets Sold"
          value={stats.ticketsSold}
          icon={Users}
          color="bg-indigo-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.revenue}`}
          icon={DollarSign}
          color="bg-emerald-500"
        />
        <StatCard
          title="Avg. Attendance"
          value={`${stats.attendanceRate}%`}
          icon={TrendingUp}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={chartData} />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-4 dark:text-white">
            Recent Sales
          </h3>
          {/* List of recent transactions would go here */}
          <p className="text-gray-500 text-sm">
            No recent transactions to display.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
