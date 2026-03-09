import React, { useEffect, useState } from "react";
import { fetchEvents, deleteEvent } from "../../api/eventApi";
import { Trash2, ExternalLink, ShieldCheck, Search } from "lucide-react";
import toast from "react-hot-toast";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      const data = await fetchEvents();
      setEvents(data);
    };
    loadEvents();
  }, []);

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure? This will remove the event and notify ticket holders.",
      )
    ) {
      try {
        await deleteEvent(id);
        setEvents(events.filter((e) => e.id !== id));
        toast.success("Event purged successfully");
      } catch (err) {
        toast.error("Failed to delete event");
      }
    }
  };

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            Manage Events
          </h1>
          <p className="text-gray-500">
            Review, moderate, and manage all platform listings.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 text-gray-400 text-xs uppercase tracking-widest font-bold">
              <th className="px-6 py-4">Event Details</th>
              <th className="px-6 py-4">Organizer</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredEvents.map((event) => (
              <tr
                key={event.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 dark:text-white">
                    {event.title}
                  </div>
                  <div className="text-xs text-gray-500">{event.venue}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {event.organizer?.name || "System Admin"}
                </td>
                <td className="px-6 py-4 font-mono font-bold text-indigo-600">
                  ${event.price}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-black uppercase">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageEvents;
