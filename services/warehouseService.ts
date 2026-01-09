// services/warehouseService.ts
import axiosInstance from '@/lib/axios/axiosInstance';
import { Warehouse, CreateWarehouseRequest, UpdateWarehouseRequest } from '@/types/warehouse.types';

export const warehouseService = {
  getAllWarehouses: async (): Promise<Warehouse[]> => {
    const response = await axiosInstance.get<Warehouse[]>('/Warehouses_');
    return response.data;
  },

  getWarehouseById: async (warehouseId: number): Promise<Warehouse> => {
    const response = await axiosInstance.get<Warehouse>(`/Warehouses_/${warehouseId}`);
    return response.data;
  },

  createWarehouse: async (warehouseData: CreateWarehouseRequest): Promise<Warehouse> => {
    // Convert PascalCase to camelCase for API
    const payload = {
      warehouseId: warehouseData.WarehouseId,
      warehouseName: warehouseData.WarehouseName,
      location: warehouseData.Location,
      isActive: warehouseData.IsActive,
      createdBy: warehouseData.CreatedBy,
      createdAt: warehouseData.CreatedAt || new Date().toISOString(),
      modifiyBy: warehouseData.ModifiyBy || 0,
      modifiyAt: warehouseData.ModifiyAt || null
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.post<Warehouse>('/Warehouses_', payload);
    return response.data;
  },

  updateWarehouse: async (id: number, warehouseData: UpdateWarehouseRequest): Promise<Warehouse> => {
    // Convert PascalCase to camelCase for API
    const payload = {
      warehouseId: warehouseData.WarehouseId,
      warehouseName: warehouseData.WarehouseName,
      location: warehouseData.Location,
      isActive: warehouseData.IsActive,
      createdBy: warehouseData.CreatedBy,
      createdAt: warehouseData.CreatedAt,
      modifiyBy: warehouseData.ModifiyBy,
      modifiyAt: warehouseData.ModifiyAt || new Date().toISOString()
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.put<Warehouse>(`/Warehouses_/${id}`, payload);
    return response.data;
  },

  deleteWarehouse: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/Warehouses_/${id}`);
  },
};