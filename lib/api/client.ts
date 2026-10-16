import axios from 'axios';
import { getToken } from '@/lib/utils/auth';
import { useAuthStore } from '@/lib/store/authStore';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Routes that don't require auth — a 401 while on one of these
// should NOT bounce the visitor to /login, since they're allowed
// to be there without a session (e.g. the landing page itself may
// still trigger a background API call that comes back 401).
const PUBLIC_PATHS = ['/', '/login', '/signup'];

// Response interceptor: handle 401 (unauthenticated)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Use the store's logout method to clear both localStorage AND cookie
      const logout = useAuthStore.getState().logout;
      logout();

      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const isPublicPath = PUBLIC_PATHS.includes(currentPath);

        if (!isPublicPath) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;