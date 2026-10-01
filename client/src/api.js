import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

const langParams = (lang) => lang === 'sw' ? { params: { lang: 'sw' } } : undefined;

export const getDepartments = (lang) => api.get('/departments', langParams(lang)).then((r) => r.data);
export const getOffices = (lang) => api.get('/offices', langParams(lang)).then((r) => r.data);
export const getOffice = (id, lang) => api.get(`/offices/${id}`, langParams(lang)).then((r) => r.data);
export const getServices = (lang) => api.get('/services', langParams(lang)).then((r) => r.data);
export const getService = (id, lang) => api.get(`/services/${id}`, langParams(lang)).then((r) => r.data);
export const search = (q, lang) => api.get('/search', { params: { q, ...(lang === 'sw' ? { lang: 'sw' } : {}) } }).then((r) => r.data);
export const getAnnouncements = (lang) => api.get('/announcements', langParams(lang)).then((r) => r.data);

export default api;