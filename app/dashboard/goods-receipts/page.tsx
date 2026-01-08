'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import GoodsReceiptList from '@/components/GoodsReceiptList';
import GoodsReceiptForm from '@/components/GoodsReceiptForm';
import { GoodsReceipt } from '@/types/goodsReceipt.types';

export default function GoodsReceiptsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingGRN, setEditingGRN] = useState<GoodsReceipt | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (grn: GoodsReceipt) => {
    setEditingGRN(grn);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingGRN(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGRN(null);
  };

  const handleCreateNew = () => {
    setEditingGRN(null);
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
            <h1 style={{ margin: 0, color: '#1976d2' }}>Goods Receipt Management</h1>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
              Manage goods receipt notes (GRN) and track inventory receiving
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
            + Create New GRN
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white w-full max-w-4xl rounded-lg shadow-xl p-6 relative max-h-[90vh] overflow-y-auto scroll-bar">
              <button
                onClick={handleCancel}
                className="absolute top-1 right-1 text-gray-500 hover:text-red-500 text-xl cursor-pointer"
              >
                ✕
              </button>
              <GoodsReceiptForm 
                grnToEdit={editingGRN}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}

        <GoodsReceiptList key={refreshKey} onEdit={handleEdit} />
      </div>
    </DashboardLayout>
  );
}