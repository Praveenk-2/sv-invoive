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

  // Common role suggestions
  const roleSuggestions = [
    { name: 'Administrator', icon: '👑', description: 'Full system access and control' },
    { name: 'Manager', icon: '👔', description: 'Manage teams and operations' },
    { name: 'Supervisor', icon: '👨‍💼', description: 'Oversee daily operations' },
    { name: 'Employee', icon: '👤', description: 'Standard user access' },
    { name: 'Guest', icon: '🚶', description: 'Limited read-only access' },
    { name: 'Developer', icon: '💻', description: 'Technical development access' },
    { name: 'Support', icon: '🎧', description: 'Customer support access' },
    { name: 'Sales', icon: '💼', description: 'Sales operations access' },
  ];

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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label htmlFor="RoleId" style={labelStyle}>
              Role ID *
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

        {!roleToEdit && (
          <div style={{ marginTop: '20px' }}>
            <label style={{ ...labelStyle, marginBottom: '10px' }}>
              Quick Role Suggestions (Click to use)
            </label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '10px',
              marginTop: '10px'
            }}>
              {roleSuggestions.map((suggestion) => (
                <div
                  key={suggestion.name}
                  onClick={() => handleRoleSuggestionClick(suggestion.name)}
                  style={{
                    padding: '12px',
                    backgroundColor: formData.RoleName === suggestion.name ? '#1976d2' : 'white',
                    color: formData.RoleName === suggestion.name ? 'white' : '#333',
                    border: '2px solid',
                    borderColor: formData.RoleName === suggestion.name ? '#1976d2' : '#e0e0e0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (formData.RoleName !== suggestion.name) {
                      e.currentTarget.style.borderColor = '#1976d2';
                      e.currentTarget.style.backgroundColor = '#e3f2fd';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (formData.RoleName !== suggestion.name) {
                      e.currentTarget.style.borderColor = '#e0e0e0';
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '20px' }}>{suggestion.icon}</span>
                    <strong style={{ fontSize: '14px' }}>{suggestion.name}</strong>
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.8 }}>
                    {suggestion.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '4px',
          fontSize: '13px'
        }}>
          <strong>🎭 Role Info:</strong> Roles define user responsibilities and can be linked 
          to specific privileges for access control throughout the system.
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