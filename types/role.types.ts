// types/role.types.ts
// Define Role types based on your exact API structure

export interface Role {
  RoleId: number;
  RoleName: string;
}

export interface CreateRoleRequest {
  RoleId: number;
  RoleName: string;
}

export interface UpdateRoleRequest {
  RoleId: number;
  RoleName: string;
}