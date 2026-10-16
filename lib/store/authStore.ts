import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthUser {
  id: number;
  username: string;
  email: string;
  defaultCurrency: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => {
        // Also set a cookie for middleware
        if (typeof document !== 'undefined') {
          document.cookie = `auth-token=${token}; path=/; max-age=604800`; // 7 days
        }
        set({ token, user, isAuthenticated: true });
      },
      logout: () => {
        if (typeof document !== 'undefined') {
          document.cookie = 'auth-token=; path=/; max-age=0';
        }
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    { name: 'auth-storage' }
  )
);