// src/components/EditEventForm.jsx
import React, { useState, useRef } from "react";

const defaultTiers = [
  { name: "Early", price: 0, available: 0 },
  { name: "Regular", price: 0, available: 0 },
  { name: "VIP", price: 0, available: 0 },
  { name: "VVIP", price: 0, available: 0 },
];

const EditEventForm = ({ event = {}, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: event.title || "",
    description: event.description || "",
    venue: event.venue || "",
    date: event.date || "",
    imageUrl: event.imageUrl || "",
    availableTickets: event.availableTickets || 0,
    ticketTiers: event.ticketTiers || defaultTiers,
  });
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTierChange = (index, field, value) => {
    setFormData((prev) => {
      const tiers = [...prev.ticketTiers];
      tiers[index][field] =
        field === "price" || field === "available" ? Number(value) : value;
      return { ...prev, ticketTiers: tiers };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "ticketTiers") {
        data.append(key, JSON.stringify(value));
      } else {
        data.append(key, value);
      }
    });
    if (file) data.append("image", file);
    onSubmit(event.id, data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-lg space-y-6 border border-slate-200"
    >
      <h2 className="text-2xl font-bold text-slate-900">Edit Event</h2>

      {/* Event Info */}
      <input
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Event Title"
      />
      <textarea
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Event Description"
      />
      <input
        className="w-full p-2 border rounded-lg"
        type="file"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files[0])}
      />
      <input
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        name="venue"
        value={formData.venue}
        onChange={handleChange}
        placeholder="Venue"
      />
      <input
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        placeholder="Event Date"
      />
      <input
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        type="number"
        name="availableTickets"
        value={formData.availableTickets}
        onChange={handleChange}
        placeholder="Total Available Tickets"
      />

      {/* Ticket Tiers */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Ticket Tiers</h3>
        {formData.ticketTiers.map((tier, index) => (
          <div key={tier.name} className="grid grid-cols-3 gap-3 items-center">
            <input
              type="text"
              className="p-2 border rounded-lg"
              value={tier.name}
              onChange={(e) => handleTierChange(index, "name", e.target.value)}
              placeholder="Tier Name"
            />
            <input
              type="number"
              className="p-2 border rounded-lg"
              value={tier.price}
              onChange={(e) => handleTierChange(index, "price", e.target.value)}
              placeholder="Price KES"
            />
            <input
              type="number"
              className="p-2 border rounded-lg"
              value={tier.available}
              onChange={(e) =>
                handleTierChange(index, "available", e.target.value)
              }
              placeholder="Available"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
      >
        {loading ? "Updating..." : "Save Changes"}
      </button>
    </form>
  );
};

export default EditEventForm;
