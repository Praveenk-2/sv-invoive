'use client';

import React from 'react';
import { useItemBatches } from '@/hooks/useItemBatches';
import { itemBatchesService } from '@/services/itemBatchesService';
import { ItemBatch } from '@/types/itemBatches.types';

interface ItemBatchesListProps {
  onEdit?: (batch: ItemBatch) => void;
}

export default function ItemBatchesList({ onEdit }: ItemBatchesListProps) {
  const { itemBatches, loading, error, refetch } = useItemBatches();

  const handleDelete = async (id: number) => {
    console.log('Deleting item batch with ID:', id);
    
    if (!confirm('Are you sure you want to delete this item batch?')) return;

    try {
      await itemBatchesService.deleteItemBatch(id);
      alert('Item batch deleted successfully!');
      refetch();
    } catch (err: any) {
      console.error('Error deleting item batch:', err);
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to delete item batch';
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

  const formatExpiryDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUserName = (userId: number) => {
    if (!userId) return '-';
    return `User #${userId}`;
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

  const getQuantityStyle = (quantity: number) => {
    if (quantity === 0) {
      return { color: '#f44336', fontWeight: 'bold' };
    } else if (quantity < 10) {
      return { color: '#ff9800', fontWeight: 'bold' };
    } else {
      return { color: '#4caf50', fontWeight: 'bold' };
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading item batches...
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
      <h2>All Item Batches ({itemBatches.length})</h2>
      
      {itemBatches.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No item batches found. Create your first item batch!
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
                <th style={tableHeaderStyle}>Batch ID</th>
                <th style={tableHeaderStyle}>Item ID</th>
                <th style={tableHeaderStyle}>Batch Number</th>
                <th style={tableHeaderStyle}>Quantity</th>
                <th style={tableHeaderStyle}>Expiry Date</th>
                {/* <th style={tableHeaderStyle}>Created By</th>
                <th style={tableHeaderStyle}>Created At</th>
                <th style={tableHeaderStyle}>Modified By</th>
                <th style={tableHeaderStyle}>Modified At</th> */}
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {itemBatches.map((batch) => (
                <tr key={batch.BatchId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tableCellStyle}>
                    <strong style={{ color: '' }}>{batch.BatchId}</strong>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#f3e5f5', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      Item #{batch.ItemId}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#fff3e0', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      fontWeight: 'bold'
                    }}>
                      {batch.BatchNo}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div>
                      <span style={{ ...getQuantityStyle(batch.Quantity), fontSize: '16px' }}>
                        {batch.Quantity.toLocaleString()}
                      </span>
                      {batch.Quantity === 0 && (
                        <div style={{ 
                          color: '#f44336', 
                          fontSize: '10px', 
                          marginTop: '2px',
                          fontWeight: 'bold'
                        }}>
                          OUT OF STOCK
                        </div>
                      )}
                      {batch.Quantity < 10 && batch.Quantity > 0 && (
                        <div style={{ 
                          color: '#ff9800', 
                          fontSize: '10px', 
                          marginTop: '2px',
                          fontWeight: 'bold'
                        }}>
                          LOW STOCK
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    {batch.ExpiryDate ? (
                      <div>
                        <span style={getExpiryBadgeStyle(batch.ExpiryDate)}>
                          {formatExpiryDate(batch.ExpiryDate)}
                        </span>
                        {isExpired(batch.ExpiryDate) && (
                          <div style={{ 
                            color: '#f44336', 
                            fontSize: '10px', 
                            marginTop: '2px',
                            fontWeight: 'bold'
                          }}>
                            EXPIRED
                          </div>
                        )}
                        {isExpiringSoon(batch.ExpiryDate) && !isExpired(batch.ExpiryDate) && (
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
                  {/* <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e8f5e9', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(batch.CreatedBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(batch.CreatedAt)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#fff3e0', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(batch.ModifiyBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(batch.ModifiyAt)}
                    </span>
                  </td> */}
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {onEdit && (
                        <button
                          onClick={() => {
                            console.log('Editing item batch:', batch);
                            onEdit(batch);
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
                        onClick={() => handleDelete(batch.BatchId)}
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