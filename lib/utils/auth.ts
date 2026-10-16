export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth-storage') 
    ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token 
    : null;
};

export const removeToken = () => {
  localStorage.removeItem('auth-storage');
};