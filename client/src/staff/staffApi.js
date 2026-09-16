import axios from 'axios';

const staffApi = axios.create({ baseURL: '/api' });

export function setAuthToken(token) {
  if (token) {
    staffApi.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete staffApi.defaults.headers.common.Authorization;
  }
}

const stored = localStorage.getItem('tra_token');
if (stored) setAuthToken(stored);

export default staffApi;
