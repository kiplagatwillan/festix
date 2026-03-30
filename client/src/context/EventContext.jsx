// src/context/EventContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { fetchEvents } from "../api/eventApi";
import { getMyTickets, buyTicketAPI } from "../api/ticketApi";
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

  // ✅ prevents duplicate calls
  const hasFetched = useRef(false);

  /* =====================================================
     FETCH EVENTS (SAFE + NO SPAM)
  ===================================================== */
  const getEvents = useCallback(async (currentFilters) => {
    try {
      setLoading(true);

      const data = await fetchEvents(currentFilters);

      const processed = Array.isArray(data)
        ? data.map((ev) => ({
            ...ev,
            lowestPrice:
              ev.ticketTiers?.length > 0
                ? Math.min(...ev.ticketTiers.map((t) => t.price))
                : 0,
          }))
        : [];

      setEvents(processed);
    } catch (err) {
      if (err.response?.status === 429) {
        console.warn("⚠️ Rate limited: slow down requests");
      } else {
        console.error("❌ Error fetching events:", err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /* =====================================================
     INITIAL LOAD (ONLY ONCE)
  ===================================================== */
  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;
    getEvents(filters);
  }, [getEvents]);

  /* =====================================================
     FILTER CHANGE (CONTROLLED)
  ===================================================== */
  useEffect(() => {
    // prevent firing on first render (already handled above)
    if (!hasFetched.current) return;

    const delay = setTimeout(() => {
      getEvents(filters);
    }, 400); // small delay ONLY here

    return () => clearTimeout(delay);
  }, [filters, getEvents]);

  /* =====================================================
     UPDATE FILTERS (SAFE)
  ===================================================== */
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };

      // ✅ prevent unnecessary updates (VERY IMPORTANT)
      if (JSON.stringify(prev) === JSON.stringify(updated)) {
        return prev;
      }

      return updated;
    });
  }, []);

  /* =====================================================
     FETCH USER TICKETS (ONLY IF LOGGED IN)
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

  /* =====================================================
     FETCH TICKETS ON LOGIN
  ===================================================== */
  useEffect(() => {
    if (isAuthenticated) {
      getTickets();
    }
  }, [isAuthenticated, getTickets]);

  /* =====================================================
     BUY TICKET
  ===================================================== */
  const buyTicket = useCallback(
    async (eventId, quantity = 1) => {
      if (!isAuthenticated) {
        alert("Please login first");
        return;
      }

      try {
        const res = await buyTicketAPI(eventId, quantity);

        if (res.success) {
          // update tickets instantly
          setTickets((prev) => [...prev, ...(res.data?.tickets || [])]);

          // update event availability
          setEvents((prev) =>
            prev.map((ev) =>
              ev.id === eventId
                ? {
                    ...ev,
                    availableTickets: res.data.event.availableTickets,
                  }
                : ev,
            ),
          );
        }
      } catch (err) {
        console.error("❌ Error buying ticket:", err);
        alert(err.response?.data?.message || "Purchase failed. Try again.");
      }
    },
    [isAuthenticated],
  );

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
        buyTicket,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within EventProvider");
  }
  return context;
};
