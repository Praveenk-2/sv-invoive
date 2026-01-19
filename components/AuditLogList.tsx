'use client';

import React from 'react';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { auditLogService } from '@/services/auditLogService';
import { AuditLog } from '@/types/auditlog.types';

interface AuditLogListProps {
  onEdit?: (log: AuditLog) => void;
}

export default function AuditLogList({ onEdit }: AuditLogListProps) {
  const { auditLogs, loading, error, refetch } = useAuditLogs();

  const handleDelete = async (id: number) => {
    console.log('Deleting audit log with ID:', id);
    
    if (!confirm('Are you sure you want to delete this audit log?')) return;

    try {
      await auditLogService.deleteAuditLog(id);
      alert('Audit log deleted successfully!');
      refetch();
    } catch (err: any) {
      console.error('Error deleting audit log:', err);
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to delete audit log';
      alert(errorMsg);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserName = (userId: number) => {
    if (!userId) return '-';
    return `User #${userId}`;
  };

  const getActionBadgeStyle = (action: string) => {
    const baseStyle = {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: 'white',
    };

    switch (action.toUpperCase()) {
      case 'CREATE':
      case 'INSERT':
        return { ...baseStyle, backgroundColor: '#4caf50' };
      case 'UPDATE':
      case 'MODIFY':
        return { ...baseStyle, backgroundColor: '#ff9800' };
      case 'DELETE':
        return { ...baseStyle, backgroundColor: '#f44336' };
      default:
        return { ...baseStyle, backgroundColor: '#2196f3' };
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading audit logs...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        color: '#d32f2f',
        backgroundColor: '#ffebee',
        borderRadius: '4px',
        margin: '20px'
      }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div >
      <h2>All Audit Logs ({auditLogs.length})</h2>
      
      {auditLogs.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No audit logs found. Create your first audit log!
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }} className='scroll-bar'>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            marginTop: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            minWidth: '1400px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                <th style={tableHeaderStyle}>Log ID</th>
                <th style={tableHeaderStyle}>Table Name</th>
                <th style={tableHeaderStyle}>Record ID</th>
                <th style={tableHeaderStyle}>Action</th>
                <th style={tableHeaderStyle}>Old Value</th>
                <th style={tableHeaderStyle}>New Value</th>
                {/* <th style={tableHeaderStyle}>Changed By</th>
                <th style={tableHeaderStyle}>Changed At</th>
                <th style={tableHeaderStyle}>Created By</th>
                <th style={tableHeaderStyle}>Modified By</th> */}
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.LogId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tableCellStyle}>{log.LogId}</td>
                  <td style={tableCellStyle}>
                    <strong style={{color: '#524f4f'}}>{log.TableName}</strong>
                  </td>
                  <td style={tableCellStyle}>{log.RecordId}</td>
                  <td style={tableCellStyle}>
                    <span style={getActionBadgeStyle(log.Action)}>
                      {log.Action}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ 
                      maxWidth: '150px', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      {log.OldValue || '-'}
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ 
                      maxWidth: '150px', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      {log.NewValue || '-'}
                    </div>
                  </td>
                  {/* <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e3f2fd', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(log.ChangedBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(log.ChangedAt)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e8f5e9', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(log.CreatedBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#fff3e0', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(log.ModifiyBy)}
                    </span>
                  </td> */}
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {onEdit && (
                        <button
                          onClick={() => {
                            console.log('Editing audit log:', log);
                            onEdit(log);
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(log.LogId)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#d32f2f',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  padding: '12px',
  textAlign: 'left',
  fontWeight: 'bold',
};

const tableCellStyle: React.CSSProperties = {
  padding: '12px',
};
