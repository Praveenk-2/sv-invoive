// components/RoleList.tsx
// Component to display list of roles with delete functionality
'use client';

import React from 'react';
import { useRoles } from '@/hooks/useRoles';
import { roleService } from '@/services/roleService';
import { Role } from '@/types/role.types';

interface RoleListProps {
  onEdit?: (role: Role) => void;
}

export default function RoleList({ onEdit }: RoleListProps) {
  const { roles, loading, error, refetch } = useRoles();

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      await roleService.deleteRole(id);
      alert('Role deleted successfully!');
      refetch(); // Refresh the list after deletion
    } catch (err) {
      console.error('Error deleting role:', err);
      alert('Failed to delete role');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading roles...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        color: '#d32f2f',
        backgroundColor: '#ffebee',
        borderRadius: '4px',
        margin: '20px'
      }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>All Roles</h2>
      
      {roles.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No roles found. Create your first role!</p>
      ) : (
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          marginTop: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
              <th style={tableHeaderStyle}>Role ID</th>
              <th style={tableHeaderStyle}>Role Name</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.RoleId} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={tableCellStyle}>{role.RoleId}</td>
                <td style={tableCellStyle}>{role.RoleName}</td>
                <td style={tableCellStyle}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {onEdit && (
                      <button
                        onClick={() => onEdit(role)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#1976d2',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(role.RoleId)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#d32f2f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  padding: '12px',
  textAlign: 'left',
  fontWeight: 'bold',
};

const tableCellStyle: React.CSSProperties = {
  padding: '12px',
};