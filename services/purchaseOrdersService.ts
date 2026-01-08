import axiosInstance from '@/lib/axios/axiosInstance';
import { PurchaseOrder, CreatePurchaseOrderRequest, UpdatePurchaseOrderRequest } from '@/types/purchaseOrders.types';

export const purchaseOrdersService = {
  getAllPurchaseOrders: async (): Promise<PurchaseOrder[]> => {
    const response = await axiosInstance.get<PurchaseOrder[]>('/PurchaseOrders');
    return response.data;
  },

  getPurchaseOrderById: async (poId: number): Promise<PurchaseOrder> => {
    const response = await axiosInstance.get<PurchaseOrder>(`/PurchaseOrders/${poId}`);
    return response.data;
  },

  createPurchaseOrder: async (poData: CreatePurchaseOrderRequest): Promise<PurchaseOrder> => {
    const payload = {
      poId: poData.POId,
      poNumber: poData.PONumber,
      supplierId: poData.SupplierId,
      poDate: poData.PODate || new Date().toISOString(),
      status: poData.Status,
      totalAmount: poData.TotalAmount,
      createdBy: poData.CreatedBy,
      createdAt: poData.CreatedAt || new Date().toISOString(),
      modifiyBy: poData.ModifiyBy || 0,
      modifiyAt: poData.ModifiyAt || null
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.post<PurchaseOrder>('/PurchaseOrders', payload);
    return response.data;
  },

  updatePurchaseOrder: async (id: number, poData: UpdatePurchaseOrderRequest): Promise<PurchaseOrder> => {
    const payload = {
      poId: poData.POId,
      poNumber: poData.PONumber,
      supplierId: poData.SupplierId,
      poDate: poData.PODate || new Date().toISOString(),
      status: poData.Status,
      totalAmount: poData.TotalAmount,
      createdBy: poData.CreatedBy,
      createdAt: poData.CreatedAt,
      modifiyBy: poData.ModifiyBy,
      modifiyAt: poData.ModifiyAt || new Date().toISOString()
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.put<PurchaseOrder>(`/PurchaseOrders/${id}`, payload);
    return response.data;
  },

  deletePurchaseOrder: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/PurchaseOrders/${id}`);
  },
};