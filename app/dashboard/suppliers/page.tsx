'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import SupplierList from '@/components/SupplierList';
import SupplierForm from '@/components/SupplierForm';
import { Supplier } from '@/types/supplier.types';

export default function SuppliersPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingSupplier(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSupplier(null);
  };

  const handleCreateNew = () => {
    setEditingSupplier(null);
    setShowForm(true);
  };

  return (
    <DashboardLayout>
      <div className="p-5 max-w-[1700px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-5 border-b-2 border-blue-600">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              Supplier Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage suppliers, contacts, and GST information with full audit trail
            </p>
          </div>

          <button
            onClick={handleCreateNew}
            className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
          >
            + Add New Supplier
          </button>
        </div>

        {/* 🔥 Tailwind Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl p-6 relative max-h-[90vh] overflow-y-auto scroll-bar">
              <button
                onClick={handleCancel}
                className="absolute top-1 right-1 text-gray-500 hover:text-red-500 text-xl cursor-pointer"
              >
                ✕
              </button>

              <SupplierForm
                supplierToEdit={editingSupplier}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}

        <SupplierList key={refreshKey} onEdit={handleEdit} />
      </div>
    </DashboardLayout>
  );
}