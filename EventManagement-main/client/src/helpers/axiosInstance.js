import axios from "axios";

// Create axios instance
export const axiosInstance = axios.create();

// Add a request interceptor to set the token dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage before each request
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
