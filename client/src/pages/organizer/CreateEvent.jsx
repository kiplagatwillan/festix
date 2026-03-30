import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../api/eventApi";
import CreateEventForm from "../../components/event/CreateEventForm";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const CreateEvent = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    setLoading(true);

    // High-end payload sanitization
    const eventPayload = {
      ...formData,
      title: formData.title?.trim(),
      description: formData.description?.trim(), // Backend will handle fallback if empty
      venue: formData.venue?.trim(),
      date: formData.date ? new Date(formData.date).toISOString() : null,
      price: Number(formData.price) || 0,
      totalTickets: Number(formData.totalTickets) || 0,
    };

    if (
      !eventPayload.title ||
      !eventPayload.venue ||
      !eventPayload.date ||
      !eventPayload.totalTickets
    ) {
      toast.error("Required: Title, Venue, Date, and Tickets.");
      setLoading(false);
      return;
    }

    try {
      await createEvent(eventPayload);
      toast.success("Event Published Successfully!");
      navigate("/organizer/my-events");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to launch event";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-all mb-8 font-semibold group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      <div className="flex items-center gap-4 mb-10">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-xl shadow-indigo-100">
          <Sparkles className="text-white w-7 h-7" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Launch Event
          </h1>
          <p className="text-slate-500 font-medium">
            Use AI to craft the perfect event experience.
          </p>
        </div>
      </div>

      <CreateEventForm onSubmit={handleCreate} loading={loading} />
    </motion.div>
  );
};

export default CreateEvent;
