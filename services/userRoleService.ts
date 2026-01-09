// services/userRoleService.ts
import axiosInstance from '@/lib/axios/axiosInstance';
import { UserRole, CreateUserRoleRequest, UpdateUserRoleRequest } from '@/types/userRole.types';

export const userRoleService = {
  getAllUserRoles: async (): Promise<UserRole[]> => {
    const response = await axiosInstance.get<UserRole[]>('/UserRoles');
    return response.data;
  },

  getUserRoleById: async (userRoleId: number): Promise<UserRole> => {
    const response = await axiosInstance.get<UserRole>(`/UserRoles/${userRoleId}`);
    return response.data;
  },

  createUserRole: async (userRoleData: CreateUserRoleRequest): Promise<UserRole> => {
    // Convert PascalCase to camelCase for API
    const payload = {
      userRoleId: userRoleData.UserRoleId,
      userId: userRoleData.UserId,
      roleId: userRoleData.RoleId,
      createdBy: userRoleData.CreatedBy,
      createdAt: userRoleData.CreatedAt || new Date().toISOString(),
      modifiyBy: userRoleData.ModifiyBy || 0,
      modifiyAt: userRoleData.ModifiyAt || null
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.post<UserRole>('/UserRoles', payload);
    return response.data;
  },

  updateUserRole: async (id: number, userRoleData: UpdateUserRoleRequest): Promise<UserRole> => {
    // Convert PascalCase to camelCase for API
    const payload = {
      userRoleId: userRoleData.UserRoleId,
      userId: userRoleData.UserId,
      roleId: userRoleData.RoleId,
      createdBy: userRoleData.CreatedBy,
      createdAt: userRoleData.CreatedAt,
      modifiyBy: userRoleData.ModifiyBy,
      modifiyAt: userRoleData.ModifiyAt || new Date().toISOString()
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.put<UserRole>(`/UserRoles/${id}`, payload);
    return response.data;
  },

  deleteUserRole: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/UserRoles/${id}`);
  },
};