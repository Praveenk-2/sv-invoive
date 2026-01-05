// Define UserRole types based on your UPDATED database structure

export interface UserRole {
  UserRoleId: number;
  UserId: number;
  RoleId: number;
  CreatedBy: string;
  CreatedAt: string;
  ModifiyBy: string;
  ModifiyAt: string;
  // Optional: Include user and role details if API returns them
  Username?: string;
  RoleName?: string;
}

export interface CreateUserRoleRequest {
  UserRoleId: number;
  UserId: number;
  RoleId: number;
  CreatedBy: string;
  CreatedAt?: string;
  ModifiyBy?: string;
  ModifiyAt?: string;
}

export interface UpdateUserRoleRequest {
  UserRoleId: number;
  UserId: number;
  RoleId: number;
  CreatedBy?: string;
  CreatedAt?: string;
  ModifiyBy: string;
  ModifiyAt?: string;
}
