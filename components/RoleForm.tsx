// components/RoleForm.tsx
// Component to create or update roles
'use client';

import React, { useState, useEffect } from 'react';
import { roleService } from '@/services/roleService';
import { Role } from '@/types/role.types';
import { useAuth } from '@/context/AuthContext';

interface RoleFormProps {
  roleToEdit?: Role | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RoleForm({ roleToEdit, onSuccess, onCancel }: RoleFormProps) {
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    RoleId: 0,
    RoleName: '',
    CreatedBy: currentUser?.id || 0,
    CreatedAt: new Date().toISOString(),
    ModifiyBy: 0,
    ModifiyAt: null as string | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (roleToEdit) {
      console.log('Editing role:', roleToEdit);
      setFormData({
        RoleId: roleToEdit.RoleId,
        RoleName: roleToEdit.RoleName,
        CreatedBy: roleToEdit.CreatedBy,
        CreatedAt: roleToEdit.CreatedAt,
        ModifiyBy: currentUser?.id || 0,
        ModifiyAt: new Date().toISOString(),
      });
    } else {
      setFormData({
        RoleId: 0,
        RoleName: '',
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });
    }
  }, [roleToEdit, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    console.log('Form data before sending:', formData);

    try {
      if (roleToEdit) {
        console.log('Updating role with ID:', roleToEdit.RoleId);
        await roleService.updateRole(roleToEdit.RoleId, {
          ...formData,
          ModifiyAt: new Date().toISOString()
        });
        alert('Role updated successfully!');
      } else {
        console.log('Creating new role');
        await roleService.createRole({
          ...formData,
          ModifiyAt: new Date().toISOString()
        });
        alert('Role created successfully!');
      }

      setFormData({
        RoleId: 0,
        RoleName: '',
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting role:', err);
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
      [name]: name === 'RoleId' ? Number(value) : value,
    });
  };

  const handleRoleSuggestionClick = (roleName: string) => {
    setFormData({
      ...formData,
      RoleName: roleName,
    });
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '700px'
    }}>
      <h2>{roleToEdit ? 'Edit Role' : 'Create New Role'}</h2>

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
        <div style={{ display: 'grid', gap: '15px'}}>
          <div>
            <label htmlFor="RoleId" style={labelStyle}>
              Role ID
            </label>
            <input
              type="number"
              id="RoleId"
              name="RoleId"
              value={formData.RoleId}
              onChange={handleChange}
              required
              disabled={!!roleToEdit}
              style={{
                ...inputStyle,
                backgroundColor: roleToEdit ? '#e0e0e0' : 'white',
              }}
              placeholder="e.g., 1"
            />
            {roleToEdit && (
              <small style={{ color: '#666', fontSize: '12px' }}>
                ID cannot be changed
              </small>
            )}
          </div>

          <div>
            <label htmlFor="RoleName" style={labelStyle}>
              Role Name *
            </label>
            <input
              type="text"
              id="RoleName"
              name="RoleName"
              value={formData.RoleName}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., Administrator"
            />
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
            {submitting ? 'Saving...' : (roleToEdit ? 'Update Role' : 'Create Role')}
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