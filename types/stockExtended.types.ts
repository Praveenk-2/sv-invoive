export interface StockExtended {
  StockId: number;
  ItemId: number;
  WarehouseId: number;
  Quantity: number;
  LastUpdated: string;
  CreatedBy: number;
  CreatedAt: string;
  ModifiyBy: number;
  ModifiyAt: string;
}

export interface CreateStockExtendedRequest {
  StockId: number;
  ItemId: number;
  WarehouseId: number;
  Quantity: number;
  LastUpdated?: string;
  CreatedBy: number;
  CreatedAt?: string;
  ModifiyBy?: number;
  ModifiyAt?: string | null;
}

export interface UpdateStockExtendedRequest {
  StockId: number;
  ItemId: number;
  WarehouseId: number;
  Quantity: number;
  LastUpdated?: string;
  CreatedBy?: number;
  CreatedAt?: string;
  ModifiyBy: number;
  ModifiyAt?: string | null;
}