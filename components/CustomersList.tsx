'use client';

import React from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { customerService } from '@/services/customerService';
import { Customer } from '@/types/customer.types';

interface CustomersListProps {
  onEdit?: (customer: Customer) => void;
}

export default function CustomersList({ onEdit }: CustomersListProps) {
  const { customers, loading, error, refetch } = useCustomers();

  const handleDelete = async (id: number) => {
    console.log('Deleting customer with ID:', id);
    
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      await customerService.deleteCustomer(id);
      alert('Customer deleted successfully!');
      refetch();
    } catch (err: any) {
      console.error('Error deleting customer:', err);
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to delete customer';
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
        Loading customers...
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

  const activeCustomers = customers.filter(c => c.IsActive).length;
  const inactiveCustomers = customers.filter(c => !c.IsActive).length;

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
          <div style={{ fontSize: '14px', color: '#1976d2', marginBottom: '5px' }}>Total Customers</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1565c0' }}>{customers.length}</div>
        </div>
        <div style={{
          padding: '20px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          border: '2px solid #4caf50'
        }}>
          <div style={{ fontSize: '14px', color: '#2e7d32', marginBottom: '5px' }}>Active</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2e7d32' }}>{activeCustomers}</div>
        </div>
        <div style={{
          padding: '20px',
          backgroundColor: '#ffebee',
          borderRadius: '8px',
          border: '2px solid #f44336'
        }}>
          <div style={{ fontSize: '14px', color: '#c62828', marginBottom: '5px' }}>Inactive</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#c62828' }}>{inactiveCustomers}</div>
        </div>
      </div>

      <h2>All Customers ({customers.length})</h2>
      
      {customers.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No customers found. Create your first customer!
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
                <th style={tableHeaderStyle}>ID</th>
                <th style={tableHeaderStyle}>Customer Name</th>
                <th style={tableHeaderStyle}>Contact</th>
                <th style={tableHeaderStyle}>Email</th>
                <th style={tableHeaderStyle}>Address</th>
                <th style={tableHeaderStyle}>GST Number</th>
                <th style={tableHeaderStyle}>Status</th>
                {/* <th style={tableHeaderStyle}>Created By</th>
                <th style={tableHeaderStyle}>Created At</th>
                <th style={tableHeaderStyle}>Modified By</th> */}
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.CustomerId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tableCellStyle}>
                    <strong style={{ color: '#1976d2', fontSize: '16px' }}>
                      {customer.CustomerId}
                    </strong>
                  </td>
                  <td style={tableCellStyle}>
                    <strong style={{ fontSize: '15px', color: '#333' }}>
                      {customer.CustomerName}
                    </strong>
                  </td>
                  <td style={tableCellStyle}>
                    <a 
                      href={`tel:${customer.Contact}`}
                      style={{ 
                        color: '#1976d2', 
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      {customer.Contact}
                    </a>
                  </td>
                  <td style={tableCellStyle}>
                    <a 
                      href={`mailto:${customer.Email}`}
                      style={{ color: '#1976d2', textDecoration: 'none' }}
                    >
                      {customer.Email}
                    </a>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ 
                      maxWidth: '200px', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      fontSize: '13px',
                      color: '#666'
                    }}>
                      {customer.Address}
                    </div>
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
                      {customer.GSTNumber || 'N/A'}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: customer.IsActive ? '#4caf50' : '#f44336',
                      color: 'white',
                    }}>
                      {customer.IsActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {/* <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e8f5e9', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(customer.CreatedBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {formatDate(customer.CreatedAt)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#fff3e0', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(customer.ModifiyBy)}
                    </span>
                  </td> */}
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {onEdit && (
                        <button
                          onClick={() => {
                            console.log('Editing customer:', customer);
                            onEdit(customer);
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
                        onClick={() => handleDelete(customer.CustomerId)}
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