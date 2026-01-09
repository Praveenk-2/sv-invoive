import axiosInstance from '@/lib/axios/axiosInstance';
import { StockAdjustment, CreateStockAdjustmentRequest, UpdateStockAdjustmentRequest } from '@/types/stockAdjustments.types';

export const stockAdjustmentsService = {
  getAllStockAdjustments: async (): Promise<StockAdjustment[]> => {
    const response = await axiosInstance.get<StockAdjustment[]>('/StockAdjustments');
    return response.data;
  },

  getStockAdjustmentById: async (adjustmentId: number): Promise<StockAdjustment> => {
    const response = await axiosInstance.get<StockAdjustment>(`/StockAdjustments/${adjustmentId}`);
    return response.data;
  },

  createStockAdjustment: async (adjustmentData: CreateStockAdjustmentRequest): Promise<StockAdjustment> => {
    const payload = {
      adjustmentId: adjustmentData.AdjustmentId,
      itemId: adjustmentData.ItemId,
      warehouseId: adjustmentData.WarehouseId,
      adjustmentType: adjustmentData.AdjustmentType,
      quantity: adjustmentData.Quantity,
      reason: adjustmentData.Reason,
      adjustedBy: adjustmentData.AdjustedBy,
      adjustedDate: adjustmentData.AdjustedDate || new Date().toISOString(),
      createdBy: adjustmentData.CreatedBy,
      createdAt: adjustmentData.CreatedAt || new Date().toISOString(),
      modifiyBy: adjustmentData.ModifiyBy || 0,
      modifiyAt: adjustmentData.ModifiyAt || null
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.post<StockAdjustment>('/StockAdjustments', payload);
    return response.data;
  },

  updateStockAdjustment: async (id: number, adjustmentData: UpdateStockAdjustmentRequest): Promise<StockAdjustment> => {
    const payload = {
      adjustmentId: adjustmentData.AdjustmentId,
      itemId: adjustmentData.ItemId,
      warehouseId: adjustmentData.WarehouseId,
      adjustmentType: adjustmentData.AdjustmentType,
      quantity: adjustmentData.Quantity,
      reason: adjustmentData.Reason,
      adjustedBy: adjustmentData.AdjustedBy,
      adjustedDate: adjustmentData.AdjustedDate || new Date().toISOString(),
      createdBy: adjustmentData.CreatedBy,
      createdAt: adjustmentData.CreatedAt,
      modifiyBy: adjustmentData.ModifiyBy,
      modifiyAt: adjustmentData.ModifiyAt || new Date().toISOString()
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.put<StockAdjustment>(`/StockAdjustments/${id}`, payload);
    return response.data;
  },

  deleteStockAdjustment: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/StockAdjustments/${id}`);
  },
};