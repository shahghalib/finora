import apiClient from './client';
import { useAuthStore } from '@/lib/store/authStore';

export interface SignupData {
  username: string;
  email: string;
  password: string;
  defaultCurrency: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const signup = async (data: SignupData) => {
  const response = await apiClient.post('/auth/signup', data);
  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
};

export const getProfile = async (token?: string) => {
  const response = await apiClient.get('/users/me', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return response.data;
};

export const useAuthActions = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  const handleLogin = async (email: string, password: string) => {
    const { access_token } = await login({ email, password });
    const user = await getProfile(access_token);
    setAuth(access_token, user);
    return { success: true };
  };

  const handleSignup = async (data: SignupData) => {
    const { access_token } = await signup(data);
    const user = await getProfile(access_token);
    setAuth(access_token, user);
    return { success: true };
  };

  return { handleLogin, handleSignup, logout };
};
