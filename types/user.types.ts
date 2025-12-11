// Define User types based on your database structure

export interface User {
  UserId: number;
  Username: string;
  PasswordHash: string;
  Email: string;
  IsActive: boolean;
  CreatedAt: string;
}

export interface CreateUserRequest {
  UserId: number;
  Username: string;
  PasswordHash: string;
  Email: string;
  IsActive: boolean;
  CreatedAt?: string;
}

export interface UpdateUserRequest {
  UserId: number;
  Username: string;
  PasswordHash: string;
  Email: string;
  IsActive: boolean;
  CreatedAt?: string;
}
