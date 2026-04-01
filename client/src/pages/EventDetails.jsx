import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById } from "../api/eventApi.js";
import {
  Calendar,
  MapPin,
  Tag,
  Users,
  ArrowLeft,
  Loader2,
  ShoppingCart,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTierName, setSelectedTierName] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80";

  const fetchEventData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getEventById(id);
      setEvent(data);
      if (data.ticketTiers?.length > 0) {
        const availableTiers = data.ticketTiers.filter((t) => t.available > 0);
        setSelectedTierName(
          availableTiers.length > 0
            ? availableTiers[0].name
            : data.ticketTiers[0].name,
        );
      }
    } catch (error) {
      toast.error("Unable to load event details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  const handleAction = (type) => {
    if (!selectedTierName) return toast.error("Select a ticket tier.");
    const selectedTier = event.ticketTiers.find(
      (t) => t.name === selectedTierName,
    );
    const itemData = {
      eventId: event.id,
      eventTitle: event.title,
      venue: event.venue,
      date: event.date,
      tierName: selectedTier.name,
      price: selectedTier.price,
      quantity: 1,
      imageUrl: event.imageUrl || fallbackImage,
    };

    if (type === "BUY_NOW") {
      setIsRedirecting(true);
      navigate("/checkout/payment", { state: { directPurchase: itemData } });
    } else {
      addToCart(itemData);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a]">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
      </div>
    );

  return (
    <div className="h-screen bg-[#0f172a] text-white overflow-hidden p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-7xl mx-auto h-full flex flex-col"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-all font-black uppercase text-xs tracking-widest group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
            Back
          </button>
          <div className="flex items-center gap-2 bg-indigo-600/20 px-4 py-2 rounded-full border border-indigo-500/30">
            <Tag className="w-3 h-3 text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-tighter">
              {event.category}
            </span>
          </div>
        </div>

        {/* MAIN SPLIT CONTENT */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden mb-4">
          {/* LEFT: VISUAL & DESCRIPTION (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6 overflow-hidden">
            {/* Visual Hero */}
            <div className="relative h-2/3 shrink-0 rounded-[2.5rem] overflow-hidden group shadow-2xl">
              <img
                src={event.imageUrl || fallbackImage}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                alt=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none mb-2">
                  {event.title}
                </h1>
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <Calendar className="w-4 h-4 text-indigo-500" />{" "}
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <MapPin className="w-4 h-4 text-indigo-500" /> {event.venue}
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Description */}
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar bg-slate-800/30 rounded-[2rem] p-6 border border-slate-700/50">
              <p className="text-slate-300 text-lg leading-relaxed font-medium">
                {event.description}
              </p>
            </div>
          </div>

          {/* RIGHT: TICKET PANEL (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col bg-[#1e293b] rounded-[3rem] border border-slate-700/50 shadow-2xl overflow-hidden">
            <div className="p-8 flex flex-col h-full">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-black uppercase tracking-widest">
                  Tickets
                </h3>
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <Users size={14} /> {event.availableTickets} left
                </div>
              </div>

              {/* TIER LISTING - Scrollable if many tiers */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {event.ticketTiers.map((tier) => (
                  <button
                    key={tier.name}
                    onClick={() => setSelectedTierName(tier.name)}
                    disabled={tier.available === 0}
                    className={`w-full p-5 rounded-2xl transition-all border-2 text-left flex justify-between items-center group relative overflow-hidden ${
                      selectedTierName === tier.name
                        ? "bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-500/20"
                        : "bg-slate-800/50 border-transparent hover:border-slate-600"
                    } ${tier.available === 0 ? "opacity-30 cursor-not-allowed" : "active:scale-[0.98]"}`}
                  >
                    <div className="relative z-10">
                      <p
                        className={`font-black uppercase tracking-wider ${selectedTierName === tier.name ? "text-white" : "text-slate-400"}`}
                      >
                        {tier.name}
                      </p>
                      <p
                        className={`text-[10px] font-bold ${selectedTierName === tier.name ? "text-indigo-200" : "text-slate-500"}`}
                      >
                        {tier.available > 0
                          ? `${tier.available} Available`
                          : "Sold Out"}
                      </p>
                    </div>
                    <div className="text-right relative z-10">
                      <p className="text-2xl font-black tracking-tighter">
                        KES {tier.price.toLocaleString()}
                      </p>
                    </div>
                    {selectedTierName === tier.name && (
                      <motion.div
                        layoutId="activeTier"
                        className="absolute inset-0 bg-indigo-600"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* ACTION AREA */}
              <div className="pt-8 mt-6 border-t border-slate-700/50 space-y-4">
                <button
                  onClick={() => handleAction("BUY_NOW")}
                  disabled={isRedirecting || event.availableTickets === 0}
                  className="w-full py-5 bg-white text-indigo-600 font-black text-xl rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-indigo-50 active:scale-95 disabled:opacity-50"
                >
                  {isRedirecting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <CreditCard /> Checkout Now
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleAction("RESERVE")}
                  disabled={event.availableTickets === 0}
                  className="w-full py-5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <p className="text-[10px] text-center font-bold text-slate-500 uppercase tracking-[0.2em]">
                  Secure Checkout Powered by Festix
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CUSTOM CSS FOR CLEAN SCROLLBARS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `,
        }}
      />
    </div>
  );
};

export default EventDetails;
