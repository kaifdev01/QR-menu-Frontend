// API Configuration
const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://qr-menu-backend-blond.vercel.app',
  
  // API Endpoints
  ENDPOINTS: {
    // Auth
    AUTH: {
      SIGNUP: '/api/auth/signup',
      LOGIN: '/api/auth/login',
      VERIFY_OTP: '/api/auth/verify-otp',
      RESEND_OTP: '/api/auth/resend-otp',
      GOOGLE_SIGNIN: '/api/auth/google-signin',
    },
    
    // User
    USER: {
      UPDATE_PROFILE: '/api/user/update-profile',
      CHANGE_PASSWORD: '/api/user/change-password',
      DELETE_ACCOUNT: '/api/user/delete-account',
    },
    
    // Restaurant
    RESTAURANT: {
      SETUP: '/api/restaurant/setup',
      INFO: '/api/restaurant/info',
    },
    
    // Subscription
    SUBSCRIPTION: {
      SELECT_PLAN: '/api/subscription/select-plan',
      DETAILS: '/api/subscription/details',
    },
    
    // Menu
    MENU: {
      CREATE: '/api/menu/create',
      LIST: '/api/menu/list',
      GET: (id) => `/api/menu/${id}`,
      UPDATE: (id) => `/api/menu/${id}`,
      DELETE: (id) => `/api/menu/${id}`,
      ADD_ITEM: (id) => `/api/menu/${id}/items`,
      UPDATE_ITEM: (itemId) => `/api/menu/items/${itemId}`,
      DELETE_ITEM: (itemId) => `/api/menu/items/${itemId}`,
      BULK_ADD: (id) => `/api/menu/${id}/bulk-add`,
      BULK_DELETE: '/api/menu/bulk-delete',
      DUPLICATE: (id) => `/api/menu/${id}/duplicate`,
      PUBLIC: (uniqueUrl) => `/api/public/menu/${uniqueUrl}`,
    },
    
    // Upload
    UPLOAD: {
      IMAGE: '/api/upload/upload',
    },
  },
};

// Helper function to build full URL
export const buildUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function for authenticated requests
export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(buildUrl(endpoint), config);
  return response;
};

export default API_CONFIG;
