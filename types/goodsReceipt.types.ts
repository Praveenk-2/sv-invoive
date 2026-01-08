export interface GoodsReceipt {
  GRNId: number;
  GRNNumber: string;
  POId: number;
  ReceivedDate: string;
  ReceivedBy: number;
  Status: string;
  CreatedBy: number;
  CreatedAt: string;
  ModifiyBy: number;
  ModifiyAt: string;
}

export interface CreateGoodsReceiptRequest {
  GRNId: number;
  GRNNumber: string;
  POId: number;
  ReceivedDate?: string;
  ReceivedBy: number;
  Status: string;
  CreatedBy: number;
  CreatedAt?: string;
  ModifiyBy?: number;
  ModifiyAt?: string | null;
}

export interface UpdateGoodsReceiptRequest {
  GRNId: number;
  GRNNumber: string;
  POId: number;
  ReceivedDate?: string;
  ReceivedBy: number;
  Status: string;
  CreatedBy?: number;
  CreatedAt?: string;
  ModifiyBy: number;
  ModifiyAt?: string | null;
}