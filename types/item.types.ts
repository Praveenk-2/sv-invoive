// Define Item types based on your database structure

export interface Item {
  ItemId: number;
  ItemName: string;
  CategoryId: number;
  UnitId: number;
  SKU: string;
  Barcode: string;
  Description: string;
  UnitPrice: number;
  ReorderLevel: number;
  IsActive: boolean;
  CreatedAt: string;
  // Optional: Include related data if API returns them
  CategoryName?: string;
  UnitName?: string;
}

export interface CreateItemRequest {
  ItemId: number;
  ItemName: string;
  CategoryId: number;
  UnitId: number;
  SKU: string;
  Barcode: string;
  Description: string;
  UnitPrice: number;
  ReorderLevel: number;
  IsActive: boolean;
  CreatedAt?: string;
}

export interface UpdateItemRequest {
  ItemId: number;
  ItemName: string;
  CategoryId: number;
  UnitId: number;
  SKU: string;
  Barcode: string;
  Description: string;
  UnitPrice: number;
  ReorderLevel: number;
  IsActive: boolean;
  CreatedAt?: string;
}
