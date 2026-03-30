// src/pages/EventDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById } from "../api/eventApi.js";
import { Calendar, MapPin, Tag, Users, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useEvents } from "../context/EventContext";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { buyTicket } = useEvents(); // ✅ buy ticket from context
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reserving, setReserving] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80";

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
        // Preselect lowest tier by default
        if (data.ticketTiers && data.ticketTiers.length > 0) {
          const lowestTier = data.ticketTiers.reduce((prev, curr) =>
            prev.price < curr.price ? prev : curr,
          );
          setSelectedTier(lowestTier.name);
        }
      } catch (error) {
        toast.error("Could not load event details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id]);

  const handleReserve = async () => {
    if (!selectedTier) return toast.error("Select a ticket tier first.");
    try {
      setReserving(true);
      await buyTicket(event.id, 1, selectedTier); // quantity=1 for now
      toast.success(`${selectedTier} ticket reserved!`);
      // Update local availableTickets
      setEvent((prev) => ({
        ...prev,
        ticketTiers: prev.ticketTiers.map((t) =>
          t.name === selectedTier ? { ...t, available: t.available - 1 } : t,
        ),
        availableTickets:
          prev.availableTickets > 0 ? prev.availableTickets - 1 : 0,
      }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to reserve ticket");
    } finally {
      setReserving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-800">Event Not Found</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-indigo-600 font-semibold underline"
        >
          Back to Browse
        </button>
      </div>
    );

  const imageSrc = event.imageUrl
    ? `${event.imageUrl}?t=${new Date().getTime()}`
    : fallbackImage;

  const lowestPrice =
    event.ticketTiers && event.ticketTiers.length > 0
      ? Math.min(...event.ticketTiers.map((t) => t.price))
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-10 bg-slate-50 min-h-screen"
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 font-bold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Events
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          <div className="relative group">
            <img
              src={imageSrc}
              alt={event.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackImage;
              }}
              className="w-full h-[500px] object-cover rounded-[2.5rem] shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
            />
            <div className="absolute top-6 left-6">
              <span className="bg-white/90 backdrop-blur-md text-indigo-700 px-6 py-2 rounded-2xl font-black shadow-lg flex items-center gap-2 capitalize">
                <Tag className="w-4 h-4" /> {event.category}
              </span>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h1 className="text-5xl font-black text-slate-900 leading-tight mb-6">
              {event.title}
            </h1>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-800 border-b pb-4 border-slate-100">
                About This Event
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                {event.description}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-10 bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-8">
            {/* Event Info */}
            <div className="space-y-6">
              {/* Date */}
              <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-3xl">
                <div className="bg-white p-3 rounded-2xl shadow-sm text-indigo-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase">
                    Date & Time
                  </p>
                  <p className="font-bold text-slate-800">
                    {new Date(event.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-3xl">
                <div className="bg-white p-3 rounded-2xl shadow-sm text-indigo-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase">
                    Location
                  </p>
                  <p className="font-bold text-slate-800">{event.venue}</p>
                </div>
              </div>

              {/* Tickets */}
              <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-3xl">
                <div className="bg-white p-3 rounded-2xl shadow-sm text-indigo-600">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase">
                    Tickets
                  </p>
                  <p className="font-bold text-slate-800">
                    {event.availableTickets} Available
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing & Select Tier */}
            <div className="pt-8 border-t border-slate-100 space-y-6">
              <p className="text-sm font-bold text-slate-400">
                Select Ticket Tier
              </p>
              {event.ticketTiers && event.ticketTiers.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {event.ticketTiers.map((tier) => (
                    <button
                      key={tier.name}
                      onClick={() => setSelectedTier(tier.name)}
                      className={`w-full py-3 px-4 rounded-xl font-bold transition border ${
                        selectedTier === tier.name
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-slate-800 border-gray-300 hover:bg-gray-100"
                      }`}
                      disabled={tier.available === 0}
                    >
                      {tier.name} – KES {tier.price}{" "}
                      {tier.available === 0 && "(Sold Out)"}
                    </button>
                  ))}
                </div>
              ) : (
                <p>No tickets available</p>
              )}

              {/* Show lowest price */}
              <div className="mt-4">
                <p className="text-sm font-bold text-slate-400">Price</p>
                <p className="text-3xl font-black text-slate-900">
                  KES{" "}
                  {selectedTier
                    ? event.ticketTiers.find((t) => t.name === selectedTier)
                        ?.price
                    : lowestPrice}
                </p>
              </div>

              {/* Reserve / Buy */}
              <button
                onClick={handleReserve}
                disabled={reserving || event.availableTickets === 0}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl rounded-3xl shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reserving ? "Reserving..." : "Reserve Your Spot"}
              </button>
              <p className="text-center text-slate-400 text-xs mt-4 font-medium italic">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventDetails;
