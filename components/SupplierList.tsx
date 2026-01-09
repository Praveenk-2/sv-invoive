// Component to display list of suppliers
'use client';

import React, { useState } from 'react';
import { useSuppliers } from '@/hooks/useSuppliers';
import { supplierService } from '@/services/supplierService';
import { Supplier } from '@/types/supplier.types';

interface SupplierListProps {
  onEdit?: (supplier: Supplier) => void;
}

export default function SupplierList({ onEdit }: SupplierListProps) {
  const { suppliers, loading, error, refetch } = useSuppliers();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id: number) => {
    console.log('Deleting supplier with ID:', id);
    
    if (!confirm('Are you sure you want to delete this supplier?')) return;

    try {
      await supplierService.deleteSupplier(id);
      alert('Supplier deleted successfully!');
      refetch();
    } catch (err: any) {
      console.error('Error deleting supplier:', err);
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to delete supplier';
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

  // Filter suppliers based on search
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.SupplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.Contact.includes(searchTerm) ||
    supplier.GSTNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading suppliers...
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2>All Suppliers ({filteredSuppliers.length})</h2>
        
        <input
          type="text"
          placeholder="Search by name, email, contact, or GST..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '350px',
          }}
        />
      </div>
      
      {filteredSuppliers.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          {searchTerm ? 'No suppliers found matching your search.' : 'No suppliers found. Add your first supplier!'}
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
                <th style={tableHeaderStyle}>ID</th>
                <th style={tableHeaderStyle}>Supplier Name</th>
                <th style={tableHeaderStyle}>Contact</th>
                <th style={tableHeaderStyle}>Email</th>
                <th style={tableHeaderStyle}>GST Number</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Created At</th>
                <th style={tableHeaderStyle}>Created By</th>
                <th style={tableHeaderStyle}>Modified By</th>
                <th style={tableHeaderStyle}>Modified At</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.SupplierId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tableCellStyle}>{supplier.SupplierId}</td>
                  <td style={tableCellStyle}>
                    <strong style={{ color: '#524f4f' }}>{supplier.SupplierName}</strong>
                    {supplier.Address && (
                      <div style={{ fontSize: '11px', color: '#524f4f', marginTop: '4px' }}>
                        {supplier.Address.substring(0, 40)}
                        {supplier.Address.length > 40 && '...'}
                      </div>
                    )}
                  </td>
                  <td style={tableCellStyle}>
                    <a 
                      href={`tel:${supplier.Contact}`}
                      style={{ color: '#1976d2', textDecoration: 'none' }}
                    >
                      {supplier.Contact}
                    </a>
                  </td>
                  <td style={tableCellStyle}>
                    <a 
                      href={`mailto:${supplier.Email}`}
                      style={{ color: '#1976d2', textDecoration: 'none' }}
                    >
                      {supplier.Email}
                    </a>
                  </td>
                  <td style={tableCellStyle}>
                    <code style={{ 
                      backgroundColor: '#f5f5f5', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {supplier.GSTNumber}
                    </code>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: supplier.IsActive ? '#4caf50' : '#f44336',
                      color: 'white',
                    }}>
                      {supplier.IsActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(supplier.CreatedAt)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e3f2fd', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(supplier.CreatedBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#fff3e0', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(supplier.ModifiyBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(supplier.ModifiyAt)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {onEdit && (
                        <button
                          onClick={() => {
                            console.log('Editing supplier:', supplier);
                            onEdit(supplier);
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
                        onClick={() => handleDelete(supplier.SupplierId)}
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