// Define Category types based on your database structure

export interface Category {
  CategoryId: number;
  CategoryName: string;
  Description: string;
  IsActive: boolean;
  CreatedAt: string;
}

export interface CreateCategoryRequest {
  CategoryId: number;
  CategoryName: string;
  Description: string;
  IsActive: boolean;
  CreatedAt?: string;
}

export interface UpdateCategoryRequest {
  CategoryId: number;
  CategoryName: string;
  Description: string;
  IsActive: boolean;
  CreatedAt?: string;
}