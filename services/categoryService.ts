// services/categoryService.ts
// All Category API operations
import axiosInstance from '@/lib/axios/axiosInstance';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category.types';

export const categoryService = {
  // GET: Fetch all categories
  // Endpoint: GET /api/ItemCatagory
  getAllCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get<Category[]>('/ItemCatagory');
    return response.data;
  },

  // POST: Create new category
  // Endpoint: POST /api/ItemCatagory
  createCategory: async (categoryData: CreateCategoryRequest): Promise<Category> => {
    // Convert PascalCase to camelCase for API
    const payload = {
      categoryId: categoryData.CategoryId,
      categoryName: categoryData.CategoryName,
      description: categoryData.Description,
      isActive: categoryData.IsActive,
      createdAt: categoryData.CreatedAt || new Date().toISOString(),
      createdBy: categoryData.CreatedBy,
      modifiyBy: categoryData.ModifiyBy || 0,
      modifiyAt: new Date().toISOString()
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.post<Category>('/ItemCatagory', payload);
    return response.data;
  },

  // PUT: Update category
  // Endpoint: PUT /api/ItemCatagory/{id}
  updateCategory: async (id: number, categoryData: UpdateCategoryRequest): Promise<Category> => {
    // Convert PascalCase to camelCase for API
    const payload = {
      categoryId: categoryData.CategoryId,
      categoryName: categoryData.CategoryName,
      description: categoryData.Description,
      isActive: categoryData.IsActive,
      createdAt: categoryData.CreatedAt,
      createdBy: categoryData.CreatedBy,
      modifiyBy: categoryData.ModifiyBy,
      modifiyAt: new Date().toISOString()
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.put<Category>(`/ItemCatagory/${id}`, payload);
    return response.data;
  },

  // DELETE: Delete category
  // Endpoint: DELETE /api/ItemCatagory/{id}
  deleteCategory: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/ItemCatagory/${id}`);
  },
};