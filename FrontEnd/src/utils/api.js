// src/utils/api.js
const backendBase = import.meta.env.VITE_BACKEND_URL || "";
export const API_URL = backendBase ? `${backendBase.replace(/\/+$/, "")}/api` : "/api";
