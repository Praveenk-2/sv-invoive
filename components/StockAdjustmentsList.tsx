'use client';

import React from 'react';
import { useStockAdjustments } from '@/hooks/useStockAdjustments';
import { stockAdjustmentsService } from '@/services/stockAdjustmentsService';
import { StockAdjustment } from '@/types/stockAdjustments.types';

interface StockAdjustmentsListProps {
  onEdit?: (adjustment: StockAdjustment) => void;
}

export default function StockAdjustmentsList({ onEdit }: StockAdjustmentsListProps) {
  const { stockAdjustments, loading, error, refetch } = useStockAdjustments();

  const handleDelete = async (id: number) => {
    console.log('Deleting stock adjustment with ID:', id);
    
    if (!confirm('Are you sure you want to delete this stock adjustment?')) return;

    try {
      await stockAdjustmentsService.deleteStockAdjustment(id);
      alert('Stock adjustment deleted successfully!');
      refetch();
    } catch (err: any) {
      console.error('Error deleting stock adjustment:', err);
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to delete stock adjustment';
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

  const getAdjustmentTypeBadgeStyle = (type: string) => {
    const baseStyle = {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: 'white',
    };

    switch (type.toUpperCase()) {
      case 'INCREASE':
      case 'ADD':
      case 'IN':
        return { ...baseStyle, backgroundColor: '#4caf50' };
      case 'DECREASE':
      case 'REMOVE':
      case 'OUT':
        return { ...baseStyle, backgroundColor: '#f44336' };
      case 'CORRECTION':
      case 'ADJUST':
        return { ...baseStyle, backgroundColor: '#ff9800' };
      case 'TRANSFER':
        return { ...baseStyle, backgroundColor: '#2196f3' };
      default:
        return { ...baseStyle, backgroundColor: '#9e9e9e' };
    }
  };

  const getQuantityStyle = (type: string, quantity: number) => {
    const isIncrease = ['INCREASE', 'ADD', 'IN'].includes(type.toUpperCase());
    return {
      color: isIncrease ? '#4caf50' : '#f44336',
      fontWeight: 'bold',
      fontSize: '16px'
    };
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading stock adjustments...
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
    <div style={{ padding: '20px' }}>
      <h2>All Stock Adjustments ({stockAdjustments.length})</h2>
      
      {stockAdjustments.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No stock adjustments found. Create your first stock adjustment!
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }} className='scroll-bar'>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            marginTop: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            minWidth: '1600px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                <th style={tableHeaderStyle}>Adjustment ID</th>
                <th style={tableHeaderStyle}>Item ID</th>
                <th style={tableHeaderStyle}>Warehouse ID</th>
                <th style={tableHeaderStyle}>Type</th>
                <th style={tableHeaderStyle}>Quantity</th>
                <th style={tableHeaderStyle}>Reason</th>
                {/* <th style={tableHeaderStyle}>Adjusted By</th>
                <th style={tableHeaderStyle}>Adjusted Date</th>
                <th style={tableHeaderStyle}>Created By</th>
                <th style={tableHeaderStyle}>Modified By</th> */}
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stockAdjustments.map((adjustment) => (
                <tr key={adjustment.AdjustmentId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tableCellStyle}>
                    <strong style={{ color: '' }}>{adjustment.AdjustmentId}</strong>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#f3e5f5', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      Item #{adjustment.ItemId}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e3f2fd', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      WH #{adjustment.WarehouseId}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={getAdjustmentTypeBadgeStyle(adjustment.AdjustmentType)}>
                      {adjustment.AdjustmentType}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={getQuantityStyle(adjustment.AdjustmentType, adjustment.Quantity)}>
                      {['INCREASE', 'ADD', 'IN'].includes(adjustment.AdjustmentType.toUpperCase()) ? '+' : '-'}
                      {Math.abs(adjustment.Quantity).toLocaleString()}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ 
                      maxWidth: '200px', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      fontSize: '13px',
                      color: '#666'
                    }}>
                      {adjustment.Reason}
                    </div>
                  </td>
                  {/* <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#fff3e0', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(adjustment.AdjustedBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(adjustment.AdjustedDate)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e8f5e9', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(adjustment.CreatedBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#fce4ec', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(adjustment.ModifiyBy)}
                    </span>
                  </td> */}
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {onEdit && (
                        <button
                          onClick={() => {
                            console.log('Editing stock adjustment:', adjustment);
                            onEdit(adjustment);
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
                        onClick={() => handleDelete(adjustment.AdjustmentId)}
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