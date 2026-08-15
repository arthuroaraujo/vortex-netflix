import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  const isAuthRoute =
    config.url?.startsWith('/auth/login') ||
    config.url?.startsWith('/auth/register');

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;