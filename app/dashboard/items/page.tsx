// Complete Items management page with all CRUD operations
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

        {showForm && (
          <div style={{ marginBottom: '30px' }}>
            <ItemForm 
              itemToEdit={editingItem}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        )}

        <ItemList key={refreshKey} onEdit={handleEdit} />
      </div>
    </DashboardLayout>
  );
}