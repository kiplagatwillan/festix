// src/pages/organizer/MyEvents.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getOrganizerEvents, deleteEvent } from "../../api/eventApi";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Search,
  Ticket,
  DollarSign,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const MyEvents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Fetch Organizer Events
   */
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getOrganizerEvents();
      const eventData = res?.data?.data || res?.data || res || [];
      setEvents(Array.isArray(eventData) ? eventData : []);
    } catch (error) {
      console.error("Fetch Events Error:", error);
      toast.error("Failed to load your events");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete Event
   */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
      toast.success("Event deleted successfully");
    } catch (error) {
      console.error("Delete Event Error:", error);
      toast.error("Failed to delete event");
    }
  };

  /**
   * Protect Route (Only Organizer/Admin)
   */
  useEffect(() => {
    if (!user || !["ORGANIZER", "ADMIN"].includes(user.role)) {
      toast.error("Access Denied");
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchEvents();
  }, []);

  /**
   * Stats Cards
   */
  const stats = [
    {
      label: "Total Events",
      value: events.length,
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      label: "Tickets Sold",
      value: events.reduce((acc, curr) => acc + (curr.ticketsSold || 0), 0),
      icon: <Ticket className="w-6 h-6 text-green-600" />,
      bg: "bg-green-50",
    },
    {
      label: "Total Revenue",
      value: `$${events
        .reduce(
          (acc, curr) =>
            acc + (curr.revenue || curr.price * (curr.ticketsSold || 0)),
          0,
        )
        .toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6 text-purple-600" />,
      bg: "bg-purple-50",
    },
  ];

  /**
   * Search Filter
   */
  const filteredEvents = events.filter((event) =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /**
   * Loading State
   */
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-400">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-slate-900 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            Organizer Dashboard
          </h1>
          <p className="text-gray-500">Manage, track, and grow your events.</p>
        </div>

        <Link
          to="/organizer/create-event"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg"
        >
          <Plus size={20} /> Create Event
        </Link>
      </div>

      {/* ===== Stats Cards ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm flex items-center gap-4"
          >
            <div className={`p-4 rounded-xl ${stat.bg} dark:bg-opacity-10`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {stat.label}
              </p>
              <p className="text-2xl font-black dark:text-white">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* SEARCH */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search your events..."
          className="w-full pl-10 pr-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* EMPTY STATE */}
      {!loading && filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed dark:border-slate-700">
          <p className="text-gray-500 mb-4">
            No events found. Start by creating one!
          </p>
          <Link
            to="/organizer/create-event"
            className="text-indigo-600 font-bold"
          >
            Create Event →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-indigo-300 transition-colors"
            >
              {/* EVENT INFO */}
              <div className="flex items-center gap-4 w-full">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Calendar size={28} />
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-lg dark:text-white">
                    {event.title}
                  </h3>

                  <div className="flex gap-4 text-sm text-gray-500 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(event.date).toLocaleDateString()}
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {event.venue || event.location}
                    </span>
                  </div>

                  {event.totalTickets && (
                    <div className="mt-2">
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                        {event.availableTickets} / {event.totalTickets} Tickets
                        Left
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 w-full md:w-auto">
                <Link
                  to={`/organizer/edit-event/${event.id}`}
                  className="flex-1 md:flex-none p-2.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700 rounded-lg transition flex justify-center"
                >
                  <Edit2 size={18} />
                </Link>

                <button
                  onClick={() => handleDelete(event.id)}
                  className="flex-1 md:flex-none p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition flex justify-center"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
