export interface PurchaseOrder {
  POId: number;
  PONumber: string;
  SupplierId: number;
  PODate: string;
  Status: string;
  TotalAmount: number;
  CreatedBy: number;
  CreatedAt: string;
  ModifiyBy: number;
  ModifiyAt: string;
}

export interface CreatePurchaseOrderRequest {
  POId: number;
  PONumber: string;
  SupplierId: number;
  PODate?: string;
  Status: string;
  TotalAmount: number;
  CreatedBy: number;
  CreatedAt?: string;
  ModifiyBy?: number;
  ModifiyAt?: string | null;
}

export interface UpdatePurchaseOrderRequest {
  POId: number;
  PONumber: string;
  SupplierId: number;
  PODate?: string;
  Status: string;
  TotalAmount: number;
  CreatedBy?: number;
  CreatedAt?: string;
  ModifiyBy: number;
  ModifiyAt?: string | null;
}