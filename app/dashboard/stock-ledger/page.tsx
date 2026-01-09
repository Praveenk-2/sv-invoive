// app/stock-ledger/page.tsx
// Complete Stock Ledger management page
'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StockLedgerList from '@/components/StockLedgerList';
import StockLedgerForm from '@/components/StockLedgerForm';
import { StockLedger } from '@/types/Stockledger.types';

export default function StockLedgerPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingLedger, setEditingLedger] = useState<StockLedger | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (ledger: StockLedger) => {
    setEditingLedger(ledger);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingLedger(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLedger(null);
  };

  const handleCreateNew = () => {
    setEditingLedger(null);
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
            <h1 style={{ margin: 0, color: '#1976d2' }}>Stock Ledger Management</h1>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
              Track all inventory movements and stock changes with complete audit trail
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
            + Add Stock Transaction
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
              <StockLedgerForm 
                ledgerToEdit={editingLedger}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}

        <StockLedgerList key={refreshKey} onEdit={handleEdit} />
      </div>
    </DashboardLayout>
  );
}