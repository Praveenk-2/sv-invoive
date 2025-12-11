// Component to create or update users
'use client';

import React, { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import { CreateUserRequest, User } from '@/types/user.types';

interface UserFormProps {
  userToEdit?: User | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function UserForm({ userToEdit, onSuccess, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<CreateUserRequest>({
    UserId: 0,
    Username: '',
    PasswordHash: '',
    Email: '',
    IsActive: true,
    CreatedAt: new Date().toISOString(),
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userToEdit) {
      console.log('Editing user:', userToEdit);
      setFormData({
        UserId: userToEdit.UserId,
        Username: userToEdit.Username,
        PasswordHash: userToEdit.PasswordHash,
        Email: userToEdit.Email,
        IsActive: userToEdit.IsActive,
        CreatedAt: userToEdit.CreatedAt,
      });
    } else {
      setFormData({
        UserId: 0,
        Username: '',
        PasswordHash: '',
        Email: '',
        IsActive: true,
        CreatedAt: new Date().toISOString(),
      });
    }
  }, [userToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    console.log('Submitting form data:', formData);

    try {
      if (userToEdit) {
        console.log('Updating user with ID:', userToEdit.UserId);
        await userService.updateUser(userToEdit.UserId, formData);
        alert('User updated successfully!');
      } else {
        console.log('Creating new user');
        await userService.createUser(formData);
        alert('User created successfully!');
      }

      setFormData({
        UserId: 0,
        Username: '',
        PasswordHash: '',
        Email: '',
        IsActive: true,
        CreatedAt: new Date().toISOString(),
      });
      
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting user:', err);
      const errorMessage = err?.response?.data?.message || err.message || 'Operation failed';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : name === 'UserId' ? Number(value) : value,
    });
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '600px'
    }}>
      <h2>{userToEdit ? 'Edit User' : 'Create New User'}</h2>

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
            <label htmlFor="UserId" style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold' 
            }}>
              User ID *
            </label>
            <input
              type="number"
              id="UserId"
              name="UserId"
              value={formData.UserId}
              onChange={handleChange}
              required
              disabled={!!userToEdit}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: userToEdit ? '#e0e0e0' : 'white',
              }}
              placeholder="e.g., 1"
            />
            {userToEdit && (
              <small style={{ color: '#666', fontSize: '12px' }}>
                ID cannot be changed
              </small>
            )}
          </div>

          <div>
            <label htmlFor="Username" style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold' 
            }}>
              Username *
            </label>
            <input
              type="text"
              id="Username"
              name="Username"
              value={formData.Username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              placeholder="e.g., john_doe"
            />
          </div>

          <div>
            <label htmlFor="Email" style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold' 
            }}>
              Email *
            </label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label htmlFor="PasswordHash" style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold' 
            }}>
              Password {userToEdit ? '(optional)' : '*'}
            </label>
            <input
              type="password"
              id="PasswordHash"
              name="PasswordHash"
              value={formData.PasswordHash}
              onChange={handleChange}
              required={!userToEdit}
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              placeholder="Enter password"
            />
          </div>
        </div>

        <div style={{ marginTop: '15px', marginBottom: '20px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            <input
              type="checkbox"
              name="IsActive"
              checked={formData.IsActive}
              onChange={handleChange}
              style={{
                marginRight: '10px',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
              }}
            />
            Is Active
          </label>
          <small style={{ color: '#666', fontSize: '12px', marginLeft: '30px' }}>
            Active users can log in to the system
          </small>
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
            {submitting ? 'Saving...' : (userToEdit ? 'Update User' : 'Create User')}
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
