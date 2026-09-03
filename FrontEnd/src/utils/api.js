// src/utils/api.js
const backendBase = (import.meta.env.VITE_BACKEND_URL || "http://localhost:4000").replace(/['"]/g, "").replace(/\/+$/, "");
export const API_URL = `${backendBase}/api`;
