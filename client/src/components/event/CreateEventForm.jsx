import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Calendar,
  MapPin,
  Tag,
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

const CreateEventForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
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
    return formData.imageUrl || fallbackImage;
  }, [file, formData.imageUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTierChange = (index, field, value) => {
    const updated = [...ticketTiers];
    updated[index][field] = value;
    setTicketTiers(updated);
  };

  const addTier = () =>
    setTicketTiers([...ticketTiers, { name: "", price: "", capacity: "" }]);

  const removeTier = (index) => {
    if (ticketTiers.length === 1)
      return toast.error("At least one tier required");
    setTicketTiers(ticketTiers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();

      // 1. Append standard fields
      Object.entries(formData).forEach(([key, value]) =>
        payload.append(key, value),
      );

      // 2. Calculate and append totalTickets (Backwards compatibility)
      const total = ticketTiers.reduce(
        (sum, t) => sum + parseInt(t.capacity || 0),
        0,
      );
      payload.append("totalTickets", total);

      // 3. IMPORTANT: Stringify the array for FormData transfer
      payload.append("ticketTiers", JSON.stringify(ticketTiers));

      // 4. Append File
      if (file) payload.append("image", file);

      await createEvent(payload);
      toast.success("🎉 Event Published!");
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || "Creation failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAI = () => {
    if (!formData.title) return toast.error("Enter a title first!");
    setGeneratingAI(true);
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        description: `Join us for ${prev.title} at ${prev.venue || "our premium venue"}! An incredible ${prev.category} experience you won't want to miss.`,
      }));
      setGeneratingAI(false);
      toast.success("AI Content Ready!");
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Event Title"
          icon={<Sparkles className="w-4 h-4" />}
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <SelectField
          label="Category"
          icon={<Tag className="w-4 h-4" />}
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categories}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Venue"
          icon={<MapPin className="w-4 h-4" />}
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          required
        />
        <InputField
          label="Date & Time"
          icon={<Calendar className="w-4 h-4" />}
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      {/* TICKET TIERS SECTION */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-dashed border-slate-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">
            Ticket Pricing Tiers
          </h3>
          <button
            type="button"
            onClick={addTier}
            className="text-sm flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" /> Add Tier
          </button>
        </div>

        {ticketTiers.map((tier, index) => (
          <div
            key={index}
            className="flex flex-wrap md:flex-nowrap gap-4 mb-4 items-end bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm"
          >
            <div className="flex-1 min-w-[120px]">
              <InputField
                label="Tier Name"
                placeholder="VIP"
                value={tier.name}
                onChange={(e) =>
                  handleTierChange(index, "name", e.target.value)
                }
              />
            </div>
            <div className="w-32">
              <InputField
                label="Price"
                type="number"
                placeholder="0"
                value={tier.price}
                onChange={(e) =>
                  handleTierChange(index, "price", e.target.value)
                }
              />
            </div>
            <div className="w-32">
              <InputField
                label="Capacity"
                type="number"
                placeholder="100"
                value={tier.capacity}
                onChange={(e) =>
                  handleTierChange(index, "capacity", e.target.value)
                }
              />
            </div>
            <button
              type="button"
              onClick={() => removeTier(index)}
              className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* MEDIA SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-4">
          <InputField
            label="Direct Image URL"
            icon={<ImageIcon className="w-4 h-4" />}
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
          <div className="space-y-2">
            <label className="text-sm font-bold">Or Upload Local File</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 cursor-pointer"
            />
          </div>
        </div>
        <div className="h-40 rounded-xl overflow-hidden border-2 border-slate-100 shadow-inner">
          <img
            src={previewImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold">Description</label>
          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={generatingAI}
            className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"
          >
            {generatingAI ? "AI Writing..." : "✨ AI Generate"}
          </button>
        </div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="w-full p-4 rounded-xl border border-slate-200 dark:bg-slate-800"
          placeholder="Tell people about your event..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-200 transition-all"
      >
        {loading ? "Publishing Event..." : "Publish Event Now"}
      </button>
    </form>
  );
};

// Sub-components for cleaner JSX
const InputField = ({ label, icon, type = "text", ...props }) => (
  <div className="w-full space-y-1.5">
    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        {...props}
        className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
      />
    </div>
  </div>
);

const SelectField = ({ label, icon, options, ...props }) => (
  <div className="w-full space-y-1.5">
    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </div>
      <select
        {...props}
        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default CreateEventForm;
