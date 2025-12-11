// Component to create or update user role assignments
'use client';

import React, { useState, useEffect } from 'react';
import { userRoleService } from '@/services/userRoleService';
import { CreateUserRoleRequest, UserRole } from '@/types/userRole.types';
import { useUsers } from '@/hooks/useUsers';
import { useRoles } from '@/hooks/useRoles';

interface UserRoleFormProps {
  userRoleToEdit?: UserRole | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function UserRoleForm({ userRoleToEdit, onSuccess, onCancel }: UserRoleFormProps) {
  const { users, loading: usersLoading } = useUsers();
  const { roles, loading: rolesLoading } = useRoles();
  
  const [formData, setFormData] = useState<CreateUserRoleRequest>({
    UserRoleId: 0,
    UserId: 0,
    RoleId: 0,
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
      });
    } else {
      setFormData({
        UserRoleId: 0,
        UserId: 0,
        RoleId: 0,
      });
    }
  }, [userRoleToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.UserId === 0 || formData.RoleId === 0) {
      setError('Please select both a user and a role');
      return;
    }

    setSubmitting(true);
    console.log('Submitting form data:', formData);

    try {
      if (userRoleToEdit) {
        console.log('Updating user role with ID:', userRoleToEdit.UserRoleId);
        await userRoleService.updateUserRole(userRoleToEdit.UserRoleId, formData);
        alert('User role updated successfully!');
      } else {
        console.log('Creating new user role');
        await userRoleService.createUserRole(formData);
        alert('User role created successfully!');
      }

      setFormData({ UserRoleId: 0, UserId: 0, RoleId: 0 });
      
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting user role:', err);
      const errorMessage = err?.response?.data?.message || err.message || 'Operation failed';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value),
    });
  };

  const isLoading = usersLoading || rolesLoading;

  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading users and roles...
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '600px'
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
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="UserRoleId" style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold' 
          }}>
            UserRole ID *
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
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
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

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="UserId" style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold' 
          }}>
            Select User *
          </label>
          <select
            id="UserId"
            name="UserId"
            value={formData.UserId}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          >
            <option value={0}>-- Select User --</option>
            {users.map((user) => (
              <option key={user.UserId} value={user.UserId}>
                {user.UserId} - {user.Username} ({user.Email})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="RoleId" style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold' 
          }}>
            Select Role *
          </label>
          <select
            id="RoleId"
            name="RoleId"
            value={formData.RoleId}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          >
            <option value={0}>-- Select Role --</option>
            {roles.map((role) => (
              <option key={role.RoleId} value={role.RoleId}>
                {role.RoleId} - {role.RoleName}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
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