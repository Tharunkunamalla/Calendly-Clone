import axios from "axios";

const normalizeApiBaseUrl = (value) => {
  if (!value) {
    return import.meta.env.DEV ? "http://localhost:5000/api" : "/api";
  }

  const trimmed = value.trim().replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (email, password) => api.post("/auth/login", {email, password}),
};

export const eventTypeApi = {
  getAll: () => api.get("/event-types"),
  getBySlug: (slug) => api.get(`/event-types/${slug}`),
  create: (data) => api.post("/event-types", data),
  update: (id, data) => api.put(`/event-types/${id}`, data),
  delete: (id) => api.delete(`/event-types/${id}`),
};

export const availabilityApi = {
  get: () => api.get("/availability"),
  updateBulk: (slots) => api.post("/availability/bulk", {slots}),
};

export const meetingApi = {
  getUpcoming: () => api.get("/meetings?type=upcoming"),
  getPast: () => api.get("/meetings?type=past"),
  cancel: (id) => api.patch(`/meetings/${id}/cancel`),
  book: (data) => api.post("/meetings", data),
  getSlots: (date, eventTypeSlug) =>
    api.get("/meetings/slots", {params: {date, eventTypeSlug}}),
};

export const contactsApi = {
  getAll: () => api.get("/contacts"),
};

export default api;
