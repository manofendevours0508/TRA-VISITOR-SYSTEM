import axios from 'axios';
import { API_BASE_URL } from '../apiBase';

const staffApi = axios.create({ baseURL: API_BASE_URL });

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
