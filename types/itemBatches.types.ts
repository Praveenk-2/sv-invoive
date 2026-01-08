export interface ItemBatch {
  BatchId: number;
  ItemId: number;
  BatchNo: string;
  Quantity: number;
  ExpiryDate: string;
  CreatedBy: number;
  CreatedAt: string;
  ModifiyBy: number;
  ModifiyAt: string;
}

export interface CreateItemBatchRequest {
  BatchId: number;
  ItemId: number;
  BatchNo: string;
  Quantity: number;
  ExpiryDate?: string;
  CreatedBy: number;
  CreatedAt?: string;
  ModifiyBy?: number;
  ModifiyAt?: string | null;
}

export interface UpdateItemBatchRequest {
  BatchId: number;
  ItemId: number;
  BatchNo: string;
  Quantity: number;
  ExpiryDate?: string;
  CreatedBy?: number;
  CreatedAt?: string;
  ModifiyBy: number;
  ModifiyAt?: string | null;
}