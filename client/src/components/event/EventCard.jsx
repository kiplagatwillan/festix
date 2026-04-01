import React from "react";
import { Calendar, MapPin, Ticket, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const EventCard = ({ event }) => {
  const fallbackImage =
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80";

  const isLowStock = event.availableTickets > 0 && event.availableTickets < 10;
  const isSoldOut = event.availableTickets === 0;
  const imageSrc = event.imageUrl || fallbackImage;

  // ✅ Dynamic Price Logic
  const lowestPrice =
    event.ticketTiers?.length > 0
      ? Math.min(...event.ticketTiers.map((t) => t.price))
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative bg-white dark:bg-[#1e293b] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 border border-slate-100 dark:border-slate-800 w-full max-w-[300px] mx-auto"
    >
      {/* IMAGE SECTION */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={imageSrc}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Floating Category Badge */}
        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full">
          <span className="text-[10px] font-black text-white uppercase tracking-widest">
            {event.category}
          </span>
        </div>

        {/* Status Overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-tighter shadow-lg">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* CONTENT SECTION */}
      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight truncate group-hover:text-indigo-600 transition-colors">
            {event.title}
          </h3>

          <div className="mt-2 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[11px] font-bold">
                {new Date(event.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[11px] font-bold truncate">
                {event.venue}
              </span>
            </div>
          </div>
        </div>

        {/* PRICING AREA */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Starting From
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              <span className="text-xs text-indigo-600 mr-0.5">KES</span>{" "}
              {lowestPrice.toLocaleString()}
            </span>
          </div>
          {isLowStock && (
            <div className="bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg border border-red-100 dark:border-red-900/30">
              <p className="text-[9px] text-red-600 font-black animate-pulse uppercase">
                {event.availableTickets} Left!
              </p>
            </div>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to={`/events/${event.id}`}
            className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-[11px] font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Details
          </Link>

          <Link
            to={isSoldOut ? "#" : `/event/${event.id}/tickets`}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black transition-all shadow-md active:scale-95 ${
              isSoldOut
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none"
            }`}
          >
            <Ticket className="w-3 h-3" />
            Buy Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
