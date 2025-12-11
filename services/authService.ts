// services/authService.ts
// All authentication related API calls
import axiosInstance from '@/lib/axios/axiosInstance';
import { LoginRequest, LoginResponse } from '@/types/auth.types';

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      '/Login/login',
      credentials
    );
    return response.data;
  },

  // Logout user (if you have logout endpoint)
  logout: async (): Promise<void> => {
    // Call logout endpoint if exists
    // await axiosInstance.post('/Login/logout');
    
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Get current user (if you have endpoint)
  getCurrentUser: async () => {
    const response = await axiosInstance.get('/Login/me');
    return response.data;
  },

  // Refresh token (if you have endpoint)
  refreshToken: async (refreshToken: string) => {
    const response = await axiosInstance.post('/Login/refresh', {
      refreshToken,
    });
    return response.data;
  },
};