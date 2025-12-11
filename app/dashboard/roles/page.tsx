// app/roles/page.tsx
// Complete Roles management page with all CRUD operations
'use client';
import React, { useState } from 'react';
import RoleList from '@/components/RoleList';
import RoleForm from '@/components/RoleForm';
import DashboardLayout from '@/components/DashboardLayout';
import { Role } from '@/types/role.types';

export default function RolesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingRole(null);
    setRefreshKey(prev => prev + 1); // Force refresh the list
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRole(null);
  };

  const handleCreateNew = () => {
    setEditingRole(null);
    setShowForm(true);
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid #1976d2'
        }}>
          <h1 style={{ margin: 0, color: '#1976d2' }}>Role Management</h1>
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
            + Create New Role
          </button>
        </div>

        {showForm && (
          <div style={{ marginBottom: '30px' }}>
            <RoleForm
              roleToEdit={editingRole}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        )}

        <RoleList key={refreshKey} onEdit={handleEdit} />
      </div>
    </DashboardLayout>

  );
}
