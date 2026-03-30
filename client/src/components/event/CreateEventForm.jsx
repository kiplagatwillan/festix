import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Calendar,
  MapPin,
  Tag,
  Users,
  DollarSign,
  ImageIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { createEvent } from "../../api/eventApi";
import { toast } from "react-hot-toast";

const categories = [
  "Music",
  "Workshop",
  "Conference",
  "Sport",
  "Comedy",
  "Festival",
  "General",
];

const fallbackImage =
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80";

const CreateEventForm = ({ onSuccess, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    category: "Music",
    imageUrl: "",
  });

  const [ticketTiers, setTicketTiers] = useState([
    { name: "Regular", price: "", capacity: "" },
  ]);

  const [file, setFile] = useState(null);
  const [generatingAI, setGeneratingAI] = useState(false);

  const previewImage = useMemo(() => {
    if (file) return URL.createObjectURL(file);
    if (formData.imageUrl)
      return `${formData.imageUrl}?t=${new Date().getTime()}`;
    return fallbackImage;
  }, [file, formData.imageUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      toast.success("Image selected!");
    }
  };

  const handleGenerateAI = () => {
    if (!formData.title || !formData.venue) {
      toast.error("Enter title & venue first!");
      return;
    }
    setGeneratingAI(true);
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        description: `Experience the ultimate ${prev.category} event: ${prev.title}!

Join us at ${prev.venue} for an unforgettable experience filled with energy, networking, and world-class moments.

🎟 Limited tickets available — secure your spot early!`,
      }));
      setGeneratingAI(false);
      toast.success("AI description generated!");
    }, 1200);
  };

  const validateForm = () => {
    if (!formData.title.trim()) return "Event title is required";
    if (!formData.venue.trim()) return "Venue is required";
    if (!formData.date) return "Date is required";

    for (const tier of ticketTiers) {
      if (!tier.name.trim()) return "Ticket tier name is required";
      if (!tier.price || tier.price <= 0) return "Enter valid ticket price";
      if (!tier.capacity || tier.capacity <= 0)
        return "Enter valid ticket capacity";
    }

    return null;
  };

  const handleTierChange = (index, field, value) => {
    const updated = [...ticketTiers];
    updated[index][field] = value;
    setTicketTiers(updated);
  };

  const addTier = () => {
    setTicketTiers([...ticketTiers, { name: "", price: "", capacity: "" }]);
  };

  const removeTier = (index) => {
    if (ticketTiers.length === 1)
      return toast.error("At least one ticket tier required");
    const updated = [...ticketTiers];
    updated.splice(index, 1);
    setTicketTiers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) return toast.error(error);

    try {
      let payload;
      if (file) {
        payload = new FormData();
        Object.entries(formData).forEach(([key, value]) =>
          payload.append(key, value),
        );
        payload.append("ticketTiers", JSON.stringify(ticketTiers));
        payload.append("image", file);
      } else {
        payload = { ...formData, ticketTiers };
      }

      await createEvent(payload);
      toast.success("🎉 Event Published Successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("❌ createEvent Error:", err);
      toast.error("Event creation failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      {/* TITLE */}
      <InputField
        label="Event Title"
        icon={<Sparkles />}
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="e.g. Summer Jazz Night"
        required
      />

      {/* CATEGORY */}
      <SelectField
        label="Category"
        icon={<Tag />}
        name="category"
        value={formData.category}
        onChange={handleChange}
        options={categories}
      />

      {/* VENUE */}
      <InputField
        label="Venue"
        icon={<MapPin />}
        name="venue"
        value={formData.venue}
        onChange={handleChange}
        placeholder="Full Address or Venue Name"
        required
      />

      {/* DATE */}
      <InputField
        label="Event Date"
        icon={<Calendar />}
        type="datetime-local"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      {/* DYNAMIC TICKET TIERS */}
      <div className="space-y-4">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
          Ticket Tiers
        </label>
        {ticketTiers.map((tier, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 items-end">
            <InputField
              label="Tier Name"
              name={`tier-name-${index}`}
              value={tier.name}
              onChange={(e) => handleTierChange(index, "name", e.target.value)}
            />
            <InputField
              label="Price (USD)"
              type="number"
              name={`tier-price-${index}`}
              value={tier.price}
              onChange={(e) => handleTierChange(index, "price", e.target.value)}
            />
            <InputField
              label="Capacity"
              type="number"
              name={`tier-capacity-${index}`}
              value={tier.capacity}
              onChange={(e) =>
                handleTierChange(index, "capacity", e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => removeTier(index)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              <Trash2 />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addTier}
          className="flex items-center gap-1 text-indigo-600 font-bold hover:text-indigo-800"
        >
          <Plus className="w-4 h-4" /> Add Ticket Tier
        </button>
      </div>

      {/* IMAGE URL */}
      <InputField
        label="Image URL (Optional)"
        icon={<ImageIcon />}
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
        placeholder="Paste image URL..."
      />

      {/* FILE UPLOAD */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
          Upload Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>

      {/* IMAGE PREVIEW */}
      <div className="rounded-2xl overflow-hidden border h-52">
        <img
          src={previewImage}
          alt="Preview"
          onError={(e) => (e.target.src = fallbackImage)}
          className="w-full h-full object-cover"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Description
          </label>
          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={generatingAI}
            className="text-xs flex items-center gap-1.5 font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition disabled:opacity-50"
          >
            <Sparkles className="w-3 h-3" />
            {generatingAI ? "AI Writing..." : "Generate with AI"}
          </button>
        </div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          placeholder="Describe your event..."
          className="w-full p-4 rounded-xl border border-slate-200 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl transition disabled:opacity-50"
      >
        {loading ? "Publishing..." : "Publish Event"}
      </button>
    </form>
  );
};

/* =============================
   Input & Select Components
============================= */
const InputField = ({ label, icon, type = "text", ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        {...props}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500"
      />
      {icon && (
        <span className="absolute left-3 top-3.5 text-slate-400">{icon}</span>
      )}
    </div>
  </div>
);

const SelectField = ({ label, icon, options, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
      {label}
    </label>
    <div className="relative">
      <select
        {...props}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {icon && (
        <span className="absolute left-3 top-3.5 text-slate-400">{icon}</span>
      )}
    </div>
  </div>
);

export default CreateEventForm;
