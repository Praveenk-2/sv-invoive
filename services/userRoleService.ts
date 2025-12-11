// All UserRole API operations
import axiosInstance from '@/lib/axios/axiosInstance';
import { UserRole, CreateUserRoleRequest, UpdateUserRoleRequest } from '@/types/userRole.types';

export const userRoleService = {
  // GET: Fetch all user roles
  // Endpoint: GET /api/UserRoles
  getAllUserRoles: async (): Promise<UserRole[]> => {
    const response = await axiosInstance.get<UserRole[]>('/UserRoles');
    return response.data;
  },

  // POST: Create new user role assignment
  // Endpoint: POST /api/UserRoles
  createUserRole: async (userRoleData: CreateUserRoleRequest): Promise<UserRole> => {
    const response = await axiosInstance.post<UserRole>('/UserRoles', userRoleData);
    return response.data;
  },

  // PUT: Update user role assignment
  // Endpoint: PUT /api/UserRoles/{id}
  updateUserRole: async (id: number, userRoleData: UpdateUserRoleRequest): Promise<UserRole> => {
    const response = await axiosInstance.put<UserRole>(`/UserRoles/${id}`, userRoleData);
    return response.data;
  },

  // DELETE: Delete user role assignment
  // Endpoint: DELETE /api/UserRoles/{id}
  deleteUserRole: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/UserRoles/${id}`);
  },
};
