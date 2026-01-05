// Component to display list of user role assignments
'use client';

import React from 'react';
import { useUserRoles } from '@/hooks/useUserRoles';
import { userRoleService } from '@/services/userRoleService';
import { UserRole } from '@/types/userRole.types';

interface UserRoleListProps {
  onEdit?: (userRole: UserRole) => void;
}

export default function UserRoleList({ onEdit }: UserRoleListProps) {
  const { userRoles, loading, error, refetch } = useUserRoles();

  const handleDelete = async (id: number) => {
    console.log('Deleting user role with ID:', id);
    
    if (!confirm('Are you sure you want to delete this user role assignment?')) return;

    try {
      await userRoleService.deleteUserRole(id);
      alert('User role deleted successfully!');
      refetch();
    } catch (err: any) {
      console.error('Error deleting user role:', err);
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to delete user role';
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

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading user roles...
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
      <h2>All User Role Assignments ({userRoles.length})</h2>
      
      {userRoles.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No user role assignments found. Assign a role to a user!
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }} className='scroll-bar'>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            marginTop: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            minWidth: '1100px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                <th style={tableHeaderStyle}>UserRole ID</th>
                <th style={tableHeaderStyle}>User ID</th>
                <th style={tableHeaderStyle}>Role ID</th>
                {userRoles.some(ur => ur.Username) && (
                  <th style={tableHeaderStyle}>Username</th>
                )}
                {userRoles.some(ur => ur.RoleName) && (
                  <th style={tableHeaderStyle}>Role Name</th>
                )}
                <th style={tableHeaderStyle}>Created By</th>
                <th style={tableHeaderStyle}>Created At</th>
                <th style={tableHeaderStyle}>Modified By</th>
                <th style={tableHeaderStyle}>Modified At</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userRoles.map((userRole) => (
                <tr key={userRole.UserRoleId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tableCellStyle}>{userRole.UserRoleId}</td>
                  <td style={tableCellStyle}>{userRole.UserId}</td>
                  <td style={tableCellStyle}>{userRole.RoleId}</td>
                  {userRole.Username && (
                    <td style={tableCellStyle}>
                      <strong>{userRole.Username}</strong>
                    </td>
                  )}
                  {userRole.RoleName && (
                    <td style={tableCellStyle}>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}>
                        {userRole.RoleName}
                      </span>
                    </td>
                  )}
                  <td style={tableCellStyle}>{userRole.CreatedBy || '-'}</td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(userRole.CreatedAt)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>{userRole.ModifiyBy || '-'}</td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(userRole.ModifiyAt)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {onEdit && (
                        <button
                          onClick={() => {
                            console.log('Editing user role:', userRole);
                            onEdit(userRole);
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
                        onClick={() => handleDelete(userRole.UserRoleId)}
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