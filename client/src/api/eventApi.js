import axiosInstance from "./axiosInstance";

export const fetchEvents = async (params = {}) => {
  // params can include search, category, minPrice, etc.
  const { data } = await axiosInstance.get("/events", { params });
  return data;
};

export const fetchEventById = async (id) => {
  const { data } = await axiosInstance.get(`/events/${id}`);
  return data;
};

export const createEvent = async (eventData) => {
  const { data } = await axiosInstance.post("/events", eventData);
  return data;
};

export const updateEvent = async (id, eventData) => {
  const { data } = await axiosInstance.put(`/events/${id}`, eventData);
  return data;
};

export const deleteEvent = async (id) => {
  const { data } = await axiosInstance.delete(`/events/${id}`);
  return data;
};
