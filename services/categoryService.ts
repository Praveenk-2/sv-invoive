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
  // Endpoint: POST /Post (based on your screenshot)
  createCategory: async (categoryData: CreateCategoryRequest): Promise<Category> => {
    const response = await axiosInstance.post<Category>('/Post', categoryData);
    return response.data;
  },

  // PUT: Update category
  // Endpoint: PUT /api/ItemCatagory/{id}
  updateCategory: async (id: number, categoryData: UpdateCategoryRequest): Promise<Category> => {
    const response = await axiosInstance.put<Category>(`/ItemCatagory/${id}`, categoryData);
    return response.data;
  },

  // DELETE: Delete category
  // Endpoint: DELETE /api/ItemCatagory/{id}
  deleteCategory: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/ItemCatagory/${id}`);
  },
};
