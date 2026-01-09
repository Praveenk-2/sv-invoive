// types/role.types.ts
// Define Role types based on your database structure

export interface Role {
  RoleId: number;
  RoleName: string;
  CreatedBy: number;
  CreatedAt: string;
  ModifiyBy: number;
  ModifiyAt: string;
}

export interface CreateRoleRequest {
  RoleId: number;
  RoleName: string;
  CreatedBy: number;
  CreatedAt?: string;
  ModifiyBy?: number;
  ModifiyAt?: string | null;
}

export interface UpdateRoleRequest {
  RoleId: number;
  RoleName: string;
  CreatedBy?: number;
  CreatedAt?: string;
  ModifiyBy: number;
  ModifiyAt?: string | null;
}