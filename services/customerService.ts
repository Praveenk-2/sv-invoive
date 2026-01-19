import axiosInstance from '@/lib/axios/axiosInstance';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '@/types/customer.types';

export const customerService = {
  getAllCustomers: async (): Promise<Customer[]> => {
    const response = await axiosInstance.get<Customer[]>('/Customer');
    return response.data;
  },

  getCustomerById: async (customerId: number): Promise<Customer> => {
    const response = await axiosInstance.get<Customer>(`/Customer/${customerId}`);
    return response.data;
  },

  createCustomer: async (customerData: CreateCustomerRequest): Promise<Customer> => {
    const payload = {
      customerId: customerData.CustomerId,
      customerName: customerData.CustomerName,
      contact: customerData.Contact,
      email: customerData.Email,
      address: customerData.Address,
      gstNumber: customerData.GSTNumber,
      isActive: customerData.IsActive,
      createdBy: customerData.CreatedBy,
      createdAt: customerData.CreatedAt || new Date().toISOString(),
      modifiyBy: customerData.ModifiyBy || 0,
      modifiyAt: customerData.ModifiyAt || null
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.post<Customer>('/Customer', payload);
    return response.data;
  },

  updateCustomer: async (id: number, customerData: UpdateCustomerRequest): Promise<Customer> => {
    const payload = {
      customerId: customerData.CustomerId,
      customerName: customerData.CustomerName,
      contact: customerData.Contact,
      email: customerData.Email,
      address: customerData.Address,
      gstNumber: customerData.GSTNumber,
      isActive: customerData.IsActive,
      createdBy: customerData.CreatedBy,
      createdAt: customerData.CreatedAt,
      modifiyBy: customerData.ModifiyBy,
      modifiyAt: customerData.ModifiyAt || new Date().toISOString()
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.put<Customer>(`/Customer/${id}`, payload);
    return response.data;
  },

  deleteCustomer: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/Customer/${id}`);
  },
};