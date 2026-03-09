import React, { useState } from "react";

const EditEventForm = ({ event, onSubmit, loading }) => {
  const [formData, setFormData] = useState({ ...event });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="space-y-4"
    >
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="w-full p-4 bg-gray-100 dark:bg-gray-900 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 dark:text-white font-bold"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows="4"
        className="w-full p-4 bg-gray-100 dark:bg-gray-900 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
      />
      <button className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-all">
        {loading ? "Updating..." : "Save Changes"}
      </button>
    </form>
  );
};

export default EditEventForm;
