import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const eventTypeApi = {
  getAll: () => api.get('/event-types'),
  getBySlug: (slug) => api.get(`/event-types/${slug}`),
  create: (data) => api.post('/event-types', data),
  update: (id, data) => api.put(`/event-types/${id}`, data),
  delete: (id) => api.delete(`/event-types/${id}`),
};

export const availabilityApi = {
  get: () => api.get('/availability'),
  updateBulk: (slots) => api.post('/availability/bulk', { slots }),
};

export const meetingApi = {
  getUpcoming: () => api.get('/meetings?type=upcoming'),
  getPast: () => api.get('/meetings?type=past'),
  cancel: (id) => api.patch(`/meetings/${id}/cancel`),
  book: (data) => api.post('/meetings', data),
  getSlots: (date, eventTypeSlug) => api.get('/meetings/slots', { params: { date, eventTypeSlug } }),
};

export default api;
