// Complete Units management page with modal popup form
'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import UnitList from '@/components/UnitList';
import UnitForm from '@/components/UnitForm';
import { Unit } from '@/types/unit.types';

export default function UnitsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingUnit(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUnit(null);
  };

  const handleCreateNew = () => {
    setEditingUnit(null);
    setShowForm(true);
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
            <h1 style={{ margin: 0, color: '#1976d2' }}>📏 Unit Management</h1>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
              Define units of measurement for your items (kg, L, pcs, etc.)
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
            + Create New Unit
          </button>
        </div>

        <UnitList key={refreshKey} onEdit={handleEdit} />
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
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
              <button
                onClick={handleCancel}
                className="absolute top-1 right-1 text-gray-500 hover:text-red-500 text-xl cursor-pointer"
              >
                ✕
              </button>

            {/* Modal Body */}
            <div style={{ padding: '20px' }}>
              <UnitForm 
                unitToEdit={editingUnit}
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