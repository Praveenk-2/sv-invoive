// services/roleService.ts
import axiosInstance from '@/lib/axios/axiosInstance';
import { Role, CreateRoleRequest, UpdateRoleRequest } from '@/types/role.types';

export const roleService = {
  getAllRoles: async (): Promise<Role[]> => {
    const response = await axiosInstance.get<Role[]>('/Roles');
    return response.data;
  },

  getRoleById: async (roleId: number): Promise<Role> => {
    const response = await axiosInstance.get<Role>(`/Roles/${roleId}`);
    return response.data;
  },

  createRole: async (roleData: CreateRoleRequest): Promise<Role> => {
    // Convert PascalCase to camelCase for API
    const payload = {
      roleId: roleData.RoleId,
      roleName: roleData.RoleName,
      createdBy: roleData.CreatedBy,
      createdAt: roleData.CreatedAt || new Date().toISOString(),
      modifiyBy: roleData.ModifiyBy || 0,
      modifiyAt: roleData.ModifiyAt || null
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.post<Role>('/Roles', payload);
    return response.data;
  },

  updateRole: async (id: number, roleData: UpdateRoleRequest): Promise<Role> => {
    // Convert PascalCase to camelCase for API
    const payload = {
      roleId: roleData.RoleId,
      roleName: roleData.RoleName,
      createdBy: roleData.CreatedBy,
      createdAt: roleData.CreatedAt,
      modifiyBy: roleData.ModifiyBy,
      modifiyAt: roleData.ModifiyAt || new Date().toISOString()
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.put<Role>(`/Roles/${id}`, payload);
    return response.data;
  },

  deleteRole: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/Roles/${id}`);
  },
};