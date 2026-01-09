// types/stockledger.types.ts
// Define StockLedger types based on your database structure

export interface StockLedger {
  LedgerId: number;
  ItemId: number;
  WarehouseId: number;
  ChangeType: string;
  Quantity: number;
  ReferenceType: string;
  ReferenceId: number;
  TransactionDate: string;
  CreatedBy: number;
  CreatedAt: string;
  ModifiyBy: number;
  ModifiyAt: string;
}

export interface CreateStockLedgerRequest {
  LedgerId: number;
  ItemId: number;
  WarehouseId: number;
  ChangeType: string;
  Quantity: number;
  ReferenceType: string;
  ReferenceId: number;
  TransactionDate: string;
  CreatedBy: number;
  CreatedAt?: string;
  ModifiyBy?: number;
  ModifiyAt?: string | null;
}

export interface UpdateStockLedgerRequest {
  LedgerId: number;
  ItemId: number;
  WarehouseId: number;
  ChangeType: string;
  Quantity: number;
  ReferenceType: string;
  ReferenceId: number;
  TransactionDate: string;
  CreatedBy?: number;
  CreatedAt?: string;
  ModifiyBy: number;
  ModifiyAt?: string | null;
}