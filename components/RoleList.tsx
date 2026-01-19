// components/RoleList.tsx
// Component to display list of roles
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
    console.log('Deleting role with ID:', id);
    
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      await roleService.deleteRole(id);
      alert('Role deleted successfully!');
      refetch();
    } catch (err: any) {
      console.error('Error deleting role:', err);
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to delete role';
      alert(errorMsg);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserName = (userId: number) => {
    if (!userId) return '-';
    return `User #${userId}`;
  };

  const getRoleIcon = (roleName: string) => {
    const roleIcons: { [key: string]: string } = {
      '': '👑',
      '': '👑',
      '': '👔',
      '': '👨‍💼',
      '': '👤',
      '': '👤',
      '': '🚶',
      '': '💻',
      '': '🎧',
      '': '💼',
    };

    for (const [key, icon] of Object.entries(roleIcons)) {
      if (roleName.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    return ''; // Default icon
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
      <h2>All Roles ({roles.length})</h2>
      
      {roles.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No roles found. Create your first role!
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            marginTop: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            minWidth: '1000px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                <th style={tableHeaderStyle}>Role ID</th>
                <th style={tableHeaderStyle}>Role Name</th>
                {/* <th style={tableHeaderStyle}>Created By</th>
                <th style={tableHeaderStyle}>Created At</th>
                <th style={tableHeaderStyle}>Modified By</th>
                <th style={tableHeaderStyle}>Modified At</th> */}
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.RoleId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tableCellStyle}>
                    <strong style={{ color: '', fontSize: '16px' }}>{role.RoleId}</strong>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* <span style={{ fontSize: '24px' }}>{(role.RoleName)}</span> */}
                      <strong style={{ fontSize: '16px', color: '#524f4f' }}>{role.RoleName}</strong>
                    </div>
                  </td>
                  {/* <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e3f2fd', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(role.CreatedBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(role.CreatedAt)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#fff3e0', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(role.ModifiyBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(role.ModifiyAt)}
                    </span>
                  </td> */}
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {onEdit && (
                        <button
                          onClick={() => {
                            console.log('Editing role:', role);
                            onEdit(role);
                          }}
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
        </div>
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