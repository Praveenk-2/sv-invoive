// components/UserPrivilegeList.tsx
// Component to display list of user privileges
'use client';

import React from 'react';
import { useUserPrivileges } from '@/hooks/useUserPrivilege';
import { userPrivilegeService } from '@/services/userPrivilegeService';
import { UserPrivilege } from '@/types/userprivilege.types';

interface UserPrivilegeListProps {
  onEdit?: (privilege: UserPrivilege) => void;
}

export default function UserPrivilegeList({ onEdit }: UserPrivilegeListProps) {
  const { userPrivileges, loading, error, refetch } = useUserPrivileges();

  const handleDelete = async (userId: number) => {
    console.log('Deleting user privilege for User ID:', userId);
    
    if (!confirm('Are you sure you want to delete this user privilege?')) return;

    try {
      await userPrivilegeService.deleteUserPrivilege(userId);
      alert('User privilege deleted successfully!');
      refetch();
    } catch (err: any) {
      console.error('Error deleting user privilege:', err);
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to delete user privilege';
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

  const getPermissionBadge = (hasPermission: boolean, type: 'read' | 'write') => {
    const colors = {
      read: { yes: '#2196f3', no: '#bdbdbd' },
      write: { yes: '#4caf50', no: '#bdbdbd' }
    };

    const color = hasPermission ? colors[type].yes : colors[type].no;

    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        backgroundColor: color,
        color: 'white',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {hasPermission ? '✓' : '✗'} {type === 'read' ? 'Read' : 'Write'}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading user privileges...
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
      <h2>All User Privileges ({userPrivileges.length})</h2>
      
      {userPrivileges.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No user privileges found. Create your first privilege assignment!
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            marginTop: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            minWidth: '1200px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                <th style={tableHeaderStyle}>User ID</th>
                <th style={tableHeaderStyle}>Screen Name</th>
                <th style={tableHeaderStyle}>Read Permission</th>
                <th style={tableHeaderStyle}>Write Permission</th>
                <th style={tableHeaderStyle}>Created By</th>
                <th style={tableHeaderStyle}>Created Date</th>
                <th style={tableHeaderStyle}>Modified By</th>
                <th style={tableHeaderStyle}>Modified Date</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userPrivileges.map((privilege, index) => (
                <tr key={`${privilege.UserId}-${privilege.ScreenName}-${index}`} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e3f2fd', 
                      padding: '6px 12px', 
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      color: '#1976d2'
                    }}>
                      User #{privilege.UserId}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>🖥️</span>
                      <strong style={{ fontSize: '15px' }}>{privilege.ScreenName}</strong>
                    </div>
                  </td>
                  <td style={tableCellStyle}>
                    {getPermissionBadge(privilege.ReadPermission, 'read')}
                  </td>
                  <td style={tableCellStyle}>
                    {getPermissionBadge(privilege.WritePermission, 'write')}
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e3f2fd', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(privilege.CreatedBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(privilege.CreatedDate)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#fff3e0', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(privilege.ModifiyBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(privilege.ModifiyDate)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {onEdit && (
                        <button
                          onClick={() => {
                            console.log('Editing user privilege:', privilege);
                            onEdit(privilege);
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
                        onClick={() => handleDelete(privilege.UserId)}
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