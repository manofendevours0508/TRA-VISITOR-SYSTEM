// In local dev this stays '/api' and Vite's proxy (vite.config.js) forwards
// it to the local server. In production (e.g. a Render Static Site) there is
// no dev proxy, so VITE_API_URL must be set at build time to the deployed
// backend's URL, e.g. https://tra-direct-api.onrender.com/api
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
