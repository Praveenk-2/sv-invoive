// services/stockLedgerService.ts
import axiosInstance from '@/lib/axios/axiosInstance';
import { StockLedger, CreateStockLedgerRequest, UpdateStockLedgerRequest } from '@/types/Stockledger.types';

export const stockLedgerService = {
  getAllStockLedgers: async (): Promise<StockLedger[]> => {
    const response = await axiosInstance.get<StockLedger[]>('/StockLedger_');
    return response.data;
  },

  getStockLedgerById: async (ledgerId: number): Promise<StockLedger> => {
    const response = await axiosInstance.get<StockLedger>(`/StockLedger_/${ledgerId}`);
    return response.data;
  },

  createStockLedger: async (stockLedgerData: CreateStockLedgerRequest): Promise<StockLedger> => {
    // Convert PascalCase to camelCase for API
    const payload = {
      ledgerId: stockLedgerData.LedgerId,
      itemId: stockLedgerData.ItemId,
      warehouseId: stockLedgerData.WarehouseId,
      changeType: stockLedgerData.ChangeType,
      quantity: stockLedgerData.Quantity,
      referenceType: stockLedgerData.ReferenceType,
      referenceId: stockLedgerData.ReferenceId,
      transactionDate: stockLedgerData.TransactionDate,
      createdBy: stockLedgerData.CreatedBy,
      createdAt: stockLedgerData.CreatedAt || new Date().toISOString(),
      modifiyBy: stockLedgerData.ModifiyBy || 0,
      modifiyAt: stockLedgerData.ModifiyAt || null
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.post<StockLedger>('/StockLedger_', payload);
    return response.data;
  },

  updateStockLedger: async (id: number, stockLedgerData: UpdateStockLedgerRequest): Promise<StockLedger> => {
    // Convert PascalCase to camelCase for API
    const payload = {
      ledgerId: stockLedgerData.LedgerId,
      itemId: stockLedgerData.ItemId,
      warehouseId: stockLedgerData.WarehouseId,
      changeType: stockLedgerData.ChangeType,
      quantity: stockLedgerData.Quantity,
      referenceType: stockLedgerData.ReferenceType,
      referenceId: stockLedgerData.ReferenceId,
      transactionDate: stockLedgerData.TransactionDate,
      createdBy: stockLedgerData.CreatedBy,
      createdAt: stockLedgerData.CreatedAt,
      modifiyBy: stockLedgerData.ModifiyBy,
      modifiyAt: stockLedgerData.ModifiyAt || new Date().toISOString()
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.put<StockLedger>(`/StockLedger_/${id}`, payload);
    return response.data;
  },

  deleteStockLedger: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/StockLedger_/${id}`);
  },
};