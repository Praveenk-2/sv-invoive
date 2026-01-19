// Component to create or update users
'use client';

import React, { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import { User } from '@/types/user.types';
import { useAuth } from '@/context/AuthContext';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

interface UserFormProps {
  userToEdit?: User | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function UserForm({ userToEdit, onSuccess, onCancel }: UserFormProps) {
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    UserId: 0,
    Username: '',
    PasswordHash: '',
    Email: '',
    IsActive: true,
    CreatedAt: new Date().toISOString(),
    CreatedBy: currentUser?.id || 0,
    ModifiyBy: 0,
    ModifiyAt: null as string | null,  // null instead of empty string
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


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
        CreatedBy: userToEdit.CreatedBy,
        ModifiyBy: currentUser?.id || 0,
        ModifiyAt: new Date().toISOString(),
      });
    } else {
      setFormData({
        UserId: 0,
        Username: '',
        PasswordHash: '',
        Email: '',
        IsActive: true,
        CreatedAt: new Date().toISOString(),
        CreatedBy: currentUser?.id || 0,
        ModifiyBy: 0,
        ModifiyAt: null,  // null instead of empty string
      });
    }
  }, [userToEdit, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 🔐 Confirm password validation
    if (!userToEdit && formData.PasswordHash !== confirmPassword) {
      setError('Password and Confirm Password do not match');
      return;
    }

    if (userToEdit && formData.PasswordHash && formData.PasswordHash !== confirmPassword) {
      setError('Password and Confirm Password do not match');
      return;
    }

    setSubmitting(true);

    console.log('Form data before sending:', formData);

    // In UserForm.tsx handleSubmit function
    try {
      if (userToEdit) {
        console.log('Updating user with ID:', userToEdit.UserId);
        await userService.updateUser(userToEdit.UserId, {
          ...formData,
          ModifiyAt: new Date().toISOString() // Ensure it's a valid date string
        });
        alert('User updated successfully!');
      } else {
        console.log('Creating new user');
        await userService.createUser({
          ...formData,
          ModifiyAt: new Date().toISOString() // Ensure it's a valid date string for create too
        });
        alert('User created successfully!');
      }

      setFormData({
        UserId: 0,
        Username: '',
        PasswordHash: '',
        Email: '',
        IsActive: true,
        CreatedAt: new Date().toISOString(),
        CreatedBy: currentUser?.id || 0,
        ModifiyBy: 0,
        ModifiyAt: null,
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting user:', err);
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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : name === 'UserId' ? Number(value) : value,
    });
    setConfirmPassword('');
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '700px'
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
          {/* <div>
            <label htmlFor="UserId" style={labelStyle}>
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
                ...inputStyle,
                backgroundColor: userToEdit ? '#e0e0e0' : 'white',
              }}
              placeholder="e.g., 1"
            />
            {userToEdit && (
              <small style={{ color: '#666', fontSize: '12px' }}>
                ID cannot be changed
              </small>
            )}
          </div> */}

          <div>
            <label htmlFor="Username" style={labelStyle}>
              Username *
            </label>
            <input
              type="text"
              id="Username"
              name="Username"
              value={formData.Username}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., john_doe"
            />
          </div>

          <div>
            <label htmlFor="Email" style={labelStyle}>
              Email *
            </label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="user@example.com"
            />
          </div>

          <div style={{ position: 'relative' }}>
            <label htmlFor="PasswordHash" style={labelStyle}>
              Password {userToEdit ? '(leave blank to keep)' : '*'}
            </label>

            <input
              type={showPassword ? 'text' : 'password'}
              id="PasswordHash"
              name="PasswordHash"
              value={formData.PasswordHash}
              onChange={handleChange}
              required={!userToEdit}
              style={{ ...inputStyle, paddingRight: '42px' }}
              placeholder="Enter password"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '38px',
                cursor: 'pointer',
                color: '#555',
              }}
            >
              {showPassword ? <IoMdEyeOff size={22} /> : <IoMdEye size={22} />}
            </span>

            <small style={{ color: '#666', fontSize: '12px' }}>
              {userToEdit ? 'Only fill to change password' : 'Min 6 characters'}
            </small>
          </div>

          <div style={{ position: 'relative' }}>
            <label style={labelStyle}>
              Confirm Password {userToEdit ? '(leave blank to keep)' : '*'}
            </label>

            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={!userToEdit}
              style={{ ...inputStyle, paddingRight: '42px' }}
              placeholder="Re-enter password"
            />

            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '38px',
                cursor: 'pointer',
                color: '#555',
              }}
            >
              {showConfirmPassword ? <IoMdEyeOff size={22} /> : <IoMdEye size={22} />}
            </span>
          </div>

        </div>

        <div style={{ marginTop: '15px', marginBottom: '15px' }}>
          <label htmlFor="IsActive" style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
            Is Active
          </label>
          <select
            id="IsActive"
            name="IsActive"
            value={formData.IsActive ? 'true' : 'false'}
            onChange={(e) =>
              setFormData({
                ...formData,
                IsActive: e.target.value === 'true',
              })}
            style={{
              width: 'auto',
              padding: '5px 5px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>

          <small style={{ color: '#666', fontSize: '12px', marginTop: '6px', display: 'block' }}>
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
              fontWeight: 'bold',
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