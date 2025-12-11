// Complete UserRoles management page with all CRUD operations
'use client';
import React, { useState } from 'react';
import UserRoleList from '@/components/UserRoleList';
import UserRoleForm from '@/components/UserRoleForm';
import { UserRole } from '@/types/userRole.types';
import DashboardLayout from '@/components/DashboardLayout';

export default function UserRolesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingUserRole, setEditingUserRole] = useState<UserRole | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (userRole: UserRole) => {
    setEditingUserRole(userRole);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingUserRole(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUserRole(null);
  };

  const handleCreateNew = () => {
    setEditingUserRole(null);
    setShowForm(true);
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid #1976d2'
        }}>
          <div>
            <h1 style={{ margin: 0, color: '#1976d2' }}>User Role Management</h1>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
              Assign roles to users to control their permissions
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
            + Assign Role to User
          </button>
        </div>

        {showForm && (
          <div style={{ marginBottom: '30px' }}>
            <UserRoleForm 
              userRoleToEdit={editingUserRole}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        )}

        <UserRoleList key={refreshKey} onEdit={handleEdit} />
      </div>
    </DashboardLayout>
  );
}
