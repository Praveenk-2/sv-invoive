// Define User types based on your UPDATED database structure

export interface User {
  UserId: number;
  Username: string;
  PasswordHash: string;
  Email: string;
  PhoneNumber: string;
  IsActive: boolean;
  CreatedAt: string;
  CreatedBy: number;  // UserId (number)
  ModifiyBy: number;  // UserId (number)
  ModifiyAt: string;
}

export interface CreateUserRequest {
  UserId: number;
  Username: string;
  PasswordHash: string;
  Email: string;
  PhoneNumber: string;
  IsActive: boolean;
  CreatedAt?: string;
  CreatedBy: number;
  ModifiyBy?: number;
  ModifiyAt?: string | null;
}

export interface UpdateUserRequest {
  UserId: number;
  Username: string;
  PasswordHash: string;
  Email: string;
  PhoneNumber: string;
  IsActive: boolean;
  CreatedAt?: string;
  CreatedBy?: number;
  ModifiyBy: number;
  ModifiyAt?: string | null;
}
