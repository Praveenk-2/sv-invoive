// All Role API operations matching your Swagger documentation
import axiosInstance from '@/lib/axios/axiosInstance';
import { Role, CreateRoleRequest, UpdateRoleRequest } from '@/types/role.types';

export const roleService = {
  // GET: Fetch all roles
  // Endpoint: GET /api/Roles
  getAllRoles: async (): Promise<Role[]> => {
    const response = await axiosInstance.get<Role[]>('/Roles');
    return response.data;
  },

  // POST: Create new role
  // Endpoint: POST /api/Roles
  // Body: { RoleId: number, RoleName: string }
  createRole: async (roleData: CreateRoleRequest): Promise<Role> => {
    const response = await axiosInstance.post<Role>('/Roles', roleData);
    return response.data;
  },

  // PUT: Update role
  // Endpoint: PUT /api/Roles/{id}
  // Body: { RoleId: number, RoleName: string }
  updateRole: async (id: number, roleData: UpdateRoleRequest): Promise<Role> => {
    const response = await axiosInstance.put<Role>(`/Roles/${id}`, roleData);
    return response.data;
  },

  // DELETE: Delete role
  // Endpoint: DELETE /api/Roles/{id}
  deleteRole: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/Roles/${id}`);
  },
};