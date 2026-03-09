import React from "react";
import {
  Calendar,
  MapPin,
  Ticket as TicketIcon,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const TicketStub = ({ ticket }) => {
  const isUsed = ticket.status === "used";

  return (
    <div
      className={`relative flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border ${isUsed ? "border-gray-200 opacity-60" : "border-indigo-100 shadow-sm"} transition-all`}
    >
      {/* Left Decoration (The "Stub") */}
      <div
        className={`hidden md:flex w-12 items-center justify-center border-r-2 border-dashed ${isUsed ? "bg-gray-100 border-gray-300" : "bg-indigo-50 border-indigo-200"}`}
      >
        <TicketIcon
          className={`rotate-90 w-6 h-6 ${isUsed ? "text-gray-400" : "text-indigo-400"}`}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {ticket.event.title}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${isUsed ? "bg-gray-200 text-gray-500" : "bg-green-100 text-green-600"}`}
          >
            {ticket.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
            {new Date(ticket.event.date).toLocaleDateString(undefined, {
              dateStyle: "medium",
            })}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
            {ticket.event.venue}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Link
        to={`/my-tickets/${ticket.id}`}
        className="flex items-center justify-center px-6 bg-gray-50 dark:bg-gray-900 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors group"
      >
        <span className="text-sm font-bold text-indigo-600 mr-2">View QR</span>
        <ChevronRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};

const MyTicketsList = ({ tickets }) => {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
        <TicketIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          No tickets found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Time to find your next favorite event!
        </p>
        <Link
          to="/events"
          className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none"
        >
          Explore Events
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <TicketStub key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};

export default MyTicketsList;
