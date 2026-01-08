import { useState, useEffect } from 'react';
import { auditLogService } from '@/services/auditLogService';
import { AuditLog } from '@/types/auditlog.types';

export const useAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const data = await auditLogService.getAllAuditLogs();
      setAuditLogs(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch audit logs');
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const refetch = () => {
    fetchAuditLogs();
  };

  return { auditLogs, loading, error, refetch };
};

export const useAuditLog = (logId: number | null) => {
  const [auditLog, setAuditLog] = useState<AuditLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!logId) {
      setLoading(false);
      return;
    }

    const fetchAuditLog = async () => {
      try {
        setLoading(true);
        const data = await auditLogService.getAuditLogById(logId);
        setAuditLog(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch audit log');
        console.error('Error fetching audit log:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditLog();
  }, [logId]);

  return { auditLog, loading, error };
};
