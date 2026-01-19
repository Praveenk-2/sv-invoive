'use client';

import React from 'react';
import { usePurchaseOrderItems } from '@/hooks/usePurchaseOrderItems';
import { purchaseOrderItemsService } from '@/services/purchaseOrderItemsService';
import { PurchaseOrderItem } from '@/types/purchaseOrderItems.types';

interface PurchaseOrderItemsListProps {
  onEdit?: (item: PurchaseOrderItem) => void;
}

export default function PurchaseOrderItemsList({ onEdit }: PurchaseOrderItemsListProps) {
  const { purchaseOrderItems, loading, error, refetch } = usePurchaseOrderItems();

  const handleDelete = async (id: number) => {
    console.log('Deleting purchase order item with ID:', id);
    
    if (!confirm('Are you sure you want to delete this purchase order item?')) return;

    try {
      await purchaseOrderItemsService.deletePurchaseOrderItem(id);
      alert('Purchase order item deleted successfully!');
      refetch();
    } catch (err: any) {
      console.error('Error deleting purchase order item:', err);
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to delete purchase order item';
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading purchase order items...
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

  const grandTotal = purchaseOrderItems.reduce((sum, item) => sum + item.Total, 0);

  return (
    <div >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2>All Purchase Order Items ({purchaseOrderItems.length})</h2>
        <div style={{
          padding: '15px 25px',
          backgroundColor: '#1976d2',
          borderRadius: '8px',
          color: 'white'
        }}>
          <div style={{ fontSize: '12px', marginBottom: '5px' }}>Grand Total</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {formatCurrency(grandTotal)}
          </div>
        </div>
      </div>
      
      {purchaseOrderItems.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No purchase order items found. Create your first purchase order item!
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
                <th style={tableHeaderStyle}>Item ID</th>
                <th style={tableHeaderStyle}>PO ID</th>
                <th style={tableHeaderStyle}>Item ID</th>
                <th style={tableHeaderStyle}>Quantity</th>
                <th style={tableHeaderStyle}>Unit Price</th>
                <th style={tableHeaderStyle}>Total</th>
                {/* <th style={tableHeaderStyle}>Created By</th>
                <th style={tableHeaderStyle}>Created At</th>
                <th style={tableHeaderStyle}>Modified By</th>
                <th style={tableHeaderStyle}>Modified At</th> */}
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrderItems.map((item) => (
                <tr key={item.POItemId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tableCellStyle}>
                    <strong style={{ color: '' }}>{item.POItemId}</strong>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e3f2fd', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      PO #{item.POId}
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
                      {item.Quantity.toLocaleString()}
                    </strong>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                      {formatCurrency(item.UnitPrice)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      color: '', 
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      {formatCurrency(item.Total)}
                    </span>
                  </td>
                  {/* <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e8f5e9', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(item.CreatedBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(item.CreatedAt)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#fff3e0', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(item.ModifiyBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(item.ModifiyAt)}
                    </span>
                  </td> */}
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {onEdit && (
                        <button
                          onClick={() => {
                            console.log('Editing purchase order item:', item);
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
                        onClick={() => handleDelete(item.POItemId)}
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
            <tfoot>
              <tr style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                <td colSpan={5} style={{ ...tableCellStyle, textAlign: 'right', fontSize: '16px' }}>
                  Grand Total:
                </td>
                <td style={{ ...tableCellStyle, fontSize: '18px', color: '#1565c0' }}>
                  {formatCurrency(grandTotal)}
                </td>
                <td colSpan={5}></td>
              </tr>
            </tfoot>
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