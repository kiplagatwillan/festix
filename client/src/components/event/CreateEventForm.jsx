import React, { useState } from "react";
import {
  ImagePlus,
  MapPin,
  Calendar,
  DollarSign,
  Hash,
  Loader2,
} from "lucide-react";

const CreateEventForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    category: "Music",
    price: "",
    totalTickets: "",
    imageUrl: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Event Title
          </label>
          <input
            name="title"
            required
            onChange={handleChange}
            className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            placeholder="Summer Music Festival 2026"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Venue Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              name="venue"
              required
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              placeholder="Main Stadium, NY"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Event Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="datetime-local"
              name="date"
              required
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Ticket Price ($)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="number"
              name="price"
              required
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              placeholder="49.99"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Total Tickets
          </label>
          <div className="relative">
            <Hash className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="number"
              name="totalTickets"
              required
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              placeholder="500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
          Image URL
        </label>
        <div className="relative">
          <ImagePlus className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            name="imageUrl"
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            placeholder="https://unsplash.com/..."
          />
        </div>
      </div>

      <button
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all flex justify-center items-center shadow-lg shadow-indigo-500/20 uppercase tracking-widest"
      >
        {loading ? <Loader2 className="animate-spin mr-2" /> : "Launch Event"}
      </button>
    </form>
  );
};

export default CreateEventForm;
