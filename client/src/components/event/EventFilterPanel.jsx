import React from "react";
import { Filter, DollarSign, Clock } from "lucide-react";

const EventFilterPanel = ({ filters, setFilters }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 h-fit sticky top-24">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-indigo-600" />
        <h2 className="font-bold dark:text-white text-lg">Filters</h2>
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4" /> Max Price: $
            {filters.maxPrice || "500"}
          </label>
          <input
            type="range"
            min="0"
            max="1000"
            value={filters.maxPrice || 500}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value })
            }
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {/* Date Filter */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4" /> Start Date
          </label>
          <input
            type="date"
            className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />
        </div>

        <button
          onClick={() => setFilters({})}
          className="w-full py-2.5 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
};

export default EventFilterPanel;
