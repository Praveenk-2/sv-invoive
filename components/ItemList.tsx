// Component to display list of items
'use client';

import React, { useState } from 'react';
import { useItems } from '@/hooks/useItems';
import { itemService } from '@/services/itemService';
import { Item } from '@/types/item.types';

interface ItemListProps {
  onEdit?: (item: Item) => void;
}

export default function ItemList({ onEdit }: ItemListProps) {
  const { items, loading, error, refetch } = useItems();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id: number) => {
    console.log('Deleting item with ID:', id);
    
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await itemService.deleteItem(id);
      alert('Item deleted successfully!');
      refetch();
    } catch (err: any) {
      console.error('Error deleting item:', err);
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to delete item';
      alert(errorMsg);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Filter items based on search
  const filteredItems = items.filter(item =>
    item.ItemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.SKU.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.Barcode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading items...
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2>All Items ({filteredItems.length})</h2>
        
        <input
          type="text"
          placeholder="Search by name, SKU, or barcode..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '300px',
          }}
        />
      </div>
      
      {filteredItems.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          {searchTerm ? 'No items found matching your search.' : 'No items found. Create your first item!'}
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            marginTop: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            minWidth: '1200px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                <th style={tableHeaderStyle}>ID</th>
                <th style={tableHeaderStyle}>Item Name</th>
                <th style={tableHeaderStyle}>SKU</th>
                <th style={tableHeaderStyle}>Barcode</th>
                <th style={tableHeaderStyle}>Unit Price</th>
                <th style={tableHeaderStyle}>Reorder Level</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Created</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.ItemId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tableCellStyle}>{item.ItemId}</td>
                  <td style={tableCellStyle}>
                    <strong>{item.ItemName}</strong>
                    {item.Description && (
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        {item.Description.substring(0, 50)}
                        {item.Description.length > 50 && '...'}
                      </div>
                    )}
                  </td>
                  <td style={tableCellStyle}>{item.SKU}</td>
                  <td style={tableCellStyle}>{item.Barcode}</td>
                  <td style={tableCellStyle}>
                    <strong>{formatPrice(item.UnitPrice)}</strong>
                  </td>
                  <td style={tableCellStyle}>{item.ReorderLevel}</td>
                  <td style={tableCellStyle}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: item.IsActive ? '#4caf50' : '#f44336',
                      color: 'white',
                    }}>
                      {item.IsActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={tableCellStyle}>{formatDate(item.CreatedAt)}</td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {onEdit && (
                        <button
                          onClick={() => {
                            console.log('Editing item:', item);
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
                        onClick={() => handleDelete(item.ItemId)}
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