import axiosInstance from "./axiosInstance";

export const getAdminAnalytics = async () => {
  const { data } = await axiosInstance.get("/analytics/admin");
  return data;
};

export const getOrganizerAnalytics = async () => {
  const { data } = await axiosInstance.get("/analytics/organizer");
  return data;
};

export const getAllUsers = async () => {
  const { data } = await axiosInstance.get("/users");
  return data;
};
