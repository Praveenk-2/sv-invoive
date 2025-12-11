// Define UserRole types based on your database structure

export interface UserRole {
  UserRoleId: number;
  UserId: number;
  RoleId: number;
  // Optional: Include user and role details if API returns them
  Username?: string;
  RoleName?: string;
}

export interface CreateUserRoleRequest {
  UserRoleId: number;
  UserId: number;
  RoleId: number;
}

export interface UpdateUserRoleRequest {
  UserRoleId: number;
  UserId: number;
  RoleId: number;
}
