import axiosInstance from '@/lib/axios/axiosInstance';
import { AuditLog, CreateAuditLogRequest, UpdateAuditLogRequest } from '@/types/auditlog.types';

export const auditLogService = {
  getAllAuditLogs: async (): Promise<AuditLog[]> => {
    const response = await axiosInstance.get<AuditLog[]>('/AuditLog');
    return response.data;
  },

  getAuditLogById: async (logId: number): Promise<AuditLog> => {
    const response = await axiosInstance.get<AuditLog>(`/AuditLog/${logId}`);
    return response.data;
  },

  createAuditLog: async (logData: CreateAuditLogRequest): Promise<AuditLog> => {
    const payload = {
      logId: logData.LogId,
      tableName: logData.TableName,
      recordId: logData.RecordId,
      action: logData.Action,
      oldValue: logData.OldValue || null,
      newValue: logData.NewValue || null,
      changedBy: logData.ChangedBy,
      changedAt: logData.ChangedAt || new Date().toISOString(),
      createdBy: logData.CreatedBy,
      createdAt: logData.CreatedAt || new Date().toISOString(),
      modifiyBy: logData.ModifiyBy || 0,
      modifiyAt: logData.ModifiyAt || null
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.post<AuditLog>('/AuditLog', payload);
    return response.data;
  },

  updateAuditLog: async (id: number, logData: UpdateAuditLogRequest): Promise<AuditLog> => {
    const payload = {
      logId: logData.LogId,
      tableName: logData.TableName,
      recordId: logData.RecordId,
      action: logData.Action,
      oldValue: logData.OldValue || null,
      newValue: logData.NewValue || null,
      changedBy: logData.ChangedBy,
      changedAt: logData.ChangedAt || new Date().toISOString(),
      createdBy: logData.CreatedBy,
      createdAt: logData.CreatedAt,
      modifiyBy: logData.ModifiyBy,
      modifiyAt: logData.ModifiyAt || new Date().toISOString()
    };
    
    console.log('Service sending payload:', JSON.stringify(payload, null, 2));
    const response = await axiosInstance.put<AuditLog>(`/AuditLog/${id}`, payload);
    return response.data;
  },

  deleteAuditLog: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/AuditLog/${id}`);
  },
};
