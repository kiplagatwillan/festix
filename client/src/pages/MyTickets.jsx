// src/pages/MyTickets.jsx
import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Calendar, MapPin, Ticket as TicketIcon } from "lucide-react";
import { useEvents } from "../context/EventContext";

const MyTickets = () => {
  const { tickets, ticketLoading } = useEvents();

  // 🔄 Loading State
  if (ticketLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
        My Tickets
      </h1>
      <p className="text-gray-500 mb-10">
        All your booked events and digital passes in one place.
      </p>

      {/* Empty State */}
      {tickets.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-slate-800 rounded-3xl">
          <TicketIcon className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">
            You haven't purchased any tickets yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="flex flex-col md:flex-row bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm"
            >
              {/* Event Info */}
              <div className="flex-1 p-6">
                {/* Status Badge */}
                <div className="mb-3">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      ticket.status === "VALID"
                        ? "bg-green-100 text-green-700"
                        : ticket.status === "USED"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-black dark:text-white mb-4">
                  {ticket.event?.title}
                </h2>

                {/* Details */}
                <div className="space-y-2 text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>
                      {new Date(ticket.event?.date).toLocaleDateString(
                        undefined,
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{ticket.event?.venue}</span>
                  </div>
                </div>
              </div>

              {/* QR Section */}
              <div className="w-full md:w-52 bg-gray-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 border-t md:border-t-0 md:border-l border-dashed border-gray-200 dark:border-slate-700">
                <div className="bg-white p-2 rounded-xl shadow-inner mb-3">
                  <QRCodeSVG value={ticket.ticketHash} size={100} />
                </div>

                <p className="text-[10px] font-mono text-gray-400 text-center break-all">
                  {ticket.ticketHash}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
