// Define Role types based on your ACTUAL API structure

export interface Role {
  RoleId: number;
  RoleName: string;
  CreatedBy: number;  // Changed to number
  CreatedAt: string;
  ModifiyBy: number;  // Changed to number
  ModifiyAt: string;
}

export interface CreateRoleRequest {
    RoleId: number;
    RoleName: string;
    CreatedBy: number;  // Changed to number (UserId)
    CreatedAt?: string;
    ModifiyBy?: number;  // Changed to number (UserId)
    ModifiyAt?: string;
}

export interface UpdateRoleRequest {
    RoleId: number;
    RoleName: string;
    CreatedBy?: number;  // Changed to number (UserId)
    CreatedAt?: string;
    ModifiyBy: number;  // Changed to number (UserId)
    ModifiyAt?: string;
}
