// src/components/EventCard.jsx
import React from "react";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  const fallbackImage =
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80";

  const isLowStock = event.availableTickets > 0 && event.availableTickets < 10;
  const isSoldOut = event.availableTickets === 0;

  // ✅ FIXED: Removed cache-busting query
  const imageSrc = event.imageUrl || fallbackImage;

  // ✅ Compute lowest ticket price dynamically
  const lowestPrice =
    event.ticketTiers?.length > 0
      ? Math.min(...event.ticketTiers.map((t) => t.price))
      : 0;

  // ✅ Check if event has ticket tiers
  const hasTiers = event.ticketTiers && event.ticketTiers.length > 0;

  return (
    <div className="event-card group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-xl transition-shadow duration-300 max-w-sm mx-auto">
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={imageSrc}
          alt={event.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full text-[10px] font-bold text-indigo-600 uppercase">
          {event.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
            {event.title}
          </h3>

          <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(event.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {event.venue}
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-indigo-600">
                From KES {lowestPrice}
              </span>

              {isLowStock && (
                <p className="text-[10px] text-red-500 font-bold animate-pulse">
                  ONLY {event.availableTickets} LEFT!
                </p>
              )}
            </div>

            {/* Optional: show tiers */}
            {hasTiers && (
              <ul className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                {event.ticketTiers.map((tier) => (
                  <li key={tier.id}>
                    {tier.name}: KES {tier.price} ({tier.available || "—"} left)
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between mt-4">
          {/* DETAILS */}
          <Link
            to={`/events/${event.id}`}
            className="flex-1 text-center bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-600 transition"
          >
            Details <ArrowRight className="inline-block w-3 h-3 ml-1" />
          </Link>

          {/* BUY TICKET */}
          <Link
            to={hasTiers ? `/event/${event.id}/tickets` : "#"}
            onClick={(e) => {
              if (!hasTiers) {
                e.preventDefault();
                alert("No ticket tiers available for this event");
              }
            }}
            className={`ml-2 flex-1 text-center px-3 py-1.5 rounded-lg font-bold text-xs transition ${
              isSoldOut || !hasTiers
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {isSoldOut ? "Sold Out" : !hasTiers ? "Unavailable" : "Buy Ticket"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
