export interface Customer {
  CustomerId: number;
  CustomerName: string;
  Contact: string;
  Email: string;
  Address: string;
  GSTNumber: string;
  IsActive: boolean;
  CreatedBy: number;
  CreatedAt: string;
  ModifiyBy: number;
  ModifiyAt: string;
}

export interface CreateCustomerRequest {
  CustomerId: number;
  CustomerName: string;
  Contact: string;
  Email: string;
  Address: string;
  GSTNumber: string;
  IsActive: boolean;
  CreatedBy: number;
  CreatedAt?: string;
  ModifiyBy?: number;
  ModifiyAt?: string | null;
}

export interface UpdateCustomerRequest {
  CustomerId: number;
  CustomerName: string;
  Contact: string;
  Email: string;
  Address: string;
  GSTNumber: string;
  IsActive: boolean;
  CreatedBy?: number;
  CreatedAt?: string;
  ModifiyBy: number;
  ModifiyAt?: string | null;
}