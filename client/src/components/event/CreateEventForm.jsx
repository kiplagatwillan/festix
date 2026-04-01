import React, { useState } from "react";
import {
  Sparkles,
  Calendar,
  MapPin,
  Tag,
  Upload,
  Plus,
  Trash2,
  Wand2,
  Loader2,
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

const CreateEventForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  // Initial State for resetting
  const initialFormState = {
    title: "",
    description: "",
    venue: "",
    date: "",
    category: "Music",
    imageUrl: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [ticketTiers, setTicketTiers] = useState([
    { name: "Regular", price: "", capacity: "" },
  ]);

  // ✅ HELPER: RESET ALL FIELDS
  const resetForm = () => {
    setFormData(initialFormState);
    setTicketTiers([{ name: "Regular", price: "", capacity: "" }]);
    // Clear any file inputs if necessary (handled by React state here)
  };

  /* =====================================================
     AI SENSATIONAL DESCRIPTION GENERATOR
  ===================================================== */
  const handleGenerateAI = () => {
    if (!formData.title || !formData.venue) {
      return toast.error("Enter Title & Venue first to inspire the AI!");
    }

    setGeneratingAI(true);

    setTimeout(() => {
      const adjectives = [
        "Electrifying",
        "Soul-stirring",
        "Unmissable",
        "Mind-bending",
        "Legendary",
      ];
      const hooks = [
        "Prepare to have your senses ignited.",
        "A night where memories are forged in gold.",
        "The event the whole city has been whispering about.",
        "Experience pure magic under the lights.",
      ];

      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const hook = hooks[Math.floor(Math.random() * hooks.length)];

      const aiDescription = `${hook} Join us for the most ${adj} ${formData.category} of the year: ${formData.title}.\n\nTaking place at the iconic ${formData.venue}, this isn't just an event—it's a cultural movement. Secure your spot now and be part of history!`;

      setFormData((prev) => ({ ...prev, description: aiDescription }));
      setGeneratingAI(false);
      toast.success("✨ Sensational description ready!");
    }, 1200);
  };

  /* =====================================================
     IMAGE HANDLING (BASE64)
  ===================================================== */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      return toast.error("Image too heavy! Keep it under 3MB.");
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

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
      return toast.error("Must have at least one ticket type");
    setTicketTiers(ticketTiers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl)
      return toast.error("A world-class event needs a cover image!");

    setLoading(true);
    try {
      const payload = {
        ...formData,
        ticketTiers,
        totalTickets: ticketTiers.reduce(
          (sum, t) => sum + parseInt(t.capacity || 0),
          0,
        ),
      };

      await createEvent(payload);
      toast.success("🚀 Event Published Successfully!");

      // ✅ THE FIX: CLEAR EVERYTHING AFTER SUCCESS
      resetForm();

      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-10 p-2">
      {/* SECTION 1: CORE INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputField
          label="Event Title"
          icon={<Sparkles />}
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Neon Nights Festival"
          required
        />
        <SelectField
          label="Category"
          icon={<Tag />}
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categories}
        />
        <InputField
          label="Venue"
          icon={<MapPin />}
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          placeholder="The Grand Arena"
          required
        />
        <InputField
          label="Date & Time"
          icon={<Calendar />}
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      {/* SECTION 2: TICKETING */}
      <div className="bg-slate-50 dark:bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-xl text-slate-900 dark:text-white">
            Ticket Management
          </h3>
          <button
            type="button"
            onClick={addTier}
            className="flex items-center gap-2 text-indigo-600 font-bold text-sm bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-100 hover:scale-105 transition-transform"
          >
            <Plus size={16} /> Add Tier
          </button>
        </div>
        <div className="space-y-4">
          {ticketTiers.map((tier, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700"
            >
              <div className="md:col-span-5">
                <InputField
                  label="Tier Name"
                  value={tier.name}
                  onChange={(e) =>
                    handleTierChange(index, "name", e.target.value)
                  }
                />
              </div>
              <div className="md:col-span-3">
                <InputField
                  label="Price (KES)"
                  type="number"
                  value={tier.price}
                  onChange={(e) =>
                    handleTierChange(index, "price", e.target.value)
                  }
                />
              </div>
              <div className="md:col-span-3">
                <InputField
                  label="Capacity"
                  type="number"
                  value={tier.capacity}
                  onChange={(e) =>
                    handleTierChange(index, "capacity", e.target.value)
                  }
                />
              </div>
              <div className="md:col-span-1 flex items-end justify-center pb-3">
                <button
                  type="button"
                  onClick={() => removeTier(index)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: MEDIA (SECOND LAST) */}
      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
          Event Cover Image
        </label>
        {formData.imageUrl ? (
          <div className="relative h-72 rounded-[3rem] overflow-hidden group shadow-2xl border-4 border-white dark:border-slate-800">
            <img
              src={formData.imageUrl}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Preview"
            />
            <button
              type="button"
              onClick={() => setFormData((p) => ({ ...p, imageUrl: "" }))}
              className="absolute top-6 right-6 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors shadow-xl"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-72 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group">
            <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-3xl mb-4 group-hover:rotate-12 transition-transform">
              <Upload size={36} />
            </div>
            <p className="font-black text-slate-700 dark:text-slate-200">
              Upload Visual Identity
            </p>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        )}
      </div>

      {/* SECTION 4: DESCRIPTION (LAST) */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-2">
          <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
            The Narrative
          </label>
          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={generatingAI}
            className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-full hover:bg-indigo-100 transition-all active:scale-95"
          >
            {generatingAI ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Wand2 size={14} />
            )}
            {generatingAI ? "AI Crafting..." : "Sensationalize with AI"}
          </button>
        </div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="6"
          className="w-full p-8 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800 focus:border-indigo-500 focus:ring-8 focus:ring-indigo-50 outline-none transition-all font-medium text-lg leading-relaxed shadow-inner placeholder:text-slate-300"
          placeholder="Describe the soul of your event..."
        />
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-6 bg-indigo-600 text-white font-black text-2xl rounded-[2.5rem] hover:bg-indigo-700 disabled:opacity-50 shadow-2xl shadow-indigo-500/20 transition-all active:scale-[0.98] mt-10"
      >
        {loading ? "Igniting the Servers..." : "Launch This Event"}
      </button>
    </form>
  );
};

/* --- SHARED INPUT COMPONENTS --- */
const InputField = ({ label, icon, type = "text", ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
      {label}
    </label>
    <div className="relative group">
      {icon && (
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
          {icon}
        </div>
      )}
      <input
        type={type}
        {...props}
        // ✅ High visibility text (text-slate-900) and sharp contrast
        className={`w-full ${icon ? "pl-14" : "pl-6"} pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-300`}
      />
    </div>
  </div>
);

const SelectField = ({ label, icon, options, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
        {icon}
      </div>
      <select
        {...props}
        className="w-full pl-14 pr-10 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none appearance-none font-bold text-slate-900 dark:text-white"
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
