// app/warehouses/page.tsx
// Complete Warehouses management page
'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import WarehouseList from '@/components/WarehouseList';
import WarehouseForm from '@/components/WarehouseForm';
import { Warehouse } from '@/types/warehouse.types';

export default function WarehousesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingWarehouse(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingWarehouse(null);
  };

  const handleCreateNew = () => {
    setEditingWarehouse(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '20px', maxWidth: '1500px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid #1976d2'
        }}>
          <div>
            <h1 style={{ margin: 0, color: '#1976d2' }}>Warehouse Management</h1>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
              Manage warehouse locations and facilities with complete audit trail
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
            + Create New Warehouse
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl p-6 relative max-h-[90vh] overflow-y-auto scroll-bar">
              <button
                onClick={handleCancel}
                className="absolute top-1 right-1 text-gray-500 hover:text-red-500 text-xl cursor-pointer"
              >
                ✕
              </button>
              <WarehouseForm 
                warehouseToEdit={editingWarehouse}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}

        <WarehouseList key={refreshKey} onEdit={handleEdit} />
      </div>
    </DashboardLayout>
  );
}