import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Zap, ArrowLeft, Loader2, Info } from "lucide-react";
import { getEventById } from "../api/eventApi";
import { useCart } from "../context/CartContext"; // ✅ Added Cart Context
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const TicketOptions = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); // ✅ Initialize Cart Hook

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const fallbackImage =
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80";

  /* =====================================================
     FETCH EVENT DATA
  ===================================================== */
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await getEventById(eventId);
        setEvent(data);

        if (data?.ticketTiers?.length > 0) {
          // Auto-select first available tier
          setSelectedTier(data.ticketTiers[0]);
        } else {
          toast.error("No ticket tiers available for this event");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load ticket options");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId, navigate]);

  /* =====================================================
     ✅ CORRECTED HANDLE PROCEED
     Syncs perfectly with CartContext and PaymentPage
  ===================================================== */
  const handleProceed = (type) => {
    if (!selectedTier) {
      toast.error("Please select a ticket type");
      return;
    }

    // Standardized object used across the entire app
    const itemData = {
      eventId: event.id,
      eventTitle: event.title,
      venue: event.venue,
      date: event.date,
      tierName: selectedTier.name,
      price: selectedTier.price,
      quantity: quantity,
      imageUrl: event.imageUrl || fallbackImage,
    };

    if (type === "BUY_NOW") {
      // ✅ FIX: Use 'directPurchase' to match PaymentPage expectations
      navigate("/checkout/payment", {
        state: { directPurchase: itemData },
      });
    } else {
      // ✅ FIX: Actually adds to the global cart
      addToCart(itemData);
      // Toast is handled inside CartContext, but we can add an extra one if desired
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500 font-bold">Fetching the best seats...</p>
      </div>
    );
  }

  if (!event) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 py-12 min-h-screen"
    >
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-4 transition-colors"
          >
            <ArrowLeft size={18} /> Back to Event
          </button>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Select Your Experience
          </h1>
          <p className="text-slate-500 font-medium mt-1">{event.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT: Ticket Tiers */}
        <div className="lg:col-span-7 space-y-4">
          {event.ticketTiers?.map((tier) => (
            <motion.div
              key={tier.name}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedTier(tier)}
              className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer relative overflow-hidden ${
                selectedTier?.name === tier.name
                  ? "border-indigo-600 bg-indigo-50/30 ring-4 ring-indigo-50 dark:bg-indigo-900/10"
                  : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-indigo-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {tier.name}
                    </h3>
                    {tier.available < 10 && (
                      <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-black uppercase">
                        Selling Fast
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-md">
                    {tier.description ||
                      "Standard entry and access to all main event areas."}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-black text-indigo-600">
                    KES {tier.price.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    Per Ticket
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-800 flex gap-4">
            <Info className="text-blue-500 shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              Tickets are digital and will be sent to your email immediately
              after a successful M-Pesa or Card payment.
            </p>
          </div>
        </div>

        {/* RIGHT: Dynamic Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl shadow-indigo-200/20">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              Checkout Summary
            </h2>

            <AnimatePresence mode="wait">
              {selectedTier ? (
                <motion.div
                  key={selectedTier.name}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <span className="text-slate-400 font-bold">Quantity</span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"
                      >
                        -
                      </button>
                      <span className="text-xl font-black">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="flex justify-between text-slate-400 font-medium">
                      <span>{selectedTier.name} Access</span>
                      <span>
                        KES {(selectedTier.price * quantity).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400 font-medium">
                      <span>Service Fee</span>
                      <span>KES 0.00</span>
                    </div>
                    <div className="flex justify-between items-end pt-6">
                      <span className="text-lg font-bold">Total Amount</span>
                      <span className="text-3xl font-black text-indigo-400">
                        KES {(selectedTier.price * quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-8 space-y-3">
                    <button
                      onClick={() => handleProceed("BUY_NOW")}
                      className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
                    >
                      <Zap size={22} fill="currentColor" /> Buy Now
                    </button>

                    <button
                      onClick={() => handleProceed("CART")}
                      className="w-full bg-white/10 text-white py-5 rounded-[2rem] font-bold text-lg flex items-center justify-center gap-3 hover:bg-white/20 transition-all active:scale-95"
                    >
                      <ShoppingCart size={20} /> Add to Cart
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="py-20 text-center text-slate-500 italic">
                  Please select a ticket type to view total.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TicketOptions;
