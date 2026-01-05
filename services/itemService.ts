// All Item API operations
import axiosInstance from '@/lib/axios/axiosInstance';
import { Item, CreateItemRequest, UpdateItemRequest } from '@/types/item.types';

export const itemService = {
  // GET: Fetch all items
  getAllItems: async (): Promise<Item[]> => {
    const response = await axiosInstance.get<Item[]>('/Item');
    return response.data;
  },

  // GET: Fetch single item by ID
  getItemById: async (itemId: number): Promise<Item> => {
    const response = await axiosInstance.get<Item>(`/Item/${itemId}`);
    return response.data;
  },

  // ✅ POST: Create new item (PascalCase → camelCase here)
  createItem: async (itemData: CreateItemRequest): Promise<Item> => {
    const payload = {
      itemId: itemData.ItemId,
      itemName: itemData.ItemName,
      categoryId: itemData.CategoryId,
      unitId: itemData.UnitId,
      sku: itemData.SKU,
      barcode: itemData.Barcode,
      description: itemData.Description,
      unitPrice: itemData.UnitPrice,
      reorderLevel: itemData.ReorderLevel,
      isActive: itemData.IsActive,
      createdAt: itemData.CreatedAt ?? new Date().toISOString(),
      createdBy: itemData.CreatedBy,
      modifiyBy: itemData.ModifiyBy ?? 0,
      modifiyAt: itemData.ModifiyAt || new Date().toISOString(),
    };

    const response = await axiosInstance.post<Item>('/Item', payload);
    return response.data;
  },

  // ✅ PUT: Update item (PascalCase → camelCase here)
  updateItem: async (id: number, itemData: UpdateItemRequest): Promise<Item> => {
    const payload = {
      itemId: itemData.ItemId,
      itemName: itemData.ItemName,
      categoryId: itemData.CategoryId,
      unitId: itemData.UnitId,
      sku: itemData.SKU,
      barcode: itemData.Barcode,
      description: itemData.Description,
      unitPrice: itemData.UnitPrice,
      reorderLevel: itemData.ReorderLevel,
      isActive: itemData.IsActive,
      createdAt: itemData.CreatedAt,
      createdBy: itemData.CreatedBy,
      modifiyBy: itemData.ModifiyBy,
      modifiyAt: itemData.ModifiyAt ?? new Date().toISOString(),
    };

    const response = await axiosInstance.put<Item>(`/Item/${id}`, payload);
    return response.data;
  },

  // DELETE: Delete item
  deleteItem: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/Item/${id}`);
  },
};