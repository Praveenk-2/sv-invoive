// All User API operations
import axiosInstance from '@/lib/axios/axiosInstance';
import { User, CreateUserRequest, UpdateUserRequest } from '@/types/user.types';

export const userService = {
  // GET: Fetch all users
  // Endpoint: GET /api/Users
  getAllUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get<User[]>('/Users');
    return response.data;
  },

  // GET: Fetch single user by ID
  // Endpoint: GET /api/Users/{userId}
  getUserById: async (userId: number): Promise<User> => {
    const response = await axiosInstance.get<User>(`/Users/${userId}`);
    return response.data;
  },

  // POST: Create new user
  // Endpoint: POST /api/Users
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response = await axiosInstance.post<User>('/Users', userData);
    return response.data;
  },

  // PUT: Update user
  // Endpoint: PUT /api/Users/{id}
  updateUser: async (id: number, userData: UpdateUserRequest): Promise<User> => {
    const response = await axiosInstance.put<User>(`/Users/${id}`, userData);
    return response.data;
  },

  // DELETE: Delete user
  // Endpoint: DELETE /api/Users/{id}
  deleteUser: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/Users/${id}`);
  },
};
