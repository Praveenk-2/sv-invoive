// components/RoleForm.tsx
// Component to create or update roles
'use client';

import React, { useState, useEffect } from 'react';
import { roleService } from '@/services/roleService';
import { CreateRoleRequest, Role } from '@/types/role.types';

interface RoleFormProps {
  roleToEdit?: Role | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RoleForm({ roleToEdit, onSuccess, onCancel }: RoleFormProps) {
  const [formData, setFormData] = useState<CreateRoleRequest>({
    RoleId: 0,
    RoleName: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Populate form if editing
  useEffect(() => {
    if (roleToEdit) {
      setFormData({
        RoleId: roleToEdit.RoleId,
        RoleName: roleToEdit.RoleName,
      });
    }
  }, [roleToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (roleToEdit) {
        // Update existing role using PUT /api/Roles/{id}
        await roleService.updateRole(roleToEdit.RoleId, formData);
        alert('Role updated successfully!');
      } else {
        // Create new role using POST /api/Roles
        await roleService.createRole(formData);
        alert('Role created successfully!');
      }

      // Reset form
      setFormData({ RoleId: 0, RoleName: '' });
      
      // Call success callback
      if (onSuccess) onSuccess();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err.message || 'Operation failed';
      setError(errorMessage);
      console.error('Error submitting role:', err);
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

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '500px'
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
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="RoleId" style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold' 
          }}>
            Role ID *
          </label>
          <input
            type="number"
            id="RoleId"
            name="RoleId"
            value={formData.RoleId}
            onChange={handleChange}
            required
            disabled={!!roleToEdit} // Disable ID field when editing
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: roleToEdit ? '#e0e0e0' : 'white',
            }}
            placeholder="e.g., 1, 2, 3"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="RoleName" style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontWeight: 'bold' 
          }}>
            Role Name *
          </label>
          <input
            type="text"
            id="RoleName"
            name="RoleName"
            value={formData.RoleName}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            placeholder="e.g., Administrator, Manager"
          />
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
