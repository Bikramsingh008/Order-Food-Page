// src/utils/api.js
const backendBase = import.meta.env.VITE_BACKEND_URL
  ? import.meta.env.VITE_BACKEND_URL.replace(/['"]/g, "").replace(/\/+$/, "")
  : (import.meta.env.PROD ? "" : "http://localhost:4000");

export const API_URL = `${backendBase}/api`;
