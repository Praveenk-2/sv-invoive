// Define Item types based on your UPDATED database structure

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
  CreatedBy: number;  // UserId (number)
  ModifiyBy: number;  // UserId (number)
  ModifiyAt: string;
  // Optional: Include related data if API returns them
  CategoryName?: string;
  UnitName?: string;
}

export interface CreateItemRequest {
  // item: {  // API expects nested "item" object
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
    CreatedBy: number;
    ModifiyBy?: number;
    ModifiyAt?: string;
  // };
}

export interface UpdateItemRequest {
  // item: {  // API expects nested "item" object
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
    CreatedBy?: number;
    ModifiyBy: number;
    ModifiyAt?: string;
  // };
}
