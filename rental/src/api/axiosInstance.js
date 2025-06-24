import axios from "axios";
import { toast } from "react-toastify"; // Optional: for user notifications

const api = axios.create({
  baseURL: "http://localhost:8000/", // Django backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token from localStorage on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized globally (token expiration, invalid token, etc)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401) {
      // Clear stored tokens to force re-login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Optional: notify user about session expiration
      toast.error("Session expired. Please login again.");

      // Redirect user to login page (uncomment if you want auto redirect)
      // window.location.href = "/login";

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);



export default api;
