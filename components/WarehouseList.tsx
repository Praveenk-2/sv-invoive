// components/WarehouseList.tsx
// Component to display list of warehouses
'use client';

import React from 'react';
import { useWarehouses } from '@/hooks/useWarehouse';
import { warehouseService } from '@/services/warehouseService';
import { Warehouse } from '@/types/warehouse.types';

interface WarehouseListProps {
  onEdit?: (warehouse: Warehouse) => void;
}

export default function WarehouseList({ onEdit }: WarehouseListProps) {
  const { warehouses, loading, error, refetch } = useWarehouses();

  const handleDelete = async (id: number) => {
    console.log('Deleting warehouse with ID:', id);
    
    if (!confirm('Are you sure you want to delete this warehouse?')) return;

    try {
      await warehouseService.deleteWarehouse(id);
      alert('Warehouse deleted successfully!');
      refetch();
    } catch (err: any) {
      console.error('Error deleting warehouse:', err);
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to delete warehouse';
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

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading warehouses...
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
      <h2>All Warehouses ({warehouses.length})</h2>
      
      {warehouses.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No warehouses found. Create your first warehouse!
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            marginTop: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            minWidth: '1100px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                <th style={tableHeaderStyle}>Warehouse ID</th>
                <th style={tableHeaderStyle}>Warehouse Name</th>
                <th style={tableHeaderStyle}>Location</th>
                <th style={tableHeaderStyle}>Status</th>
                {/* <th style={tableHeaderStyle}>Created By</th>
                <th style={tableHeaderStyle}>Created At</th>
                <th style={tableHeaderStyle}>Modified By</th>
                <th style={tableHeaderStyle}>Modified At</th> */}
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((warehouse) => (
                <tr key={warehouse.WarehouseId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tableCellStyle}>
                    <strong style={{ color: '' }}>{warehouse.WarehouseId}</strong>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {/* <span style={{ fontSize: '20px' }}>🏢</span> */}
                      <strong style={{ fontSize: '15px' }}>{warehouse.WarehouseName}</strong>
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '16px' }}>📍</span>
                      <span style={{ color: '#666' }}>{warehouse.Location}</span>
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: warehouse.IsActive ? '#4caf50' : '#f44336',
                      color: 'white',
                    }}>
                      {warehouse.IsActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {/* <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e3f2fd', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(warehouse.CreatedBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(warehouse.CreatedAt)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#fff3e0', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(warehouse.ModifiyBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(warehouse.ModifiyAt)}
                    </span>
                  </td> */}
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {onEdit && (
                        <button
                          onClick={() => {
                            console.log('Editing warehouse:', warehouse);
                            onEdit(warehouse);
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
                        onClick={() => handleDelete(warehouse.WarehouseId)}
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