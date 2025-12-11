// All Item API operations
import axiosInstance from '@/lib/axios/axiosInstance';
import { Item, CreateItemRequest, UpdateItemRequest } from '@/types/item.types';

export const itemService = {
  // GET: Fetch all items
  // Endpoint: GET /api/Item
  getAllItems: async (): Promise<Item[]> => {
    const response = await axiosInstance.get<Item[]>('/Item');
    return response.data;
  },

  // GET: Fetch single item by ID (if endpoint exists)
  getItemById: async (itemId: number): Promise<Item> => {
    const response = await axiosInstance.get<Item>(`/Item/${itemId}`);
    return response.data;
  },

  // POST: Create new item
  // Endpoint: POST /api/Item
  createItem: async (itemData: CreateItemRequest): Promise<Item> => {
    const response = await axiosInstance.post<Item>('/Item', itemData);
    return response.data;
  },

  // PUT: Update item
  // Endpoint: PUT /api/Item/{id}
  updateItem: async (id: number, itemData: UpdateItemRequest): Promise<Item> => {
    const response = await axiosInstance.put<Item>(`/Item/${id}`, itemData);
    return response.data;
  },

  // DELETE: Delete item
  // Endpoint: DELETE /api/Item/{id}
  deleteItem: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/Item/${id}`);
  },
};