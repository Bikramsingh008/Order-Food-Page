// src/utils/api.js
// Smart resilient backend URL resolver for local dev & single-link cloud deployment

export const getBackendUrl = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL;

  // Detect if running in live browser production (e.g. Render, Vercel, Netlify)
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    // If VITE_BACKEND_URL is explicitly set to a live remote domain (https://...), use it
    if (
      envUrl &&
      envUrl.startsWith("http") &&
      !envUrl.includes("localhost") &&
      !envUrl.includes("127.0.0.1")
    ) {
      return envUrl.replace(/['"]/g, "").replace(/\/+$/, "");
    }
    // For single-link Express hosting, seamlessly fallback to current website origin
    return window.location.origin;
  }

  // Local development fallback
  if (envUrl && envUrl.trim() !== "") {
    return envUrl.replace(/['"]/g, "").replace(/\/+$/, "");
  }

  return "http://localhost:4000";
};

export const API_URL = `${getBackendUrl()}/api`;
