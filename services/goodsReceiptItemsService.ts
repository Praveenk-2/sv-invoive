import axiosInstance from '@/lib/axios/axiosInstance';
import { GoodsReceiptItem, CreateGoodsReceiptItemRequest, UpdateGoodsReceiptItemRequest } from '@/types/goodsReceiptItems.types';

export const goodsReceiptItemsService = {
  getAllGoodsReceiptItems: async (): Promise<GoodsReceiptItem[]> => {
    const response = await axiosInstance.get<GoodsReceiptItem[]>('/GoodsReceiptItems');
    return response.data;
  },

  getGoodsReceiptItemById: async (grnItemId: number): Promise<GoodsReceiptItem> => {
    const response = await axiosInstance.get<GoodsReceiptItem>(`/GoodsReceiptItems/${grnItemId}`);
    return response.data;
  },

  createGoodsReceiptItem: async (itemData: CreateGoodsReceiptItemRequest): Promise<GoodsReceiptItem> => {
    const payload = {
      grnItemId: itemData.GRNItemId,
      grnId: itemData.GRNId,
      itemId: itemData.ItemId,
      quantityReceived: itemData.QuantityReceived,
      unitPrice: itemData.UnitPrice,
      batchNo: itemData.BatchNo,
      expiryDate: itemData.ExpiryDate || null
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.post<GoodsReceiptItem>('/GoodsReceiptItems', payload);
    return response.data;
  },

  updateGoodsReceiptItem: async (id: number, itemData: UpdateGoodsReceiptItemRequest): Promise<GoodsReceiptItem> => {
    const payload = {
      grnItemId: itemData.GRNItemId,
      grnId: itemData.GRNId,
      itemId: itemData.ItemId,
      quantityReceived: itemData.QuantityReceived,
      unitPrice: itemData.UnitPrice,
      batchNo: itemData.BatchNo,
      expiryDate: itemData.ExpiryDate || null
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.put<GoodsReceiptItem>(`/GoodsReceiptItems/${id}`, payload);
    return response.data;
  },

  deleteGoodsReceiptItem: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/GoodsReceiptItems/${id}`);
  },
};