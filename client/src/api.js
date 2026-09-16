import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const getDepartments = () => api.get('/departments').then((r) => r.data);
export const getOffices = () => api.get('/offices').then((r) => r.data);
export const getOffice = (id) => api.get(`/offices/${id}`).then((r) => r.data);
export const getServices = () => api.get('/services').then((r) => r.data);
export const getService = (id) => api.get(`/services/${id}`).then((r) => r.data);
export const search = (q) => api.get('/search', { params: { q } }).then((r) => r.data);
export const getAnnouncements = () => api.get('/announcements').then((r) => r.data);

export default api;
