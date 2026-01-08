'use client';

import React from 'react';
import { useGoodsReceiptItems } from '@/hooks/useGoodsReceiptItems';
import { goodsReceiptItemsService } from '@/services/goodsReceiptItemsService';
import { GoodsReceiptItem } from '@/types/goodsReceiptItems.types';

interface GoodsReceiptItemsListProps {
  onEdit?: (item: GoodsReceiptItem) => void;
}

export default function GoodsReceiptItemsList({ onEdit }: GoodsReceiptItemsListProps) {
  const { goodsReceiptItems, loading, error, refetch } = useGoodsReceiptItems();

  const handleDelete = async (id: number) => {
    console.log('Deleting goods receipt item with ID:', id);
    
    if (!confirm('Are you sure you want to delete this goods receipt item?')) return;

    try {
      await goodsReceiptItemsService.deleteGoodsReceiptItem(id);
      alert('Goods receipt item deleted successfully!');
      refetch();
    } catch (err: any) {
      console.error('Error deleting goods receipt item:', err);
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to delete goods receipt item';
      alert(errorMsg);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateTotal = (quantity: number, unitPrice: number) => {
    return formatCurrency(quantity * unitPrice);
  };

  const isExpiringSoon = (expiryDate: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const getExpiryBadgeStyle = (expiryDate: string) => {
    const baseStyle = {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: 'white',
    };

    if (isExpired(expiryDate)) {
      return { ...baseStyle, backgroundColor: '#f44336' };
    } else if (isExpiringSoon(expiryDate)) {
      return { ...baseStyle, backgroundColor: '#ff9800' };
    } else {
      return { ...baseStyle, backgroundColor: '#4caf50' };
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading goods receipt items...
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
      <h2>All Goods Receipt Items ({goodsReceiptItems.length})</h2>
      
      {goodsReceiptItems.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No goods receipt items found. Create your first goods receipt item!
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }} className='scroll-bar'>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            marginTop: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            minWidth: '1200px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                <th style={tableHeaderStyle}>Item ID</th>
                <th style={tableHeaderStyle}>GRN ID</th>
                <th style={tableHeaderStyle}>Item ID</th>
                <th style={tableHeaderStyle}>Quantity</th>
                <th style={tableHeaderStyle}>Unit Price</th>
                <th style={tableHeaderStyle}>Total Amount</th>
                <th style={tableHeaderStyle}>Batch No</th>
                <th style={tableHeaderStyle}>Expiry Date</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {goodsReceiptItems.map((item) => (
                <tr key={item.GRNItemId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tableCellStyle}>
                    <strong style={{ color: '#1976d2' }}>{item.GRNItemId}</strong>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e3f2fd', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      GRN #{item.GRNId}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#f3e5f5', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      Item #{item.ItemId}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <strong style={{ fontSize: '14px' }}>
                      {item.QuantityReceived.toLocaleString()}
                    </strong>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                      {formatCurrency(item.UnitPrice)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      color: '#1565c0', 
                      fontWeight: 'bold',
                      fontSize: '15px'
                    }}>
                      {calculateTotal(item.QuantityReceived, item.UnitPrice)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#fff3e0', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }}>
                      {item.BatchNo}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    {item.ExpiryDate ? (
                      <div>
                        <span style={getExpiryBadgeStyle(item.ExpiryDate)}>
                          {formatDate(item.ExpiryDate)}
                        </span>
                        {isExpired(item.ExpiryDate) && (
                          <div style={{ 
                            color: '#f44336', 
                            fontSize: '10px', 
                            marginTop: '2px',
                            fontWeight: 'bold'
                          }}>
                            EXPIRED
                          </div>
                        )}
                        {isExpiringSoon(item.ExpiryDate) && !isExpired(item.ExpiryDate) && (
                          <div style={{ 
                            color: '#ff9800', 
                            fontSize: '10px', 
                            marginTop: '2px',
                            fontWeight: 'bold'
                          }}>
                            EXPIRING SOON
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: '#999' }}>-</span>
                    )}
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {onEdit && (
                        <button
                          onClick={() => {
                            console.log('Editing goods receipt item:', item);
                            onEdit(item);
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
                        onClick={() => handleDelete(item.GRNItemId)}
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