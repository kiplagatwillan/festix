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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  // Fetch Event Data
  const fetchEventData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getEventById(id);
      setEvent(data);

      // Auto-select the cheapest available tier
      if (data.ticketTiers?.length > 0) {
        const availableTiers = data.ticketTiers.filter((t) => t.available > 0);
        const tierToSelect =
          availableTiers.length > 0
            ? availableTiers.reduce((prev, curr) =>
                prev.price < curr.price ? prev : curr,
              )
            : data.ticketTiers[0];

        setSelectedTierName(tierToSelect.name);
      }
    } catch (error) {
      toast.error("Unable to load event details. Please try again.");
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  /**
   * ✅ WORLD-CLASS ACTION HANDLER
   * This is the "Bridge" between Event Details, Cart, and Payment.
   */
  const handleAction = (type) => {
    if (!selectedTierName) return toast.error("Please select a ticket tier.");

    const selectedTier = event.ticketTiers.find(
      (t) => t.name === selectedTierName,
    );

    if (!selectedTier || selectedTier.available === 0) {
      return toast.error("This ticket tier is currently unavailable.");
    }

    // Standardized Data Object for both Cart and PaymentPage
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
      // ✅ Direct Sync to PaymentPage
      // Use 'directPurchase' key to match PaymentPage expectations
      navigate("/checkout/payment", { state: { directPurchase: itemData } });
    } else {
      // ✅ Direct Sync to CartContext
      addToCart(itemData);
      // Toast notification is already handled inside CartContext for consistency
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-slate-500 font-bold">Loading Event Magic...</p>
        </motion.div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <h2 className="text-3xl font-black text-slate-900 mb-2">
          Event Not Found
        </h2>
        <p className="text-slate-500 mb-6">
          The event you are looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg"
        >
          Browse Other Events
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 py-10 min-h-screen"
    >
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all font-bold group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Browse
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT COLUMN: VISUALS & CONTENT */}
        <div className="lg:col-span-8 space-y-8">
          <div className="relative group overflow-hidden rounded-[3rem] shadow-2xl">
            <img
              src={event.imageUrl || fallbackImage}
              alt={event.title}
              className="w-full h-[550px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-8 left-8">
              <span className="bg-white/95 backdrop-blur-md text-indigo-700 px-6 py-2 rounded-2xl font-black shadow-xl flex items-center gap-2 capitalize">
                <Tag className="w-4 h-4" /> {event.category}
              </span>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100">
            <h1 className="text-5xl font-black text-slate-900 leading-tight mb-8">
              {event.title}
            </h1>
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-indigo-600">
                <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
                <h3 className="text-xl font-black uppercase tracking-widest">
                  Description
                </h3>
              </div>
              <p className="text-slate-600 text-xl leading-relaxed whitespace-pre-wrap font-medium">
                {event.description}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BOOKING PANEL */}
        <div className="lg:col-span-4">
          <div className="sticky top-10 space-y-6">
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 space-y-8">
              {/* Event Quick Info */}
              <div className="space-y-4">
                <InfoRow
                  icon={<Calendar className="w-5 h-5" />}
                  label="Date & Time"
                  value={new Date(event.date).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                />
                <InfoRow
                  icon={<MapPin className="w-5 h-5" />}
                  label="Venue"
                  value={event.venue}
                />
                <InfoRow
                  icon={<Users className="w-5 h-5" />}
                  label="Availability"
                  value={`${event.availableTickets} tickets remaining`}
                />
              </div>

              {/* Tier Selection */}
              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                  Choose Your Experience
                </h4>
                <div className="space-y-3">
                  {event.ticketTiers.map((tier) => (
                    <button
                      key={tier.name}
                      onClick={() => setSelectedTierName(tier.name)}
                      disabled={tier.available === 0}
                      className={`w-full p-5 rounded-2xl font-bold transition-all border-2 text-left flex justify-between items-center group ${
                        selectedTierName === tier.name
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100"
                          : "bg-white border-slate-100 text-slate-600 hover:border-indigo-200"
                      } ${tier.available === 0 ? "opacity-40 grayscale cursor-not-allowed" : "active:scale-95"}`}
                    >
                      <span className="flex flex-col">
                        {tier.name}
                        {tier.available < 10 && tier.available > 0 && (
                          <span className="text-[10px] font-medium opacity-80 uppercase tracking-tighter">
                            Only {tier.available} left!
                          </span>
                        )}
                      </span>
                      <span
                        className={`text-lg font-black ${selectedTierName === tier.name ? "text-white" : "text-slate-900"}`}
                      >
                        KES {tier.price.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Master Buttons */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={() => handleAction("BUY_NOW")}
                  disabled={isRedirecting || event.availableTickets === 0}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl rounded-[2rem] shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                >
                  {isRedirecting ? (
                    <Loader2 className="animate-spin w-6 h-6" />
                  ) : (
                    <>
                      <CreditCard className="w-6 h-6" /> Buy Now
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleAction("RESERVE")}
                  disabled={event.availableTickets === 0}
                  className="w-full py-5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-lg rounded-[2rem] flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  <ShoppingCart className="w-5 h-5" /> Reserve to Cart
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 grayscale opacity-50">
                <img
                  src="/mpesa-logo.png"
                  alt="M-Pesa"
                  className="h-4"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <span className="text-[10px] font-bold text-slate-400">
                  Secure Payment Processing
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Clean UI Helper Component
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-3xl border border-slate-100/50">
    <div className="bg-white p-3 rounded-2xl shadow-sm text-indigo-600">
      {icon}
    </div>
    <div className="overflow-hidden">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {label}
      </p>
      <p className="font-bold text-slate-800 truncate">{value}</p>
    </div>
  </div>
);

export default EventDetails;
