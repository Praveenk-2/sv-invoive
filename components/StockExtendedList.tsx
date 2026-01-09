'use client';

import React from 'react';
import { useStocksExtended } from '@/hooks/useStockExtended';
import { stockExtendedService } from '@/services/stockExtendedService';
import { StockExtended } from '@/types/stockExtended.types';

interface StockExtendedListProps {
  onEdit?: (stock: StockExtended) => void;
}

export default function StockExtendedList({ onEdit }: StockExtendedListProps) {
  const { stocks, loading, error, refetch } = useStocksExtended();

  const handleDelete = async (id: number) => {
    console.log('Deleting stock record with ID:', id);
    
    if (!confirm('Are you sure you want to delete this stock record?')) return;

    try {
      await stockExtendedService.deleteStock(id);
      alert('Stock record deleted successfully!');
      refetch();
    } catch (err: any) {
      console.error('Error deleting stock record:', err);
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to delete stock record';
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

  const getQuantityStyle = (quantity: number) => {
    if (quantity === 0) {
      return { color: '#f44336', fontWeight: 'bold' };
    } else if (quantity < 10) {
      return { color: '#ff9800', fontWeight: 'bold' };
    } else if (quantity < 50) {
      return { color: '#2196f3', fontWeight: 'bold' };
    } else {
      return { color: '#4caf50', fontWeight: 'bold' };
    }
  };

  const getStockStatusBadge = (quantity: number) => {
    if (quantity === 0) {
      return (
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 'bold',
          backgroundColor: '#f44336',
          color: 'white'
        }}>
          OUT OF STOCK
        </span>
      );
    } else if (quantity < 10) {
      return (
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 'bold',
          backgroundColor: '#ff9800',
          color: 'white'
        }}>
          LOW STOCK
        </span>
      );
    } else if (quantity < 50) {
      return (
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 'bold',
          backgroundColor: '#2196f3',
          color: 'white'
        }}>
          MEDIUM
        </span>
      );
    } else {
      return (
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 'bold',
          backgroundColor: '#4caf50',
          color: 'white'
        }}>
          IN STOCK
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading stock records...
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

  const totalQuantity = stocks.reduce((sum, stock) => sum + stock.Quantity, 0);
  const lowStockCount = stocks.filter(s => s.Quantity < 10 && s.Quantity > 0).length;
  const outOfStockCount = stocks.filter(s => s.Quantity === 0).length;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '25px'
      }}>
        <div style={{
          padding: '20px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          border: '2px solid #1976d2'
        }}>
          <div style={{ fontSize: '14px', color: '#1976d2', marginBottom: '5px' }}>Total Items</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1565c0' }}>{stocks.length}</div>
        </div>
        <div style={{
          padding: '20px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          border: '2px solid #4caf50'
        }}>
          <div style={{ fontSize: '14px', color: '#2e7d32', marginBottom: '5px' }}>Total Quantity</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2e7d32' }}>{totalQuantity.toLocaleString()}</div>
        </div>
        <div style={{
          padding: '20px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          border: '2px solid #ff9800'
        }}>
          <div style={{ fontSize: '14px', color: '#e65100', marginBottom: '5px' }}>Low Stock</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#e65100' }}>{lowStockCount}</div>
        </div>
        <div style={{
          padding: '20px',
          backgroundColor: '#ffebee',
          borderRadius: '8px',
          border: '2px solid #f44336'
        }}>
          <div style={{ fontSize: '14px', color: '#c62828', marginBottom: '5px' }}>Out of Stock</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#c62828' }}>{outOfStockCount}</div>
        </div>
      </div>

      <h2>All Stock Records ({stocks.length})</h2>
      
      {stocks.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No stock records found. Create your first stock record!
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            marginTop: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            minWidth: '1600px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                <th style={tableHeaderStyle}>Stock ID</th>
                <th style={tableHeaderStyle}>Item ID</th>
                <th style={tableHeaderStyle}>Warehouse ID</th>
                <th style={tableHeaderStyle}>Quantity</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Last Updated</th>
                <th style={tableHeaderStyle}>Created By</th>
                <th style={tableHeaderStyle}>Created At</th>
                <th style={tableHeaderStyle}>Modified By</th>
                <th style={tableHeaderStyle}>Modified At</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.StockId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tableCellStyle}>
                    <strong style={{ color: '#1976d2', fontSize: '16px' }}>
                      {stock.StockId}
                    </strong>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#f3e5f5', 
                      padding: '6px 12px', 
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: 'bold'
                    }}>
                      Item #{stock.ItemId}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e3f2fd', 
                      padding: '6px 12px', 
                      borderRadius: '4px',
                      fontSize: '13px',
                      fontWeight: 'bold'
                    }}>
                      WH #{stock.WarehouseId}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ fontSize: '20px', ...getQuantityStyle(stock.Quantity) }}>
                      {stock.Quantity.toLocaleString()}
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    {getStockStatusBadge(stock.Quantity)}
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {formatDate(stock.LastUpdated)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e8f5e9', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(stock.CreatedBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {formatDate(stock.CreatedAt)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#fff3e0', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(stock.ModifiyBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {formatDate(stock.ModifiyAt)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {onEdit && (
                        <button
                          onClick={() => {
                            console.log('Editing stock:', stock);
                            onEdit(stock);
                          }}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(stock.StockId)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#d32f2f',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold'
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