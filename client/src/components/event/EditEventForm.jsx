// src/components/EditEventForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

const EditEventForm = ({ event, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    category: "General",
    imageUrl: "",
    ticketTiers: [],
  });

  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  // ✅ THE FIX: Hydrate the form state whenever the 'event' prop changes
  useEffect(() => {
    if (event && Object.keys(event).length > 0) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        venue: event.venue || "",
        // Format date for <input type="datetime-local" /> or "date"
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
        category: event.category || "General",
        imageUrl: event.imageUrl || "",
        // Ensure tiers exist or fall back to an empty array
        ticketTiers: event.ticketTiers || [],
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTierChange = (index, field, value) => {
    const updatedTiers = [...formData.ticketTiers];
    updatedTiers[index] = {
      ...updatedTiers[index],
      [field]: field === "name" ? value : Number(value),
    };
    setFormData((prev) => ({ ...prev, ticketTiers: updatedTiers }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.venue || !formData.date) {
      return toast.error("Please fill in all required fields.");
    }

    const data = new FormData();

    // Append standard fields
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("venue", formData.venue);
    data.append("date", formData.date);
    data.append("category", formData.category);

    // IMPORTANT: Stringify tiers so the backend can parse them correctly
    data.append("ticketTiers", JSON.stringify(formData.ticketTiers));

    if (file) {
      data.append("image", file);
    } else {
      data.append("imageUrl", formData.imageUrl);
    }

    // Call the onSubmit function passed from the parent (MyEvents.jsx)
    onSubmit(event.id, data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-xl space-y-6 border border-slate-200 dark:border-slate-800"
    >
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Edit Event Details
        </h2>
        <span className="text-xs font-mono bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
          ID: {event?.id?.slice(0, 8)}...
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Event Title
            </label>
            <input
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-800"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Kalee Night"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Venue</label>
            <input
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-800"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="Location name"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Date & Time
            </label>
            <input
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-800"
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Event Banner
            </label>
            <input
              className="w-full p-2 border rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700"
              type="file"
              ref={fileInputRef}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Description</label>
        <textarea
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-800"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          placeholder="What is this event about?"
        />
      </div>

      {/* Ticket Tiers Section */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-4">
        <h3 className="text-md font-bold text-slate-800 dark:text-slate-200">
          Pricing & Capacity
        </h3>
        {formData.ticketTiers.length > 0 ? (
          formData.ticketTiers.map((tier, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
            >
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">
                  Tier
                </label>
                <input
                  type="text"
                  className="w-full p-1 border-b focus:border-indigo-500 outline-none dark:bg-transparent"
                  value={tier.name}
                  onChange={(e) =>
                    handleTierChange(index, "name", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">
                  Price (KES)
                </label>
                <input
                  type="number"
                  className="w-full p-1 border-b focus:border-indigo-500 outline-none dark:bg-transparent"
                  value={tier.price}
                  onChange={(e) =>
                    handleTierChange(index, "price", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">
                  Total Capacity
                </label>
                <input
                  type="number"
                  className="w-full p-1 border-b focus:border-indigo-500 outline-none dark:bg-transparent"
                  value={tier.capacity || tier.available} // Matches backend 'capacity'
                  onChange={(e) =>
                    handleTierChange(index, "capacity", e.target.value)
                  }
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500 italic text-center">
            No ticket tiers found for this event.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-50"
      >
        {loading ? "Saving Changes..." : "Update Event Now"}
      </button>
    </form>
  );
};

export default EditEventForm;
