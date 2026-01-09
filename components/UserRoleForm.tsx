// components/UserRoleForm.tsx
// Component to create or update user role assignments
'use client';

import React, { useState, useEffect } from 'react';
import { userRoleService } from '@/services/userRoleService';
import { UserRole } from '@/types/userRole.types';
import { useAuth } from '@/context/AuthContext';

interface UserRoleFormProps {
  userRoleToEdit?: UserRole | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function UserRoleForm({ userRoleToEdit, onSuccess, onCancel }: UserRoleFormProps) {
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    UserRoleId: 0,
    UserId: 0,
    RoleId: 0,
    CreatedBy: currentUser?.id || 0,
    CreatedAt: new Date().toISOString(),
    ModifiyBy: 0,
    ModifiyAt: null as string | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userRoleToEdit) {
      console.log('Editing user role:', userRoleToEdit);
      setFormData({
        UserRoleId: userRoleToEdit.UserRoleId,
        UserId: userRoleToEdit.UserId,
        RoleId: userRoleToEdit.RoleId,
        CreatedBy: userRoleToEdit.CreatedBy,
        CreatedAt: userRoleToEdit.CreatedAt,
        ModifiyBy: currentUser?.id || 0,
        ModifiyAt: new Date().toISOString(),
      });
    } else {
      setFormData({
        UserRoleId: 0,
        UserId: 0,
        RoleId: 0,
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });
    }
  }, [userRoleToEdit, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    console.log('Form data before sending:', formData);

    try {
      if (userRoleToEdit) {
        console.log('Updating user role with ID:', userRoleToEdit.UserRoleId);
        await userRoleService.updateUserRole(userRoleToEdit.UserRoleId, {
          ...formData,
          ModifiyAt: new Date().toISOString()
        });
        alert('User role assignment updated successfully!');
      } else {
        console.log('Creating new user role assignment');
        await userRoleService.createUserRole({
          ...formData,
          ModifiyAt: new Date().toISOString()
        });
        alert('User role assignment created successfully!');
      }

      setFormData({
        UserRoleId: 0,
        UserId: 0,
        RoleId: 0,
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting user role:', err);
      console.error('Error response:', err?.response?.data);
      const errorMessage = err?.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(', ')
        : err?.response?.data?.message || err.message || 'Operation failed';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '700px'
    }}>
      <h2>{userRoleToEdit ? 'Edit User Role Assignment' : 'Create New User Role Assignment'}</h2>

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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
          <div>
            <label htmlFor="UserRoleId" style={labelStyle}>
              User Role Assignment ID *
            </label>
            <input
              type="number"
              id="UserRoleId"
              name="UserRoleId"
              value={formData.UserRoleId}
              onChange={handleChange}
              required
              disabled={!!userRoleToEdit}
              style={{
                ...inputStyle,
                backgroundColor: userRoleToEdit ? '#e0e0e0' : 'white',
              }}
              placeholder="e.g., 1"
            />
            {userRoleToEdit && (
              <small style={{ color: '#666', fontSize: '12px' }}>
                ID cannot be changed
              </small>
            )}
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '15px',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '2px solid #e0e0e0'
          }}>
            <div>
              <label htmlFor="UserId" style={labelStyle}>
                <span style={{ fontSize: '18px', marginRight: '8px' }}>👤</span>
                User ID *
              </label>
              <input
                type="number"
                id="UserId"
                name="UserId"
                value={formData.UserId}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="e.g., 1"
              />
              <small style={{ color: '#666', fontSize: '12px' }}>
                Select the user to assign a role
              </small>
            </div>

            <div>
              <label htmlFor="RoleId" style={labelStyle}>
                <span style={{ fontSize: '18px', marginRight: '8px' }}>🎭</span>
                Role ID *
              </label>
              <input
                type="number"
                id="RoleId"
                name="RoleId"
                value={formData.RoleId}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="e.g., 1"
              />
              <small style={{ color: '#666', fontSize: '12px' }}>
                Select the role to assign to the user
              </small>
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '4px',
          fontSize: '13px'
        }}>
          <strong>🔗 Assignment Info:</strong> This will link the selected user with the 
          specified role. The user will inherit all permissions and access rights associated 
          with that role.
        </div>

        <div style={{ 
          marginTop: '15px', 
          padding: '15px', 
          backgroundColor: '#fff3e0', 
          borderRadius: '4px',
          fontSize: '13px'
        }}>
          <strong>⚠️ Note:</strong> Make sure both the User ID and Role ID exist in their 
          respective tables before creating this assignment. A user can have multiple roles.
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
            {submitting ? 'Saving...' : (userRoleToEdit ? 'Update Assignment' : 'Create Assignment')}
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