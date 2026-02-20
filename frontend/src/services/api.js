import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication Services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Vending Machine Services
export const vendingService = {
  getAll: () => api.get('/vending-machines'),
  getById: (id) => api.get(`/vending-machines/${id}`),
  create: (data) => api.post('/vending-machines', data),
  transaction: (id, data) => api.post(`/vending-machines/${id}/transaction`, data),
  refill: (id, data) => api.post(`/vending-machines/${id}/refill`, data),
  updateStatus: (id, data) => api.patch(`/vending-machines/${id}/status`, data),
  getStats: (id) => api.get(`/vending-machines/${id}/stats`),
};

// Washroom Services
export const washroomService = {
  getAll: () => api.get('/washrooms'),
  getById: (id) => api.get(`/washrooms/${id}`),
  create: (data) => api.post('/washrooms', data),
  recordCleaning: (id, data) => api.post(`/washrooms/${id}/cleaning`, data),
  updateStatus: (id, data) => api.patch(`/washrooms/${id}/status`, data),
  getStats: (id) => api.get(`/washrooms/${id}/stats`),
};

// Analytics Services
export const analyticsService = {
  getDashboard: () => api.get('/analytics/dashboard'),
};

// Health Check
export const healthService = {
  check: () => api.get('/health'),
  getPublicStats: () => api.get('/stats/public'),
};

export default api;