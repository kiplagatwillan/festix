import { createContext, useState, useContext, useCallback } from "react";
import { fetchEvents } from "../api/eventApi";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: null,
    maxPrice: 1000,
    date: "",
  });

  const getEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEvents(filters);
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: null,
      maxPrice: 1000,
      date: "",
    });
  };

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        filters,
        updateFilters,
        getEvents,
        clearFilters,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
