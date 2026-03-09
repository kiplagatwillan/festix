import React from "react";
import { Calendar, MapPin, Tag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  const isLowStock = event.availableTickets > 0 && event.availableTickets < 10;

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            event.imageUrl ||
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80"
          }
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-indigo-600 uppercase tracking-wider">
          {event.category}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {event.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(event.date).toLocaleDateString()}
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            {event.venue}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              ${event.price}
            </span>
            {isLowStock && (
              <p className="text-[10px] text-red-500 font-bold animate-pulse">
                ONLY {event.availableTickets} LEFT!
              </p>
            )}
          </div>
          <Link
            to={`/events/${event.id}`}
            className="flex items-center bg-gray-900 dark:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-600 transition-colors"
          >
            Details <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
