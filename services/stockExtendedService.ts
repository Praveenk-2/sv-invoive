import axiosInstance from '@/lib/axios/axiosInstance';
import { StockExtended, CreateStockExtendedRequest, UpdateStockExtendedRequest } from '@/types/stockExtended.types';

export const stockExtendedService = {
  getAllStocks: async (): Promise<StockExtended[]> => {
    const response = await axiosInstance.get<StockExtended[]>('/Stock_');
    return response.data;
  },

  getStockById: async (stockId: number): Promise<StockExtended> => {
    const response = await axiosInstance.get<StockExtended>(`/Stock_/${stockId}`);
    return response.data;
  },

  createStock: async (stockData: CreateStockExtendedRequest): Promise<StockExtended> => {
    const payload = {
      stockId: stockData.StockId,
      itemId: stockData.ItemId,
      warehouseId: stockData.WarehouseId,
      quantity: stockData.Quantity,
      lastUpdated: stockData.LastUpdated || new Date().toISOString(),
      createdBy: stockData.CreatedBy,
      createdAt: stockData.CreatedAt || new Date().toISOString(),
      modifiyBy: stockData.ModifiyBy || 0,
      modifiyAt: stockData.ModifiyAt || null
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.post<StockExtended>('/Stock_', payload);
    return response.data;
  },

  updateStock: async (id: number, stockData: UpdateStockExtendedRequest): Promise<StockExtended> => {
    const payload = {
      stockId: stockData.StockId,
      itemId: stockData.ItemId,
      warehouseId: stockData.WarehouseId,
      quantity: stockData.Quantity,
      lastUpdated: stockData.LastUpdated || new Date().toISOString(),
      createdBy: stockData.CreatedBy,
      createdAt: stockData.CreatedAt,
      modifiyBy: stockData.ModifiyBy,
      modifiyAt: stockData.ModifiyAt || new Date().toISOString()
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.put<StockExtended>(`/Stock_/${id}`, payload);
    return response.data;
  },

  deleteStock: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/Stock_/${id}`);
  },
};