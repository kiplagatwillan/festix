import React, { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { createCheckoutSession } from "../../api/paymentApi";
import { toast } from "react-hot-toast";

const StripeCheckout = ({ eventId, price }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { url } = await createCheckoutSession(eventId);
      // Redirect to Stripe's secure hosted checkout page
      window.location.href = url;
    } catch (error) {
      toast.error(
        error.message || "Payment initiation failed. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-500/20 flex justify-center items-center transition-all group"
    >
      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
      ) : (
        <>
          <CreditCard className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          Secure Checkout — ${price}
        </>
      )}
    </button>
  );
};

export default StripeCheckout;
