// types/auditLog.types.ts
// Define AuditLog types based on your database structure

export interface AuditLog {
  LogId: number;
  TableName: string;
  RecordId: number;
  Action: string;
  OldValue: string | null;
  NewValue: string | null;
  ChangedBy: number;
  ChangedAt: string;
  CreatedBy: number;
  CreatedAt: string;
  ModifiyBy: number;
  ModifiyAt: string;
}

export interface CreateAuditLogRequest {
  LogId: number;
  TableName: string;
  RecordId: number;
  Action: string;
  OldValue?: string | null;
  NewValue?: string | null;
  ChangedBy: number;
  ChangedAt?: string;
  CreatedBy: number;
  CreatedAt?: string;
  ModifiyBy?: number;
  ModifiyAt?: string | null;
}

export interface UpdateAuditLogRequest {
  LogId: number;
  TableName: string;
  RecordId: number;
  Action: string;
  OldValue?: string | null;
  NewValue?: string | null;
  ChangedBy: number;
  ChangedAt?: string;
  CreatedBy?: number;
  CreatedAt?: string;
  ModifiyBy: number;
  ModifiyAt?: string | null;
}