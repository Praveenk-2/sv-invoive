// Complete Users management page with all CRUD operations
'use client';

import React, { useState } from 'react';
import UserList from '@/components/UserList';
import UserForm from '@/components/UserForm';
import { User } from '@/types/user.types';
import DashboardLayout from '@/components/DashboardLayout';

export default function UsersPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingUser(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleCreateNew = () => {
    setEditingUser(null);
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
          <h1 style={{ margin: 0, color: '#1976d2' }}>User Management</h1>
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
            + Create New User
          </button>
        </div>

        {showForm && (
          <div style={{ marginBottom: '30px' }}>
            <UserForm 
              userToEdit={editingUser}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        )}

        <UserList key={refreshKey} onEdit={handleEdit} />
      </div>
      </DashboardLayout>
  );
}