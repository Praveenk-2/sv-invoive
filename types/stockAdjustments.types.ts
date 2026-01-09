export interface StockAdjustment {
  AdjustmentId: number;
  ItemId: number;
  WarehouseId: number;
  AdjustmentType: string;
  Quantity: number;
  Reason: string;
  AdjustedBy: number;
  AdjustedDate: string;
  CreatedBy: number;
  CreatedAt: string;
  ModifiyBy: number;
  ModifiyAt: string;
}

export interface CreateStockAdjustmentRequest {
  AdjustmentId: number;
  ItemId: number;
  WarehouseId: number;
  AdjustmentType: string;
  Quantity: number;
  Reason: string;
  AdjustedBy: number;
  AdjustedDate?: string;
  CreatedBy: number;
  CreatedAt?: string;
  ModifiyBy?: number;
  ModifiyAt?: string | null;
}

export interface UpdateStockAdjustmentRequest {
  AdjustmentId: number;
  ItemId: number;
  WarehouseId: number;
  AdjustmentType: string;
  Quantity: number;
  Reason: string;
  AdjustedBy: number;
  AdjustedDate?: string;
  CreatedBy?: number;
  CreatedAt?: string;
  ModifiyBy: number;
  ModifiyAt?: string | null;
}