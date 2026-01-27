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

  // Field-specific errors
  const [fieldErrors, setFieldErrors] = useState({
    UserId: '',
    RoleId: '',
  });

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
    // Clear errors when switching between create/edit modes
    setFieldErrors({
      UserId: '',
      RoleId: '',
    });
    setError('');
  }, [userRoleToEdit, currentUser]);

  // Validation functions
  const validateUserId = (userId: number): string => {
    if (!userId || userId === 0) return 'User ID is required';
    if (userId < 1) return 'User ID must be a positive number';
    return '';
  };

  const validateRoleId = (roleId: number): string => {
    if (!roleId || roleId === 0) return 'Role ID is required';
    if (roleId < 1) return 'Role ID must be a positive number';
    return '';
  };

  const handleBlur = (field: string) => {
    let errorMsg = '';
    
    switch (field) {
      case 'UserId':
        errorMsg = validateUserId(formData.UserId);
        break;
      case 'RoleId':
        errorMsg = validateRoleId(formData.RoleId);
        break;
    }

    setFieldErrors(prev => ({
      ...prev,
      [field]: errorMsg
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate all fields before submission
    const errors = {
      UserId: validateUserId(formData.UserId),
      RoleId: validateRoleId(formData.RoleId),
    };

    setFieldErrors(errors);

    // Check if there are any errors
    const hasErrors = Object.values(errors).some(err => err !== '');
    if (hasErrors) {
      setError('Please fill in all required fields correctly');
      return;
    }

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
      setFieldErrors({
        UserId: '',
        RoleId: '',
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting user role:', err);
      console.error('Error response:', err?.response?.data);
      
      // Handle different types of errors with user-friendly messages
      let errorMessage = '';
      
      if (err?.response?.status === 404) {
        errorMessage = 'User ID or Role ID not found in the database. Please check the IDs and try again.';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Unable to save user role assignment. Please verify that both User ID and Role ID exist in the system.';
      } else if (err?.response?.status === 400) {
        // Bad request - validation error from server
        errorMessage = err?.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(', ')
          : err?.response?.data?.message || 'Invalid data provided. Please check your entries.';
      } else if (err?.response?.data?.errors) {
        // Handle validation errors from server
        errorMessage = Object.values(err.response.data.errors).flat().join(', ');
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = 'Unable to complete the operation. Please try again.';
      } else {
        errorMessage = 'An unexpected error occurred. Please verify your data and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : Number(value);
    
    setFormData({
      ...formData,
      [name]: numValue,
    });

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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
          {userRoleToEdit && (
            <div>
              <label htmlFor="UserRoleId" style={labelStyle}>
                User Role Assignment ID
              </label>
              <input
                type="number"
                id="UserRoleId"
                name="UserRoleId"
                value={formData.UserRoleId}
                onChange={handleChange}
                disabled={!!userRoleToEdit}
                style={{
                  ...inputStyle,
                  backgroundColor: '#e0e0e0',
                }}
                placeholder="e.g., 1"
              />
              <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                ID cannot be changed
              </small>
            </div>
          )}

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
                User ID *
              </label>
              <input
                type="number"
                id="UserId"
                name="UserId"
                value={formData.UserId || ''}
                onChange={handleChange}
                onBlur={() => handleBlur('UserId')}
                required
                min="1"
                style={{
                  ...inputStyle,
                  borderColor: fieldErrors.UserId ? '#c62828' : '#ccc'
                }}
                placeholder="e.g., 1"
              />
              {fieldErrors.UserId && (
                <small style={errorTextStyle}>{fieldErrors.UserId}</small>
              )}
              <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                Select the user to assign a role
              </small>
            </div>

            <div>
              <label htmlFor="RoleId" style={labelStyle}>
                Role ID *
              </label>
              <input
                type="number"
                id="RoleId"
                name="RoleId"
                value={formData.RoleId || ''}
                onChange={handleChange}
                onBlur={() => handleBlur('RoleId')}
                required
                min="1"
                style={{
                  ...inputStyle,
                  borderColor: fieldErrors.RoleId ? '#c62828' : '#ccc'
                }}
                placeholder="e.g., 1"
              />
              {fieldErrors.RoleId && (
                <small style={errorTextStyle}>{fieldErrors.RoleId}</small>
              )}
              <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                Select the role to assign to the user
              </small>
            </div>
          </div>
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

const errorTextStyle: React.CSSProperties = {
  color: '#c62828',
  fontSize: '12px',
  display: 'block',
  marginTop: '4px',
  fontWeight: '500'
};