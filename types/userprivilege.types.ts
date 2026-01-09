// types/userprivilege.types.ts
// Define UserPrivilegeOn types based on your database structure

export interface UserPrivilege {
  UserId: number;
  ScreenName: string;
  WritePermission: boolean;
  ReadPermission: boolean;
  CreatedBy: number;
  CreatedDate: string;
  ModifiyBy: number;
  ModifiyDate: string;
}

export interface CreateUserPrivilegeRequest {
  UserId: number;
  ScreenName: string;
  WritePermission: boolean;
  ReadPermission: boolean;
  CreatedBy: number;
  CreatedDate?: string;
  ModifiyBy?: number;
  ModifiyDate?: string | null;
}

export interface UpdateUserPrivilegeRequest {
  UserId: number;
  ScreenName: string;
  WritePermission: boolean;
  ReadPermission: boolean;
  CreatedBy?: number;
  CreatedDate?: string;
  ModifiyBy: number;
  ModifiyDate?: string | null;
}