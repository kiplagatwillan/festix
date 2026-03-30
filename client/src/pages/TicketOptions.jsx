// src/pages/organizer/TicketOptions.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Zap } from "lucide-react";
import { getEventById } from "../api/eventApi"; // ✅ FIXED IMPORT
import toast from "react-hot-toast";

const TicketOptions = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedTier, setSelectedTier] = useState(null);
  const [quantity, setQuantity] = useState(1);

  /* =====================================================
     FETCH EVENT
  ===================================================== */
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);

        const data = await getEventById(eventId);

        setEvent(data);

        if (!data?.ticketTiers || data.ticketTiers.length === 0) {
          toast.error("No ticket tiers available for this event");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load ticket options");
        navigate("/"); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, navigate]);

  /* =====================================================
     HANDLE PROCEED
  ===================================================== */
  const handleProceed = (type) => {
    if (!selectedTier) {
      toast.error("Please select a ticket type");
      return;
    }

    const orderData = {
      eventId,
      tierId: selectedTier.id,
      tierName: selectedTier.name,
      quantity,
      totalPrice: selectedTier.price * quantity,
    };

    if (type === "BUY_NOW") {
      navigate("/checkout/payment", { state: { orderData } });
    } else {
      console.log("Added to cart:", orderData);
      toast.success("Ticket reserved (cart coming soon)");
    }
  };

  /* =====================================================
     LOADING STATE
  ===================================================== */
  if (loading) {
    return (
      <div className="p-20 text-center text-gray-500">
        Loading ticket options...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-20 text-center">
        <p className="text-red-500">Event not found</p>
      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Ticket Selection */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-black dark:text-white">
            Select Your Tickets
          </h1>

          {event.ticketTiers?.length > 0 ? (
            <div className="space-y-4">
              {event.ticketTiers.map((tier) => (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier)}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedTier?.id === tier.id
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20"
                      : "border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold dark:text-white">
                        {tier.name}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {tier.description || "Access to event"}
                      </p>

                      <div className="mt-3 text-xs font-medium uppercase tracking-wider">
                        <span className="text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                          {tier.available || "Limited"} left
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-black text-indigo-600">
                        KES {tier.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">No ticket tiers available</p>
          )}
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-xl">
            <h2 className="text-xl font-bold mb-6 dark:text-white">
              Order Summary
            </h2>

            {selectedTier ? (
              <div className="space-y-4">
                {/* Quantity */}
                <div className="flex items-center justify-between">
                  <span className="text-sm">Quantity</span>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Number(e.target.value)))
                    }
                    className="w-20 p-2 border rounded"
                  />
                </div>

                {/* Price */}
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>
                    {selectedTier.name} x {quantity}
                  </span>
                  <span>KES {selectedTier.price * quantity}</span>
                </div>

                {/* Total */}
                <div className="pt-4 border-t flex justify-between font-black text-xl dark:text-white">
                  <span>Total</span>
                  <span>KES {selectedTier.price * quantity}</span>
                </div>

                {/* Buttons */}
                <div className="pt-6 space-y-3">
                  <button
                    onClick={() => handleProceed("BUY_NOW")}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition"
                  >
                    <Zap size={18} /> Buy Now
                  </button>

                  <button
                    onClick={() => handleProceed("CART")}
                    className="w-full bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition"
                  >
                    <ShoppingCart size={18} /> Reserve
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-10 italic">
                Select a ticket type to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketOptions;
