import axios from "axios";

// Prefer Vite proxy (`/api`) in local dev so auth cookies stay same-origin.
const baseURL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";
    const err = new Error(message);
    err.status = error.response?.status;
    err.errors = error.response?.data?.errors || [];
    err.data = error.response?.data;
    return Promise.reject(err);
  }
);

export default api;
