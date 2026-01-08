export interface GoodsReceiptItem {
  GRNItemId: number;
  GRNId: number;
  ItemId: number;
  QuantityReceived: number;
  UnitPrice: number;
  BatchNo: string;
  ExpiryDate: string;
}

export interface CreateGoodsReceiptItemRequest {
  GRNItemId: number;
  GRNId: number;
  ItemId: number;
  QuantityReceived: number;
  UnitPrice: number;
  BatchNo: string;
  ExpiryDate?: string;
}

export interface UpdateGoodsReceiptItemRequest {
  GRNItemId: number;
  GRNId: number;
  ItemId: number;
  QuantityReceived: number;
  UnitPrice: number;
  BatchNo: string;
  ExpiryDate?: string;
}