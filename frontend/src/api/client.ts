import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// İstek öncesi JWT Token ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bm_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Yanıt hatalarını yakala
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Admin rotalarında oturum sona erdiğinde
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/giris')) {
        localStorage.removeItem('bm_auth_token');
        localStorage.removeItem('bm_auth_user');
        window.location.href = '/admin/giris';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
