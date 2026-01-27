// components/UserRoleList.tsx
// Component to display list of user role assignments
'use client';

import React from 'react';
import { useUserRoles } from '@/hooks/useUserRole';
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
      alert('User role assignment deleted successfully!');
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

  const getUserName = (userId: number) => {
    if (!userId) return '-';
    return `User #${userId}`;
  };

  const getRoleName = (roleId: number) => {
    if (!roleId) return '-';
    return `Role #${roleId}`;
  };

  if (loading) {
    return (
      <div style={{textAlign: 'center' }}>
        Loading user role assignments...
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
          No user role assignments found. Assign your first user role!
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            marginTop: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            minWidth: '1100px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                <th style={tableHeaderStyle}>Assignment ID</th>
                <th style={tableHeaderStyle}>User ID</th>
                <th style={tableHeaderStyle}>Role ID</th>
                {/* <th style={tableHeaderStyle}>Created By</th>
                <th style={tableHeaderStyle}>Created At</th>
                <th style={tableHeaderStyle}>Modified By</th>
                <th style={tableHeaderStyle}>Modified At</th> */}
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userRoles.map((userRole) => (
                <tr key={userRole.UserRoleId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tableCellStyle}>
                    <strong style={{ color: '', fontSize: '16px' }}>
                      {userRole.UserRoleId}
                    </strong>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {/* <span style={{ fontSize: '18px' }}>👤</span> */}
                      {/* <span style={{ 
                        backgroundColor: '#e3f2fd', 
                        padding: '6px 12px', 
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}> */}
                        {getUserName(userRole.UserId)}
                      {/* </span> */}
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {/* <span style={{ fontSize: '18px' }}>🎭</span> */}
                      {/* <span style={{ 
                        backgroundColor: '#f3e5f5', 
                        padding: '6px 12px', 
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '14px' */}
                      {/* }}> */}
                        {getRoleName(userRole.RoleId)}
                      {/* </span> */}
                    </div>
                  </td>
                  {/* <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e3f2fd', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(userRole.CreatedBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(userRole.CreatedAt)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#fff3e0', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(userRole.ModifiyBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(userRole.ModifiyAt)}
                    </span>
                  </td> */}
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