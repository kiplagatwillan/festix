import React, { useEffect } from "react";
import { useEvents } from "../context/EventContext";
import EventCard from "../components/event/EventCard";
import SearchBar from "../components/common/SearchBar";
import CategoryChips from "../components/event/CategoryChips";
import { motion } from "framer-motion";

const Home = () => {
  const { events, loading, getEvents, filters, updateFilters } = useEvents();

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight"
          >
            Don't just watch. <br />{" "}
            <span className="text-indigo-600">Be there.</span>
          </motion.h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Discover, book, and attend the most exclusive events around the
            world. Secure, fast, and world-class.
          </p>
          <div className="flex justify-center">
            <SearchBar
              value={filters.search}
              onChange={(val) => updateFilters({ search: val })}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className="text-3xl font-bold dark:text-white mb-4 md:mb-0">
            Trending Events
          </h2>
          <CategoryChips
            selectedCategory={filters.category}
            onSelect={(cat) => updateFilters({ category: cat })}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-80 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-3xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
