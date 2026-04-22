import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
  createAdmin: () => api.post('/auth/create-admin'),
  getUsers: () => api.get('/auth/users'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Booking API endpoints
export const bookingAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getAll: () => api.get('/bookings/all'),
  getUserBookings: () => api.get('/bookings/user'),
  updateStatus: (bookingId, status) => api.put(`/bookings/${bookingId}`, { status }),
  getById: (bookingId) => api.get(`/bookings/${bookingId}`),
  cancel: (bookingId) => api.delete(`/bookings/${bookingId}`),
};

// Service API endpoints
export const serviceAPI = {
  getAll: () => api.get('/services'),
  getById: (serviceId) => api.get(`/services/${serviceId}`),
  getPopular: () => api.get('/services/popular'),
};

// Chat API endpoints
export const chatAPI = {
  getMessages: (bookingId) => api.get(`/chat/${bookingId}`),
  sendMessage: (bookingId, message) => api.post(`/chat/${bookingId}`, message),
  getUnreadCount: () => api.get('/chat/unread'),
  markAsRead: (messageIds) => api.put('/chat/read', { messageIds }),
};

// Translation API endpoints
export const translationAPI = {
  translate: (text, fromLang, toLang) => api.post('/translation/translate', { text, fromLang, toLang }),
  getHistory: () => api.get('/translation/history'),
  startSession: () => api.post('/translation/session'),
  endSession: (sessionId) => api.delete(`/translation/session/${sessionId}`),
};

// Notification API endpoints
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (notificationIds) => api.put('/notifications/read', { notificationIds }),
  getUnreadCount: () => api.get('/notifications/unread'),
};

// File upload API endpoints
export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  uploadDocument: (formData) => api.post('/upload/document', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
};

export default api;
