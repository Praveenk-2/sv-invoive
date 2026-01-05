// Define Supplier types based on your UPDATED database structure

export interface Supplier {
  SupplierId: number;
  SupplierName: string;
  Contact: string;
  Email: string;
  Address: string;
  GSTNumber: string;
  IsActive: boolean;
  CreatedBy: number;  // UserId (number)
  CreatedAt: string;
  ModifiyBy: number;  // UserId (number)
  ModifiyAt: string;
}

export interface CreateSupplierRequest {
  SupplierId: number;
  SupplierName: string;
  Contact: string;
  Email: string;
  Address: string;
  GSTNumber: string;
  IsActive: boolean;
  CreatedBy: number;
  CreatedAt?: string;
  ModifiyBy?: number;
  ModifiyAt?: string;
}

export interface UpdateSupplierRequest {
  SupplierId: number;
  SupplierName: string;
  Contact: string;
  Email: string;
  Address: string;
  GSTNumber: string;
  IsActive: boolean;
  CreatedBy?: number;
  CreatedAt?: string;
  ModifiyBy: number;
  ModifiyAt?: string;
}