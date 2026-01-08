import axiosInstance from '@/lib/axios/axiosInstance';
import { PurchaseOrderItem, CreatePurchaseOrderItemRequest, UpdatePurchaseOrderItemRequest } from '@/types/purchaseOrderItems.types';

export const purchaseOrderItemsService = {
  getAllPurchaseOrderItems: async (): Promise<PurchaseOrderItem[]> => {
    const response = await axiosInstance.get<PurchaseOrderItem[]>('/PurchaseOrderItems');
    return response.data;
  },

  getPurchaseOrderItemById: async (poItemId: number): Promise<PurchaseOrderItem> => {
    const response = await axiosInstance.get<PurchaseOrderItem>(`/PurchaseOrderItems/${poItemId}`);
    return response.data;
  },

  createPurchaseOrderItem: async (itemData: CreatePurchaseOrderItemRequest): Promise<PurchaseOrderItem> => {
    const payload = {
      poItemId: itemData.POItemId,
      poId: itemData.POId,
      itemId: itemData.ItemId,
      quantity: itemData.Quantity,
      unitPrice: itemData.UnitPrice,
      total: itemData.Total,
      createdBy: itemData.CreatedBy,
      createdAt: itemData.CreatedAt || new Date().toISOString(),
      modifiyBy: itemData.ModifiyBy || 0,
      modifiyAt: itemData.ModifiyAt || null
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.post<PurchaseOrderItem>('/PurchaseOrderItems', payload);
    return response.data;
  },

  updatePurchaseOrderItem: async (id: number, itemData: UpdatePurchaseOrderItemRequest): Promise<PurchaseOrderItem> => {
    const payload = {
      poItemId: itemData.POItemId,
      poId: itemData.POId,
      itemId: itemData.ItemId,
      quantity: itemData.Quantity,
      unitPrice: itemData.UnitPrice,
      total: itemData.Total,
      createdBy: itemData.CreatedBy,
      createdAt: itemData.CreatedAt,
      modifiyBy: itemData.ModifiyBy,
      modifiyAt: itemData.ModifiyAt || new Date().toISOString()
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.put<PurchaseOrderItem>(`/PurchaseOrderItems/${id}`, payload);
    return response.data;
  },

  deletePurchaseOrderItem: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/PurchaseOrderItems/${id}`);
  },
};