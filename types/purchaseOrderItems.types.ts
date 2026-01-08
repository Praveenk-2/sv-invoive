export interface PurchaseOrderItem {
  POItemId: number;
  POId: number;
  ItemId: number;
  Quantity: number;
  UnitPrice: number;
  Total: number;
  CreatedBy: number;
  CreatedAt: string;
  ModifiyBy: number;
  ModifiyAt: string;
}

export interface CreatePurchaseOrderItemRequest {
  POItemId: number;
  POId: number;
  ItemId: number;
  Quantity: number;
  UnitPrice: number;
  Total: number;
  CreatedBy: number;
  CreatedAt?: string;
  ModifiyBy?: number;
  ModifiyAt?: string | null;
}

export interface UpdatePurchaseOrderItemRequest {
  POItemId: number;
  POId: number;
  ItemId: number;
  Quantity: number;
  UnitPrice: number;
  Total: number;
  CreatedBy?: number;
  CreatedAt?: string;
  ModifiyBy: number;
  ModifiyAt?: string | null;
}