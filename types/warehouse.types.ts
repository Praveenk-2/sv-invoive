// types/warehouse.types.ts
// Define Warehouse types based on your database structure

export interface Warehouse {
  WarehouseId: number;
  WarehouseName: string;
  Location: string;
  IsActive: boolean;
  CreatedBy: number;
  CreatedAt: string;
  ModifiyBy: number;
  ModifiyAt: string;
}

export interface CreateWarehouseRequest {
  WarehouseId: number;
  WarehouseName: string;
  Location: string;
  IsActive: boolean;
  CreatedBy: number;
  CreatedAt?: string;
  ModifiyBy?: number;
  ModifiyAt?: string | null;
}

export interface UpdateWarehouseRequest {
  WarehouseId: number;
  WarehouseName: string;
  Location: string;
  IsActive: boolean;
  CreatedBy?: number;
  CreatedAt?: string;
  ModifiyBy: number;
  ModifiyAt?: string | null;
}