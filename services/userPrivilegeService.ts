// services/userPrivilegeService.ts
import axiosInstance from '@/lib/axios/axiosInstance';
import { UserPrivilege, CreateUserPrivilegeRequest, UpdateUserPrivilegeRequest } from '@/types/userprivilege.types';

export const userPrivilegeService = {
  getAllUserPrivileges: async (): Promise<UserPrivilege[]> => {
    const response = await axiosInstance.get<UserPrivilege[]>('/UserPrivilegeOn');
    return response.data;
  },

  getUserPrivilegeById: async (id: number): Promise<UserPrivilege> => {
    const response = await axiosInstance.get<UserPrivilege>(`/UserPrivilegeOn/${id}`);
    return response.data;
  },

  createUserPrivilege: async (privilegeData: CreateUserPrivilegeRequest): Promise<UserPrivilege> => {
    // Convert PascalCase to camelCase for API
    const payload = {
      userId: privilegeData.UserId,
      screenName: privilegeData.ScreenName,
      writePermission: privilegeData.WritePermission,
      readPermission: privilegeData.ReadPermission,
      createdBy: privilegeData.CreatedBy,
      createdDate: privilegeData.CreatedDate || new Date().toISOString(),
      modifiyBy: privilegeData.ModifiyBy || 0,
      modifiyDate: privilegeData.ModifiyDate || null
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.post<UserPrivilege>('/UserPrivilegeOn', payload);
    return response.data;
  },

  updateUserPrivilege: async (id: number, privilegeData: UpdateUserPrivilegeRequest): Promise<UserPrivilege> => {
    // Convert PascalCase to camelCase for API
    const payload = {
      userId: privilegeData.UserId,
      screenName: privilegeData.ScreenName,
      writePermission: privilegeData.WritePermission,
      readPermission: privilegeData.ReadPermission,
      createdBy: privilegeData.CreatedBy,
      createdDate: privilegeData.CreatedDate,
      modifiyBy: privilegeData.ModifiyBy,
      modifiyDate: privilegeData.ModifiyDate || new Date().toISOString()
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.put<UserPrivilege>(`/UserPrivilegeOn/${id}`, payload);
    return response.data;
  },

  deleteUserPrivilege: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/UserPrivilegeOn/${id}`);
  },
};