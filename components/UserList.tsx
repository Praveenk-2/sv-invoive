// Component to display list of users
'use client';

import React from 'react';
import { useUsers } from '@/hooks/useUsers';
import { userService } from '@/services/userService';
import { User } from '@/types/user.types';

interface UserListProps {
  onEdit?: (user: User) => void;
}

export default function UserList({ onEdit }: UserListProps) {
  const { users, loading, error, refetch } = useUsers();

  const handleDelete = async (id: number) => {
    console.log('Deleting user with ID:', id);
    
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await userService.deleteUser(id);
      alert('User deleted successfully!');
      refetch();
    } catch (err: any) {
      console.error('Error deleting user:', err);
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to delete user';
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

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading users...
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
    <div >
      <h2>All Users ({users.length})</h2>
      
      {users.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No users found. Create your first user!
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
                <th style={tableHeaderStyle}>User ID</th>
                <th style={tableHeaderStyle}>Username</th>
                <th style={tableHeaderStyle}>Email</th>
                <th style={tableHeaderStyle}>Status</th>
                {/* <th style={tableHeaderStyle}>Created At</th>
                <th style={tableHeaderStyle}>Created By</th>
                <th style={tableHeaderStyle}>Modified By</th>
                <th style={tableHeaderStyle}>Modified At</th> */}
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.UserId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tableCellStyle}>{user.UserId}</td>
                  <td style={tableCellStyle}>
                    <strong style={{ color: '#524f4f' }}>{user.Username}</strong>
                  </td>
                  <td style={tableCellStyle}>
                    <a 
                      href={`mailto:${user.Email}`}
                      style={{ color: '#1976d2', textDecoration: 'none' }}
                    >
                      {user.Email}
                    </a>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: user.IsActive ? '#4caf50' : '#f44336',
                      color: 'white',
                    }}>
                      {user.IsActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {/* <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(user.CreatedAt)}
                    </span>
                  </td> */}
                  {/* <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e3f2fd', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(user.CreatedBy)}
                    </span>
                  </td> */}
                  {/* <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#fff3e0', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(user.ModifiyBy)}
                    </span>
                  </td> */}
                  {/* <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(user.ModifiyAt)}
                    </span>
                  </td> */}
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {onEdit && (
                        <button
                          onClick={() => {
                            console.log('Editing user:', user);
                            onEdit(user);
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
                        onClick={() => handleDelete(user.UserId)}
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