// src/api/eventApi.js
import api from "./axiosInstance";

const RESOURCE = "/events";

/* =====================================================
 FETCH EVENTS
===================================================== */
export const fetchEvents = async (filters = {}) => {
  try {
    const response = await api.get(RESOURCE, {
      params: filters,
    });

    console.log("🔥 API RESPONSE:", response.data); // DEBUG

    return response.data; // ✅ MUST return raw array
  } catch (error) {
    console.error("❌ fetchEvents Error:", error);
    throw error;
  }
};

/* =====================================================
 GET SINGLE EVENT
===================================================== */
export const getEventById = async (id) => {
  if (!id || id === "undefined" || id === "null") return null;

  try {
    const response = await api.get(`${RESOURCE}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ getEventById Error [ID: ${id}]:`, error);
    throw error;
  }
};

/* =====================================================
 CREATE EVENT
===================================================== */
export const createEvent = async (formData) => {
  try {
    const response = await api.post(RESOURCE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ createEvent Error:", error);
    throw error;
  }
};

/* =====================================================
 GET ORGANIZER EVENTS
===================================================== */
export const getOrganizerEvents = async () => {
  try {
    const response = await api.get(`${RESOURCE}/my-events`);
    return response.data;
  } catch (error) {
    console.error("❌ getOrganizerEvents Error:", error);
    throw error;
  }
};

/* =====================================================
 UPDATE EVENT
===================================================== */
export const updateEvent = async (id, formData) => {
  try {
    const isFormData = formData instanceof FormData;

    const response = await api.put(`${RESOURCE}/${id}`, formData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });

    return response.data;
  } catch (error) {
    console.error(`❌ updateEvent Error [ID: ${id}]:`, error);
    throw error;
  }
};

/* =====================================================
 DELETE EVENT
===================================================== */
export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`${RESOURCE}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ deleteEvent Error [ID: ${id}]:`, error);
    throw error;
  }
};

export default {
  fetchEvents,
  getEventById,
  createEvent,
  getOrganizerEvents,
  updateEvent,
  deleteEvent,
};
