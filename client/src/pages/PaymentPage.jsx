import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Smartphone,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Loader2,
  Ticket,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();

  const directOrder = location.state?.directPurchase || null;
  const isCartCheckout = !directOrder && cart.length > 0;

  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [status, setStatus] = useState("idle"); // idle | processing | success
  const [phoneNumber, setPhoneNumber] = useState("");

  const checkoutItems = directOrder ? [directOrder] : cart;
  const totalAmount = directOrder
    ? directOrder.price * directOrder.quantity
    : cartTotal;

  useEffect(() => {
    if (!directOrder && cart.length === 0) {
      toast.error("Checkout session expired.");
      navigate("/");
    }
  }, [directOrder, cart, navigate]);

  const handleProcessPayment = async (e) => {
    e.preventDefault();

    if (paymentMethod === "mpesa" && phoneNumber.length < 9) {
      return toast.error("Please enter a valid M-Pesa number.");
    }

    setStatus("processing");

    // ✅ REAL-WORLD FLOW:
    // 1. Send request to backend -> Safaricom API
    // 2. Safaricom sends STK Push to user phone
    // 3. User enters PIN

    try {
      toast.loading("Sending STK Push to your phone...", {
        id: "payment-toast",
      });

      // Simulate the 5-10 second window where a user types their PIN
      await new Promise((resolve) => setTimeout(resolve, 6000));

      toast.success("Payment Verified!", { id: "payment-toast" });
      setStatus("success");

      if (isCartCheckout) clearCart();
    } catch (error) {
      setStatus("idle");
      toast.error("Transaction cancelled or timed out.", {
        id: "payment-toast",
      });
    }
  };

  if (status === "success") {
    return <SuccessScreen navigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: FORM */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100"
            >
              <h1 className="text-4xl font-black text-slate-900 mb-6">
                Checkout
              </h1>

              <form onSubmit={handleProcessPayment} className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <PaymentTab
                    active={paymentMethod === "mpesa"}
                    onClick={() => setPaymentMethod("mpesa")}
                    icon={<Smartphone />}
                    title="M-Pesa"
                  />
                  <PaymentTab
                    active={paymentMethod === "card"}
                    onClick={() => setPaymentMethod("card")}
                    icon={<CreditCard />}
                    title="Card"
                  />
                </div>

                {paymentMethod === "mpesa" ? (
                  <div className="space-y-4 p-8 bg-indigo-50/30 rounded-[2rem] border border-indigo-100">
                    <label className="block text-xs font-black text-indigo-600 uppercase tracking-widest">
                      M-Pesa Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">
                        +254
                      </span>
                      <input
                        type="tel"
                        placeholder="712345678"
                        required
                        // ✅ FIX: High-visibility styling
                        className="w-full p-5 pl-20 bg-white border-2 border-slate-200 rounded-2xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-black text-2xl text-slate-900 placeholder:text-slate-300"
                        value={phoneNumber}
                        onChange={(e) =>
                          setPhoneNumber(e.target.value.replace(/\D/g, ""))
                        }
                      />
                    </div>
                    <p className="text-sm text-slate-500 font-medium italic">
                      Check your phone for the M-Pesa PIN prompt after clicking
                      pay.
                    </p>
                  </div>
                ) : (
                  <div className="p-10 bg-slate-50 rounded-[2rem] text-center border-2 border-dashed border-slate-200 text-slate-400 font-bold">
                    Card Payments Under Maintenance
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "processing"}
                  className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-2xl rounded-[2rem] shadow-2xl shadow-indigo-200 flex items-center justify-center gap-4 disabled:opacity-70"
                >
                  {status === "processing" ? (
                    <>
                      <Loader2 className="animate-spin w-8 h-8" />
                      Awaiting PIN...
                    </>
                  ) : (
                    <>
                      Pay KES {totalAmount.toLocaleString()} <ChevronRight />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl sticky top-12">
              <h3 className="text-xl font-bold mb-8 opacity-60">
                Order Summary
              </h3>
              <div className="space-y-6">
                {checkoutItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <img
                      src={item.imageUrl}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-700"
                      alt=""
                    />
                    <div className="flex-1">
                      <h4 className="font-bold truncate">{item.eventTitle}</h4>
                      <p className="text-xs text-slate-400">
                        {item.tierName} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-black">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
                <div className="pt-6 border-t border-slate-800 flex justify-between items-end">
                  <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                    Total Amount
                  </span>
                  <span className="text-3xl font-black text-indigo-400">
                    KES {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Success Component
const SuccessScreen = ({ navigate }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="min-h-screen flex items-center justify-center bg-white p-6"
  >
    <div className="max-w-md w-full text-center space-y-8">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-50">
        <CheckCircle2 size={48} strokeWidth={3} />
      </div>
      <div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">
          Payment Confirmed!
        </h1>
        <p className="text-slate-500 font-medium">
          Your tickets have been sent to your email. See you at the event!
        </p>
      </div>
      <button
        onClick={() => navigate("/")}
        className="w-full py-5 bg-slate-900 text-white font-black text-lg rounded-[2rem] hover:bg-black transition-all"
      >
        Back to Explore
      </button>
    </div>
  </motion.div>
);

const PaymentTab = ({ active, onClick, icon, title }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${active ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-50" : "border-slate-100 text-slate-400"}`}
  >
    {icon}
    <span className="font-black text-sm uppercase tracking-widest">
      {title}
    </span>
  </button>
);

export default PaymentPage;
