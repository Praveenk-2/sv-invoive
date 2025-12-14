// Complete Items management page with modal popup form
'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ItemList from '@/components/ItemList';
import ItemForm from '@/components/ItemForm';
import { Item } from '@/types/item.types';

export default function ItemsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingItem(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleCreateNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '20px', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid #1976d2'
        }}>
          <div>
            <h1 style={{ margin: 0, color: '#1976d2' }}>Item Management</h1>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
              Manage your inventory items, pricing, and stock levels
            </p>
          </div>
          <button
            onClick={handleCreateNew}
            style={{
              padding: '12px 24px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            + Create New Item
          </button>
        </div>

        <ItemList key={refreshKey} onEdit={handleEdit} />
      </div>

      {/* Modal Overlay */}
      {showForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={handleCancel}
        >
          {/* Modal Content */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.15)',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              backgroundColor: 'white',
              zIndex: 1,
            }}>
              <h2 style={{ margin: 0, color: '#1976d2' }}>
                {editingItem ? 'Edit Item' : 'Create New Item'}
              </h2>
              <button
                onClick={handleCancel}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px' }}>
              <ItemForm 
                itemToEdit={editingItem}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}