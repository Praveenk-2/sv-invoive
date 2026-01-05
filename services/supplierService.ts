// services/supplierService.ts
// All Supplier API operations
import axiosInstance from '@/lib/axios/axiosInstance';
import { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from '@/types/supplier.types';

export const supplierService = {
  // GET: Fetch all suppliers
  // Endpoint: GET /api/Suppliers
  getAllSuppliers: async (): Promise<Supplier[]> => {
    const response = await axiosInstance.get<Supplier[]>('/Suppliers');
    return response.data;
  },

  // GET: Fetch single supplier by ID
  // Endpoint: GET /api/Suppliers/{supplierId}
  getSupplierById: async (supplierId: number): Promise<Supplier> => {
    const response = await axiosInstance.get<Supplier>(`/Suppliers/${supplierId}`);
    return response.data;
  },

  // POST: Create new supplier
  // Endpoint: POST /api/Suppliers
  createSupplier: async (supplierData: CreateSupplierRequest): Promise<Supplier> => {
    // Convert PascalCase to camelCase for API
    const payload = {
      supplierId: supplierData.SupplierId,
      supplierName: supplierData.SupplierName,
      contact: supplierData.Contact,
      email: supplierData.Email,
      address: supplierData.Address,
      gstNumber: supplierData.GSTNumber,
      isActive: supplierData.IsActive,
      createdBy: supplierData.CreatedBy,
      createdAt: supplierData.CreatedAt || new Date().toISOString(),
      modifiyBy: supplierData.ModifiyBy || 0,
      modifiyAt: new Date().toISOString()
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.post<Supplier>('/Suppliers', payload);
    return response.data;
  },

  // PUT: Update supplier
  // Endpoint: PUT /api/Suppliers/{id}
  updateSupplier: async (id: number, supplierData: UpdateSupplierRequest): Promise<Supplier> => {
    // Convert PascalCase to camelCase for API
    const payload = {
      supplierId: supplierData.SupplierId,
      supplierName: supplierData.SupplierName,
      contact: supplierData.Contact,
      email: supplierData.Email,
      address: supplierData.Address,
      gstNumber: supplierData.GSTNumber,
      isActive: supplierData.IsActive,
      createdBy: supplierData.CreatedBy,
      createdAt: supplierData.CreatedAt,
      modifiyBy: supplierData.ModifiyBy,
      modifiyAt: new Date().toISOString()
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.put<Supplier>(`/Suppliers/${id}`, payload);
    return response.data;
  },

  // DELETE: Delete supplier
  // Endpoint: DELETE /api/Suppliers/{id}
  deleteSupplier: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/Suppliers/${id}`);
  },
};