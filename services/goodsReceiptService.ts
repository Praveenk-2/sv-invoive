import axiosInstance from '@/lib/axios/axiosInstance';
import { GoodsReceipt, CreateGoodsReceiptRequest, UpdateGoodsReceiptRequest } from '@/types/goodsReceipt.types';

export const goodsReceiptService = {
  getAllGoodsReceipts: async (): Promise<GoodsReceipt[]> => {
    const response = await axiosInstance.get<GoodsReceipt[]>('/GoodsReceipt');
    return response.data;
  },

  getGoodsReceiptById: async (grnId: number): Promise<GoodsReceipt> => {
    const response = await axiosInstance.get<GoodsReceipt>(`/GoodsReceipt/${grnId}`);
    return response.data;
  },

  createGoodsReceipt: async (grnData: CreateGoodsReceiptRequest): Promise<GoodsReceipt> => {
    const payload = {
      grnId: grnData.GRNId,
      grnNumber: grnData.GRNNumber,
      poId: grnData.POId,
      receivedDate: grnData.ReceivedDate || new Date().toISOString(),
      receivedBy: grnData.ReceivedBy,
      status: grnData.Status,
      createdBy: grnData.CreatedBy,
      createdAt: grnData.CreatedAt || new Date().toISOString(),
      modifiyBy: grnData.ModifiyBy || 0,
      modifiyAt: grnData.ModifiyAt || null
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.post<GoodsReceipt>('/GoodsReceipt', payload);
    return response.data;
  },

  updateGoodsReceipt: async (id: number, grnData: UpdateGoodsReceiptRequest): Promise<GoodsReceipt> => {
    const payload = {
      grnId: grnData.GRNId,
      grnNumber: grnData.GRNNumber,
      poId: grnData.POId,
      receivedDate: grnData.ReceivedDate || new Date().toISOString(),
      receivedBy: grnData.ReceivedBy,
      status: grnData.Status,
      createdBy: grnData.CreatedBy,
      createdAt: grnData.CreatedAt,
      modifiyBy: grnData.ModifiyBy,
      modifiyAt: grnData.ModifiyAt || new Date().toISOString()
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.put<GoodsReceipt>(`/GoodsReceipt/${id}`, payload);
    return response.data;
  },

  deleteGoodsReceipt: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/GoodsReceipt/${id}`);
  },
};