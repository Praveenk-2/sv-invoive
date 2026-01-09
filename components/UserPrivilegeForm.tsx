// components/UserPrivilegeForm.tsx
// Component to create or update user privileges
'use client';

import React, { useState, useEffect } from 'react';
import { userPrivilegeService } from '@/services/userPrivilegeService';
import { UserPrivilege } from '@/types/userprivilege.types';
import { useAuth } from '@/context/AuthContext';

interface UserPrivilegeFormProps {
  privilegeToEdit?: UserPrivilege | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function UserPrivilegeForm({ privilegeToEdit, onSuccess, onCancel }: UserPrivilegeFormProps) {
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    UserId: 0,
    ScreenName: '',
    WritePermission: false,
    ReadPermission: false,
    CreatedBy: currentUser?.id || 0,
    CreatedDate: new Date().toISOString(),
    ModifiyBy: 0,
    ModifiyDate: null as string | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Common screen names for dropdown
  const commonScreens = [
    'Dashboard',
    'Users',
    'User Privileges',
    'Warehouses',
    'Stock Ledger',
    'Items',
    'Inventory',
    'Reports',
    'Settings',
    'Analytics',
  ];

  useEffect(() => {
    if (privilegeToEdit) {
      console.log('Editing user privilege:', privilegeToEdit);
      setFormData({
        UserId: privilegeToEdit.UserId,
        ScreenName: privilegeToEdit.ScreenName,
        WritePermission: privilegeToEdit.WritePermission,
        ReadPermission: privilegeToEdit.ReadPermission,
        CreatedBy: privilegeToEdit.CreatedBy,
        CreatedDate: privilegeToEdit.CreatedDate,
        ModifiyBy: currentUser?.id || 0,
        ModifiyDate: new Date().toISOString(),
      });
    } else {
      setFormData({
        UserId: 0,
        ScreenName: '',
        WritePermission: false,
        ReadPermission: false,
        CreatedBy: currentUser?.id || 0,
        CreatedDate: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyDate: null,
      });
    }
  }, [privilegeToEdit, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.ReadPermission && !formData.WritePermission) {
      setError('Please grant at least one permission (Read or Write)');
      return;
    }

    setSubmitting(true);
    console.log('Form data before sending:', formData);

    try {
      if (privilegeToEdit) {
        console.log('Updating user privilege for User ID:', privilegeToEdit.UserId);
        await userPrivilegeService.updateUserPrivilege(privilegeToEdit.UserId, {
          ...formData,
          ModifiyDate: new Date().toISOString()
        });
        alert('User privilege updated successfully!');
      } else {
        console.log('Creating new user privilege');
        await userPrivilegeService.createUserPrivilege({
          ...formData,
          ModifiyDate: new Date().toISOString()
        });
        alert('User privilege created successfully!');
      }

      setFormData({
        UserId: 0,
        ScreenName: '',
        WritePermission: false,
        ReadPermission: false,
        CreatedBy: currentUser?.id || 0,
        CreatedDate: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyDate: null,
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting user privilege:', err);
      console.error('Error response:', err?.response?.data);
      const errorMessage = err?.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(', ')
        : err?.response?.data?.message || err.message || 'Operation failed';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : name === 'UserId' ? Number(value) : value,
    });
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '700px'
    }}>
      <h2>{privilegeToEdit ? 'Edit User Privilege' : 'Create New User Privilege'}</h2>

      {error && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label htmlFor="UserId" style={labelStyle}>
              User ID *
            </label>
            <input
              type="number"
              id="UserId"
              name="UserId"
              value={formData.UserId}
              onChange={handleChange}
              required
              disabled={!!privilegeToEdit}
              style={{
                ...inputStyle,
                backgroundColor: privilegeToEdit ? '#e0e0e0' : 'white',
              }}
              placeholder="e.g., 1"
            />
            {privilegeToEdit && (
              <small style={{ color: '#666', fontSize: '12px' }}>
                User ID cannot be changed
              </small>
            )}
          </div>

          <div>
            <label htmlFor="ScreenName" style={labelStyle}>
              Screen Name *
            </label>
            <select
              id="ScreenName"
              name="ScreenName"
              value={formData.ScreenName}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">-- Select Screen --</option>
              {commonScreens.map((screen) => (
                <option key={screen} value={screen}>
                  {screen}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          backgroundColor: '#ffffff', 
          borderRadius: '8px',
          border: '2px solid #e0e0e0'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px', color: '#1976d2' }}>
            🔐 Permissions
          </h3>

          <div style={{ display: 'grid', gap: '15px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              backgroundColor: '#e3f2fd',
              borderRadius: '4px',
              cursor: 'pointer',
              border: formData.ReadPermission ? '2px solid #2196f3' : '2px solid transparent',
            }}>
              <input
                type="checkbox"
                name="ReadPermission"
                checked={formData.ReadPermission}
                onChange={handleChange}
                style={{
                  marginRight: '10px',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                }}
              />
              <div>
                <strong style={{ fontSize: '15px' }}>Read Permission</strong>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Allows user to view and read data on this screen
                </div>
              </div>
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              backgroundColor: '#e8f5e9',
              borderRadius: '4px',
              cursor: 'pointer',
              border: formData.WritePermission ? '2px solid #4caf50' : '2px solid transparent',
            }}>
              <input
                type="checkbox"
                name="WritePermission"
                checked={formData.WritePermission}
                onChange={handleChange}
                style={{
                  marginRight: '10px',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                }}
              />
              <div>
                <strong style={{ fontSize: '15px' }}>Write Permission</strong>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Allows user to create, edit, and delete data on this screen
                </div>
              </div>
            </label>
          </div>
        </div>

        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#fff3e0', 
          borderRadius: '4px',
          fontSize: '13px'
        }}>
          <strong>⚠️ Note:</strong> Write permission typically includes read permission. 
          Users with write access can both view and modify data.
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '16px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1,
              fontWeight: 'bold',
            }}
          >
            {submitting ? 'Saving...' : (privilegeToEdit ? 'Update Privilege' : 'Create Privilege')}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '16px',
                backgroundColor: '#757575',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: 'bold',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  border: '1px solid #ccc',
  borderRadius: '4px',
};