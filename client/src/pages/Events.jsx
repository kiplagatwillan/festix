import React, { useEffect, useState, useCallback } from "react";
import { useEvents } from "../context/EventContext";
import EventCard from "../components/event/EventCard";
import EventFilterPanel from "../components/event/EventFilterPanel";
import SearchBar from "../components/common/SearchBar";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, AlertCircle } from "lucide-react";

const Events = () => {
  const { events, loading, getEvents, filters, updateFilters } = useEvents();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Local state for the search input to keep the UI snappy
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  /**
   * EFFECT: Debounced Search Logic
   * This prevents the 429 error by waiting 500ms after the last keystroke
   */
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      updateFilters({ search: searchTerm });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, updateFilters]);

  /**
   * EFFECT: Sync with Backend
   * Now this only fires when the GLOBAL filters (updated by debounce) change
   */
  useEffect(() => {
    getEvents();
  }, [
    getEvents,
    filters.search,
    filters.category,
    filters.maxPrice,
    filters.date,
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
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
                value={searchTerm} // Use local searchTerm for immediate feedback
                onChange={(val) => setSearchTerm(val)} // Update local state only
                placeholder="Search by name, artist, or venue..."
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <EventFilterPanel filters={filters} setFilters={updateFilters} />
          </aside>

          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center justify-center gap-2 w-full bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 font-bold dark:text-white"
          >
            <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
            {showMobileFilters ? "Hide Filters" : "Show Filters & Sorting"}
          </button>

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
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-[3rem] border border-red-100">
                <div className="flex justify-center mb-4">
                  <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-red-500">
                  No events found
                </h3>
                <p className="text-gray-500 mt-2">
                  Try adjusting your filters or search term.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    updateFilters({
                      search: "",
                      category: "All",
                      maxPrice: 1000,
                    });
                  }}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold"
                >
                  Reset Filters
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
