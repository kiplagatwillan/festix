// src/api/axiosInstance.js
import axios from "axios";

const TOKEN_KEY = "festix_token";
const BASE_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/**
 * REQUEST INTERCEPTOR
 * Dynamically retrieves and cleans the token for every outgoing request.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const rawToken = localStorage.getItem(TOKEN_KEY);

    if (rawToken) {
      // ADVANCEMENT: Strip potential quotes added by JSON.stringify
      // and ensure there are no leading/trailing spaces.
      const cleanToken = rawToken.replace(/^"(.*)"$/, "$1").trim();

      config.headers.Authorization = `Bearer ${cleanToken}`;

      // Optional Debugging (Comment out in production)
      // console.log(`[Axios] Request to ${config.url} authorized.`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * RESPONSE INTERCEPTOR
 * Handles global error states like 401 (Unauthorized) or 403 (Forbidden).
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      // ADVANCEMENT: Handle expired or invalid tokens globally
      console.warn("Unauthorized access - clearing token and redirecting...");
      localStorage.removeItem(TOKEN_KEY);

      // Only redirect if we are not already on the login page to avoid loops
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    if (error.response) {
      // Improved error logging for debugging 500 errors
      console.error(
        `[API Error ${status}]:`,
        error.response.data?.message || "An internal server error occurred.",
      );
    } else if (error.request) {
      console.error(
        "[API Error]: No response received from server. Check if backend is running.",
      );
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
