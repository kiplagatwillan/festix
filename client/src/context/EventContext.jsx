import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { fetchEvents } from "../api/eventApi";
import { getMyTickets } from "../api/ticketApi";
import { useAuth } from "./AuthContext";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ticketLoading, setTicketLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    minPrice: "",
    maxPrice: "",
    date: "",
  });

  const hasFetched = useRef(false);

  /* =====================================================
     FETCH EVENTS (WITH CACHING & PROCESSING)
  ===================================================== */
  const getEvents = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      const data = await fetchEvents(currentFilters);

      const processed = Array.isArray(data)
        ? data.map((ev) => ({
            ...ev,
            // Calculate lowest price for UI badges
            lowestPrice:
              ev.ticketTiers?.length > 0
                ? Math.min(...ev.ticketTiers.map((t) => t.price))
                : 0,
          }))
        : [];

      setEvents(processed);
    } catch (err) {
      console.error("❌ Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =====================================================
     LIFECYCLE: INITIAL LOAD & FILTER UPDATES
  ===================================================== */
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      getEvents(filters);
    }
  }, [getEvents]);

  useEffect(() => {
    if (!hasFetched.current) return;
    const delay = setTimeout(() => getEvents(filters), 400);
    return () => clearTimeout(delay);
  }, [filters, getEvents]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  /* =====================================================
     USER TICKETS (SYNCED WITH PROFILE)
  ===================================================== */
  const getTickets = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setTicketLoading(true);
      const res = await getMyTickets();
      setTickets(res?.tickets || []);
    } catch (err) {
      console.error("❌ Error fetching tickets:", err);
    } finally {
      setTicketLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) getTickets();
  }, [isAuthenticated, getTickets]);

  /**
   * ✅ SYNC FIX: updateEventAvailability
   * This helper allows the Cart or PaymentPage to "locally" update
   * the event count once a purchase is successful, keeping the UI snappy.
   */
  const updateEventAvailability = useCallback((eventId, newCount) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === eventId ? { ...ev, availableTickets: newCount } : ev,
      ),
    );
  }, []);

  return (
    <EventContext.Provider
      value={{
        events,
        tickets,
        loading,
        ticketLoading,
        filters,
        updateFilters,
        getEvents,
        getTickets,
        updateEventAvailability, // ✅ New utility for syncing
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error("useEvents must be used within EventProvider");
  return context;
};
