// components/StockLedgerList.tsx
// Component to display list of stock ledgers
'use client';

import React from 'react';
import { useStockLedgers } from '@/hooks/useStockLedger';
import { stockLedgerService } from '@/services/stockLedgerService';
import { StockLedger } from '@/types/Stockledger.types';

interface StockLedgerListProps {
  onEdit?: (stockLedger: StockLedger) => void;
}

export default function StockLedgerList({ onEdit }: StockLedgerListProps) {
  const { stockLedgers, loading, error, refetch } = useStockLedgers();

  const handleDelete = async (id: number) => {
    console.log('Deleting stock ledger with ID:', id);
    
    if (!confirm('Are you sure you want to delete this stock ledger entry?')) return;

    try {
      await stockLedgerService.deleteStockLedger(id);
      alert('Stock ledger entry deleted successfully!');
      refetch();
    } catch (err: any) {
      console.error('Error deleting stock ledger:', err);
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to delete stock ledger';
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

  const getChangeTypeBadge = (changeType: string) => {
    const colors: { [key: string]: { bg: string; text: string } } = {
      'IN': { bg: '#4caf50', text: 'white' },
      'OUT': { bg: '#f44336', text: 'white' },
      'ADJUSTMENT': { bg: '#ff9800', text: 'white' },
      'RETURN': { bg: '#2196f3', text: 'white' },
    };

    const color = colors[changeType.toUpperCase()] || { bg: '#757575', text: 'white' };

    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        backgroundColor: color.bg,
        color: color.text,
      }}>
        {changeType}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading stock ledgers...
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
      <h2>All Stock Ledger Entries ({stockLedgers.length})</h2>
      
      {stockLedgers.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No stock ledger entries found. Create your first entry!
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
                <th style={tableHeaderStyle}>Ledger ID</th>
                <th style={tableHeaderStyle}>Item ID</th>
                <th style={tableHeaderStyle}>Warehouse ID</th>
                <th style={tableHeaderStyle}>Change Type</th>
                <th style={tableHeaderStyle}>Quantity</th>
                <th style={tableHeaderStyle}>Reference Type</th>
                <th style={tableHeaderStyle}>Reference ID</th>
                <th style={tableHeaderStyle}>Transaction Date</th>
                {/* <th style={tableHeaderStyle}>Created By</th>
                <th style={tableHeaderStyle}>Created At</th>
                <th style={tableHeaderStyle}>Modified By</th>
                <th style={tableHeaderStyle}>Modified At</th> */}
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stockLedgers.map((ledger) => (
                <tr key={ledger.LedgerId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tableCellStyle}>
                    <strong style={{ color: '' }}>{ledger.LedgerId}</strong>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e3f2fd', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}>
                      Item #{ledger.ItemId}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#f3e5f5', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '13px'
                    }}>
                      WH #{ledger.WarehouseId}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    {getChangeTypeBadge(ledger.ChangeType)}
                  </td>
                  <td style={tableCellStyle}>
                    <strong style={{ 
                      fontSize: '16px',
                      color: ledger.Quantity >= 0 ? '#4caf50' : '#f44336'
                    }}>
                      {ledger.Quantity >= 0 ? '+' : ''}{ledger.Quantity}
                    </strong>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#fff3e0', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {ledger.ReferenceType}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px' }}>
                      #{ledger.ReferenceId}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(ledger.TransactionDate)}
                    </span>
                  </td>
                  {/* <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e3f2fd', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(ledger.CreatedBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(ledger.CreatedAt)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#fff3e0', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(ledger.ModifiyBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(ledger.ModifiyAt)}
                    </span>
                  </td> */}
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {onEdit && (
                        <button
                          onClick={() => {
                            console.log('Editing stock ledger:', ledger);
                            onEdit(ledger);
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
                        onClick={() => handleDelete(ledger.LedgerId)}
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