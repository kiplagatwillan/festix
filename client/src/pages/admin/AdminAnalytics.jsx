import React, { useEffect, useState } from "react";
import { getAdminAnalytics } from "../../api/adminApi";
import AdminDashboard from "../../components/dashboard/AdminDashboard";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const stats = await getAdminAnalytics();
      setData(stats);
      setError(null);
    } catch (err) {
      setError(
        "Failed to load platform analytics. Please check your connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">
          Aggregating Global Data...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="p-8 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-800 dark:text-red-400 font-bold">{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 flex items-center gap-2 mx-auto bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <AdminDashboard
        globalStats={{
          totalUsers: data.totalUsers,
          totalVolume: data.totalRevenue,
          activeEvents: data.activeEvents,
        }}
        categoryData={data.revenueByCategory.map((item) => ({
          name: item.category,
          value: item._sum.price,
        }))}
      />
    </div>
  );
};

export default AdminAnalytics;
