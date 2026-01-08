import axiosInstance from '@/lib/axios/axiosInstance';
import { ItemBatch, CreateItemBatchRequest, UpdateItemBatchRequest } from '@/types/itemBatches.types';

export const itemBatchesService = {
  getAllItemBatches: async (): Promise<ItemBatch[]> => {
    const response = await axiosInstance.get<ItemBatch[]>('/ItemBatches');
    return response.data;
  },

  getItemBatchById: async (batchId: number): Promise<ItemBatch> => {
    const response = await axiosInstance.get<ItemBatch>(`/ItemBatches/${batchId}`);
    return response.data;
  },

  createItemBatch: async (batchData: CreateItemBatchRequest): Promise<ItemBatch> => {
    const payload = {
      batchId: batchData.BatchId,
      itemId: batchData.ItemId,
      batchNo: batchData.BatchNo,
      quantity: batchData.Quantity,
      expiryDate: batchData.ExpiryDate || null,
      createdBy: batchData.CreatedBy,
      createdAt: batchData.CreatedAt || new Date().toISOString(),
      modifiyBy: batchData.ModifiyBy || 0,
      modifiyAt: batchData.ModifiyAt || null
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.post<ItemBatch>('/ItemBatches', payload);
    return response.data;
  },

  updateItemBatch: async (id: number, batchData: UpdateItemBatchRequest): Promise<ItemBatch> => {
    const payload = {
      batchId: batchData.BatchId,
      itemId: batchData.ItemId,
      batchNo: batchData.BatchNo,
      quantity: batchData.Quantity,
      expiryDate: batchData.ExpiryDate || null,
      createdBy: batchData.CreatedBy,
      createdAt: batchData.CreatedAt,
      modifiyBy: batchData.ModifiyBy,
      modifiyAt: batchData.ModifiyAt || new Date().toISOString()
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.put<ItemBatch>(`/ItemBatches/${id}`, payload);
    return response.data;
  },

  deleteItemBatch: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/ItemBatches/${id}`);
  },
};