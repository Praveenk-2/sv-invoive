'use client';

import React from 'react';
import { useGoodsReceipts } from '@/hooks/useGoodsReceipts';
import { goodsReceiptService } from '@/services/goodsReceiptService';
import { GoodsReceipt } from '@/types/goodsReceipt.types';

interface GoodsReceiptListProps {
  onEdit?: (grn: GoodsReceipt) => void;
}

export default function GoodsReceiptList({ onEdit }: GoodsReceiptListProps) {
  const { goodsReceipts, loading, error, refetch } = useGoodsReceipts();

  const handleDelete = async (id: number) => {
    console.log('Deleting goods receipt with ID:', id);
    
    if (!confirm('Are you sure you want to delete this goods receipt?')) return;

    try {
      await goodsReceiptService.deleteGoodsReceipt(id);
      alert('Goods receipt deleted successfully!');
      refetch();
    } catch (err: any) {
      console.error('Error deleting goods receipt:', err);
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to delete goods receipt';
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

  const getStatusBadgeStyle = (status: string) => {
    const baseStyle = {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: 'white',
    };

    switch (status.toUpperCase()) {
      case 'RECEIVED':
      case 'COMPLETED':
        return { ...baseStyle, backgroundColor: '#4caf50' };
      case 'PENDING':
      case 'IN PROGRESS':
        return { ...baseStyle, backgroundColor: '#ff9800' };
      case 'REJECTED':
      case 'CANCELLED':
        return { ...baseStyle, backgroundColor: '#f44336' };
      case 'PARTIAL':
        return { ...baseStyle, backgroundColor: '#2196f3' };
      default:
        return { ...baseStyle, backgroundColor: '#9e9e9e' };
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading goods receipts...
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
      <h2>All Goods Receipts ({goodsReceipts.length})</h2>
      
      {goodsReceipts.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No goods receipts found. Create your first goods receipt!
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }} className='scroll-bar'>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            marginTop: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            minWidth: '1300px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                <th style={tableHeaderStyle}>GRN ID</th>
                <th style={tableHeaderStyle}>GRN Number</th>
                <th style={tableHeaderStyle}>PO ID</th>
                <th style={tableHeaderStyle}>Received Date</th>
                <th style={tableHeaderStyle}>Received By</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Created By</th>
                <th style={tableHeaderStyle}>Created At</th>
                <th style={tableHeaderStyle}>Modified By</th>
                <th style={tableHeaderStyle}>Modified At</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {goodsReceipts.map((grn) => (
                <tr key={grn.GRNId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tableCellStyle}>{grn.GRNId}</td>
                  <td style={tableCellStyle}>
                    <strong style={{ color: '#524f4f' }}>{grn.GRNNumber}</strong>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e3f2fd', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      PO #{grn.POId}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(grn.ReceivedDate)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e8f5e9', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(grn.ReceivedBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={getStatusBadgeStyle(grn.Status)}>
                      {grn.Status}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#f3e5f5', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(grn.CreatedBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(grn.CreatedAt)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#fff3e0', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(grn.ModifiyBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(grn.ModifiyAt)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {onEdit && (
                        <button
                          onClick={() => {
                            console.log('Editing goods receipt:', grn);
                            onEdit(grn);
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
                        onClick={() => handleDelete(grn.GRNId)}
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