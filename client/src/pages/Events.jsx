import React, { useEffect, useState } from "react";
import { useEvents } from "../context/EventContext";
import EventCard from "../components/event/EventCard";
import EventFilterPanel from "../components/event/EventFilterPanel";
import SearchBar from "../components/common/SearchBar";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, LayoutGrid, AlertCircle } from "lucide-react";

const Events = () => {
  const { events, loading, getEvents, filters, updateFilters } = useEvents();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync with Backend whenever filters change
  useEffect(() => {
    getEvents();
  }, [getEvents, filters.category, filters.maxPrice, filters.date]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Explore Events
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
                Showing {events.length} exclusive experiences curated for you.
              </p>
            </div>

            <div className="flex-1 max-w-xl">
              <SearchBar
                value={filters.search}
                onChange={(val) => updateFilters({ search: val })}
                placeholder="Search by name, artist, or venue..."
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <EventFilterPanel filters={filters} setFilters={updateFilters} />
          </aside>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center justify-center gap-2 w-full bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 font-bold dark:text-white"
          >
            <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
            {showMobileFilters ? "Hide Filters" : "Show Filters & Sorting"}
          </button>

          {/* Mobile Filter Dropdown */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden"
              >
                <EventFilterPanel
                  filters={filters}
                  setFilters={updateFilters}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Event Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="h-[400px] bg-white dark:bg-gray-800 rounded-3xl animate-pulse border border-gray-100 dark:border-gray-800"
                  />
                ))}
              </div>
            ) : events.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-full mb-4">
                  <AlertCircle className="w-12 h-12 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-black dark:text-white">
                  No events match your criteria
                </h3>
                <p className="text-gray-500 mt-2">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={() =>
                    updateFilters({
                      search: "",
                      category: null,
                      maxPrice: 1000,
                    })
                  }
                  className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Events;
