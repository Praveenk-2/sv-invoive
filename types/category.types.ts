// Define Category types based on your UPDATED database structure

export interface Category {
  CategoryId: number;
  CategoryName: string;
  Description: string;
  IsActive: boolean;
  CreatedAt: string;
  CreatedBy: number;  // UserId (number)
  ModifiyBy: number;  // UserId (number)
  ModifiyAt: string;
}

export interface CreateCategoryRequest {
  CategoryId: number;
  CategoryName: string;
  Description: string;
  IsActive: boolean;
  CreatedAt?: string;
  CreatedBy: number;
  ModifiyBy?: number;
  ModifiyAt?: string;
}

export interface UpdateCategoryRequest {
  CategoryId: number;
  CategoryName: string;
  Description: string;
  IsActive: boolean;
  CreatedAt?: string;
  CreatedBy?: number;
  ModifiyBy: number;
  ModifiyAt?: string;
}
