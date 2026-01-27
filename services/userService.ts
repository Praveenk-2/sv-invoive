// services/userService.ts
import axiosInstance from '@/lib/axios/axiosInstance';
import { User, CreateUserRequest, UpdateUserRequest } from '@/types/user.types';

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get<User[]>('/Users');
    return response.data;
  },

  getUserById: async (userId: number): Promise<User> => {
    const response = await axiosInstance.get<User>(`/Users/${userId}`);
    return response.data;
  },

  createUser: async (userData: CreateUserRequest): Promise<User> => {
    // Convert PascalCase to camelCase for API
    const payload = {
      userId: userData.UserId,
      username: userData.Username,
      passwordHash: userData.PasswordHash,
      email: userData.Email,
      phoneNumber: userData.PhoneNumber,
      isActive: userData.IsActive,
      createdAt: userData.CreatedAt || new Date().toISOString(),
      createdBy: userData.CreatedBy,
      modifiyBy: userData.ModifiyBy || 0,
      modifiyAt: userData.ModifiyAt || null
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.post<User>('/Users', payload);
    return response.data;
  },

  updateUser: async (id: number, userData: UpdateUserRequest): Promise<User> => {
    // Convert PascalCase to camelCase for API
    const payload = {
      userId: userData.UserId,
      username: userData.Username,
      passwordHash: userData.PasswordHash,
      email: userData.Email,
      phoneNumber: userData.PhoneNumber,
      isActive: userData.IsActive,
      createdAt: userData.CreatedAt,
      createdBy: userData.CreatedBy,
      modifiyBy: userData.ModifiyBy,
      modifiyAt: userData.ModifiyAt || new Date().toISOString()
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.put<User>(`/Users/${id}`, payload);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/Users/${id}`);
  },
};