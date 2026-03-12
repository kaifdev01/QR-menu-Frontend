import axios from 'axios';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://qr-menu-backend-blond.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const restaurantAPI = {
  // Get all restaurants
  getAll: () => api.get('/restaurants'),

  // Get restaurant by ID
  getById: (id) => api.get(`/restaurants/${id}`),

  // Create new restaurant
  create: (data) => api.post('/restaurants', data),

  // Update restaurant
  update: (id, data) => api.put(`/restaurants/${id}`, data),

  // Delete restaurant
  delete: (id) => api.delete(`/restaurants/${id}`),

  // Add menu item
  addMenuItem: (id, menuItem) => api.post(`/restaurants/${id}/menu`, menuItem),
};

export default api;