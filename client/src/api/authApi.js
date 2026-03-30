import axios from "axios";

// Change this to the base API URL so it works for events AND auth
const API_URL = "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("festix_token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const registerUser = async (userData) => {
  const { data } = await API.post("/auth/register", userData); // added /auth/
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await API.post("/auth/login", credentials); // added /auth/
  return data;
};

export const getProfile = async () => {
  const { data } = await API.get("/auth/profile"); // added /auth/
  return data;
};

// CRITICAL FIX: Add this line at the very bottom
export default API;
