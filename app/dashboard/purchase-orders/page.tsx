'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PurchaseOrdersList from '@/components/PurchaseOrdersList';
import PurchaseOrdersForm from '@/components/PurchaseOrdersForm';
import { PurchaseOrder } from '@/types/purchaseOrders.types';

export default function PurchaseOrdersPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (po: PurchaseOrder) => {
    setEditingPO(po);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingPO(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPO(null);
  };

  const handleCreateNew = () => {
    setEditingPO(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid #1976d2'
        }}>
          <div>
            <h1 style={{ margin: 0, color: '#1976d2' }}>Purchase Orders Management</h1>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
              Manage purchase orders with supplier tracking and status monitoring
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
            + Create New Order
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
            <PurchaseOrdersForm 
              poToEdit={editingPO}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
        )}

        <PurchaseOrdersList key={refreshKey} onEdit={handleEdit} />
      </div>
    </DashboardLayout>
  );
}