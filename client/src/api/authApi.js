import axiosInstance from "./axiosInstance";

export const loginUser = async (credentials) => {
  const { data } = await axiosInstance.post("/auth/login", credentials);
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await axiosInstance.post("/auth/register", userData);
  return data;
};

export const logoutUser = async () => {
  const { data } = await axiosInstance.post("/auth/logout");
  return data;
};

export const getProfile = async () => {
  const { data } = await axiosInstance.get("/users/profile");
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await axiosInstance.put("/users/profile", profileData);
  return data;
};
