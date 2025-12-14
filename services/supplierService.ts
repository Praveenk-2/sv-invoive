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

  // GET: Fetch single supplier by ID (if endpoint exists)
  getSupplierById: async (supplierId: number): Promise<Supplier> => {
    const response = await axiosInstance.get<Supplier>(`/Suppliers/${supplierId}`);
    return response.data;
  },

  // POST: Create new supplier
  // Endpoint: POST /api/Suppliers
  createSupplier: async (supplierData: CreateSupplierRequest): Promise<Supplier> => {
    const response = await axiosInstance.post<Supplier>('/Suppliers', supplierData);
    return response.data;
  },

  // PUT: Update supplier
  // Endpoint: PUT /api/Suppliers/{id}
  updateSupplier: async (id: number, supplierData: UpdateSupplierRequest): Promise<Supplier> => {
    const response = await axiosInstance.put<Supplier>(`/Suppliers/${id}`, supplierData);
    return response.data;
  },

  // DELETE: Delete supplier
  // Endpoint: DELETE /api/Suppliers/{id}
  deleteSupplier: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/Suppliers/${id}`);
  },
};