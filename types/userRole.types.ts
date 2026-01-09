// types/userrole.types.ts
// Define UserRole types based on your database structure

export interface UserRole {
  UserRoleId: number;
  UserId: number;
  RoleId: number;
  CreatedBy: number;
  CreatedAt: string;
  ModifiyBy: number;
  ModifiyAt: string;
}

export interface CreateUserRoleRequest {
  UserRoleId: number;
  UserId: number;
  RoleId: number;
  CreatedBy: number;
  CreatedAt?: string;
  ModifiyBy?: number;
  ModifiyAt?: string | null;
}

export interface UpdateUserRoleRequest {
  UserRoleId: number;
  UserId: number;
  RoleId: number;
  CreatedBy?: number;
  CreatedAt?: string;
  ModifiyBy: number;
  ModifiyAt?: string | null;
}