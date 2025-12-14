// Define Supplier types based on your database structure

export interface Supplier {
  SupplierId: number;
  SupplierName: string;
  Contact: string;
  Email: string;
  Address: string;
  GSTNumber: string;
  IsActive: boolean;
}

export interface CreateSupplierRequest {
  SupplierId: number;
  SupplierName: string;
  Contact: string;
  Email: string;
  Address: string;
  GSTNumber: string;
  IsActive: boolean;
}

export interface UpdateSupplierRequest {
  SupplierId: number;
  SupplierName: string;
  Contact: string;
  Email: string;
  Address: string;
  GSTNumber: string;
  IsActive: boolean;
}