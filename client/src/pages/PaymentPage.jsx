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
} from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();

  // ✅ SYNC LOGIC: Check for direct purchase state OR use global cart
  const directOrder = location.state?.directPurchase || null;
  const isCartCheckout = !directOrder && cart.length > 0;

  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Determine final display data
  const checkoutItems = directOrder ? [directOrder] : cart;
  const totalAmount = directOrder
    ? directOrder.price * directOrder.quantity
    : cartTotal;

  // Safety Redirect: If no direct order and cart is empty, go home
  useEffect(() => {
    if (!directOrder && cart.length === 0) {
      toast.error("Your checkout session has expired or cart is empty.");
      navigate("/");
    }
  }, [directOrder, cart, navigate]);

  const handleProcessPayment = async (e) => {
    e.preventDefault();

    if (paymentMethod === "mpesa" && !phoneNumber) {
      return toast.error("Please enter your M-Pesa phone number.");
    }

    setLoading(true);

    try {
      // Simulate M-Pesa STK Push / Card processing delay
      await new Promise((resolve) => setTimeout(resolve, 3500));

      toast.success("Payment Successful! Your tickets are ready.");

      // Clear cart if this was a cart checkout
      if (isCartCheckout) clearCart();

      // Redirect to user tickets
      navigate("/profile/tickets");
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkoutItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all mb-8 font-bold group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Selection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: PAYMENT FORM */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100"
            >
              <header className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
                  Checkout
                </h1>
                <p className="text-slate-500 font-medium">
                  Choose your payment method and complete your purchase.
                </p>
              </header>

              <form onSubmit={handleProcessPayment} className="space-y-8">
                {/* Method Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PaymentTab
                    active={paymentMethod === "mpesa"}
                    onClick={() => setPaymentMethod("mpesa")}
                    icon={<Smartphone />}
                    title="M-Pesa"
                    description="Mobile Money STK"
                  />
                  <PaymentTab
                    active={paymentMethod === "card"}
                    onClick={() => setPaymentMethod("card")}
                    icon={<CreditCard />}
                    title="Card"
                    description="Visa / Mastercard"
                  />
                </div>

                {/* Conditional Inputs */}
                <AnimatePresence mode="wait">
                  {paymentMethod === "mpesa" ? (
                    <motion.div
                      key="mpesa"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-100"
                    >
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
                        M-Pesa Phone Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                          +254
                        </span>
                        <input
                          type="tel"
                          placeholder="712345678"
                          className="w-full p-5 pl-16 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-lg"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2 items-start text-xs text-slate-400 italic">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                        A payment request will be sent directly to this number.
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="card"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="p-10 bg-slate-50 rounded-3xl text-center border-2 border-dashed border-slate-200"
                    >
                      <CreditCard className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                      <p className="text-slate-500 font-bold">
                        Secure Card Checkout coming soon.
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Please use M-Pesa for now.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl rounded-[2rem] shadow-2xl shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <Loader2 className="w-7 h-7 animate-spin" />
                  ) : (
                    <>
                      Complete Payment — KES {totalAmount.toLocaleString()}
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            <div className="flex items-center justify-center gap-3 text-slate-400 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              AES-256 Bit Secure Encryption
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl sticky top-12 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Ticket className="w-32 h-32 rotate-12" />
              </div>

              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                Order Summary
              </h3>

              <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {checkoutItems.map((item, idx) => (
                  <div
                    key={`${item.eventId}-${idx}`}
                    className="flex gap-5 items-center"
                  >
                    <img
                      src={item.imageUrl}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-700 shrink-0"
                      alt={item.eventTitle}
                    />
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-lg truncate">
                        {item.eventTitle}
                      </h4>
                      <p className="text-slate-400 text-sm">
                        {item.tierName} Ticket
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-indigo-400 font-black">
                          Qty: {item.quantity}
                        </span>
                        <span className="font-bold">
                          KES {item.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-slate-800 pt-8">
                <div className="flex justify-between text-slate-400 font-medium">
                  <span>Subtotal</span>
                  <span className="text-white">
                    KES {totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400 font-medium">
                  <span>Processing Fee</span>
                  <span className="text-white">KES 0.00</span>
                </div>

                <div className="flex justify-between items-end pt-6 mt-4 border-t border-slate-800">
                  <div>
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">
                      Total to Pay
                    </p>
                    <span className="text-4xl font-black text-white">
                      KES {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentTab = ({ active, onClick, icon, title, description }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-6 rounded-[2rem] border-2 text-left transition-all flex items-center gap-5 ${
      active
        ? "border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50"
        : "border-slate-100 hover:border-slate-200 bg-white"
    }`}
  >
    <div
      className={`p-3 rounded-2xl ${active ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}
    >
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <p
        className={`font-black text-lg ${active ? "text-slate-900" : "text-slate-600"}`}
      >
        {title}
      </p>
      <p className="text-xs text-slate-400 font-medium">{description}</p>
    </div>
  </button>
);

export default PaymentPage;
