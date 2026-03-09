import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Required for sending/receiving HTTP-Only Cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle global errors like expired tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logic for session expiration
      console.warn("Unauthorized! Redirecting...");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
