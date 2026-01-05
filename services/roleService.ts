// services/roleService.ts
import axiosInstance from '@/lib/axios/axiosInstance';
import { Role, CreateRoleRequest, UpdateRoleRequest } from '@/types/role.types';

export const roleService = {
  // GET all roles
  getAllRoles: async (): Promise<Role[]> => {
    const response = await axiosInstance.get<Role[]>('/Roles');
    return response.data;
  },

  // CREATE role
  createRole: async (roleData: CreateRoleRequest): Promise<Role> => {
    const payload = {
      rolId: roleData.RoleId,
      roleName: roleData.RoleName,
      createdBy: roleData.CreatedBy,
      createdAt: roleData.CreatedAt ?? new Date().toISOString(),
      modifiyBy: 0,
      modifiyAt: null,
    };

    const response = await axiosInstance.post<Role>('/Roles', payload);
    return response.data;
  },

  // UPDATE role
  updateRole: async (id: number, roleData: UpdateRoleRequest): Promise<Role> => {
    const payload = {
      rolId: roleData.RoleId,
      roleName: roleData.RoleName,
      createdBy: roleData.CreatedBy,
      createdAt: roleData.CreatedAt,
      modifiyBy: roleData.ModifiyBy,
      modifiyAt: roleData.ModifiyAt ?? new Date().toISOString(),
    };

    const response = await axiosInstance.put<Role>(`/Roles/${id}`, payload);
    return response.data;
  },

  // DELETE role
  deleteRole: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/Roles/${id}`);
  },
};
