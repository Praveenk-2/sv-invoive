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
    PhoneNumber: '',
    IsActive: true,
    CreatedAt: new Date().toISOString(),
    CreatedBy: currentUser?.id || 0,
    ModifiyBy: 0,
    ModifiyAt: null as string | null,
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field-specific errors
  const [fieldErrors, setFieldErrors] = useState({
    Username: '',
    Email: '',
    PasswordHash: '',
    PhoneNumber: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (userToEdit) {
      console.log('Editing user:', userToEdit);
      setFormData({
        UserId: userToEdit.UserId,
        Username: userToEdit.Username,
        PasswordHash: '',
        Email: userToEdit.Email,
        PhoneNumber: userToEdit.PhoneNumber,
        IsActive: userToEdit.IsActive,
        CreatedAt: userToEdit.CreatedAt,
        CreatedBy: userToEdit.CreatedBy,
        ModifiyBy: currentUser?.id || 0,
        ModifiyAt: new Date().toISOString(),
      });
      setConfirmPassword('');
    } else {
      setFormData({
        UserId: 0,
        Username: '',
        PasswordHash: '',
        Email: '',
        PhoneNumber: '',
        IsActive: true,
        CreatedAt: new Date().toISOString(),
        CreatedBy: currentUser?.id || 0,
        ModifiyBy: 0,
        ModifiyAt: null,
      });
      setConfirmPassword('');
    }
    setFieldErrors({
      Username: '',
      Email: '',
      PasswordHash: '',
      PhoneNumber: '',
      confirmPassword: ''
    });
  }, [userToEdit, currentUser]);

  // Validation functions
  const validateUsername = (username: string): string => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters long';
    if (!/^[A-Za-z]+$/.test(username)) return 'Username must contain only letters (no numbers or special characters)';
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password: string, isEditing: boolean): string => {
    if (!password && !isEditing) return 'Password is required';
    if (password && password.length < 6) return 'Password must be at least 6 characters long';
    if (password && !/[A-Z]/.test(password)) return 'Password must contain at least one capital letter';
    if (password && !/[a-z]/.test(password)) return 'Password must contain at least one small letter';
    if (password && !/[0-9]/.test(password)) return 'Password must contain at least one number';
    return '';
  };

  const validatePhoneNumber = (phone: string): string => {
    if (!phone) return 'Phone number is required';
    if (phone.length < 10 || phone.length > 15) return 'Phone number must be between 10 and 15 digits';
    if (!/^\+?[0-9]+$/.test(phone)) return 'Phone number must contain only numbers (and optional + at start)';
    return '';
  };

  const validateConfirmPassword = (password: string, confirm: string): string => {
    if (!confirm && !userToEdit) return 'Please confirm your password';
    if (password && confirm && password !== confirm) return 'Passwords do not match';
    return '';
  };

  const handleBlur = (field: string) => {
    let errorMsg = '';
    
    switch (field) {
      case 'Username':
        errorMsg = validateUsername(formData.Username);
        break;
      case 'Email':
        errorMsg = validateEmail(formData.Email);
        break;
      case 'PasswordHash':
        errorMsg = validatePassword(formData.PasswordHash, !!userToEdit);
        break;
      case 'PhoneNumber':
        errorMsg = validatePhoneNumber(formData.PhoneNumber);
        break;
      case 'confirmPassword':
        errorMsg = validateConfirmPassword(formData.PasswordHash, confirmPassword);
        break;
    }

    setFieldErrors(prev => ({
      ...prev,
      [field]: errorMsg
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    const errors = {
      Username: validateUsername(formData.Username),
      Email: validateEmail(formData.Email),
      PasswordHash: validatePassword(formData.PasswordHash, !!userToEdit),
      PhoneNumber: validatePhoneNumber(formData.PhoneNumber),
      confirmPassword: validateConfirmPassword(formData.PasswordHash, confirmPassword)
    };

    setFieldErrors(errors);

    // Check if there are any errors
    const hasErrors = Object.values(errors).some(err => err !== '');
    if (hasErrors) {
      setError('Please fix all validation errors before submitting');
      return;
    }

    setSubmitting(true);

    try {
      if (userToEdit) {
        console.log('Updating user with ID:', userToEdit.UserId);
        await userService.updateUser(userToEdit.UserId, {
          ...formData,
          ModifiyAt: new Date().toISOString()
        });
        alert('User updated successfully!');
      } else {
        console.log('Creating new user');
        await userService.createUser({
          ...formData,
          ModifiyAt: new Date().toISOString()
        });
        alert('User created successfully!');
      }

      setFormData({
        UserId: 0,
        Username: '',
        PasswordHash: '',
        Email: '',
        PhoneNumber: '',
        IsActive: true,
        CreatedAt: new Date().toISOString(),
        CreatedBy: currentUser?.id || 0,
        ModifiyBy: 0,
        ModifiyAt: null,
      });
      setConfirmPassword('');
      setFieldErrors({
        Username: '',
        Email: '',
        PasswordHash: '',
        PhoneNumber: '',
        confirmPassword: ''
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
    
    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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
              onBlur={() => handleBlur('Username')}
              required
              style={{
                ...inputStyle,
                borderColor: fieldErrors.Username ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., johndoe"
            />
            {fieldErrors.Username && (
              <small style={errorTextStyle}>{fieldErrors.Username}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Min 3 letters, letters only
            </small>
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
              onBlur={() => handleBlur('Email')}
              required
              style={{
                ...inputStyle,
                borderColor: fieldErrors.Email ? '#c62828' : '#ccc'
              }}
              placeholder="user@example.com"
            />
            {fieldErrors.Email && (
              <small style={errorTextStyle}>{fieldErrors.Email}</small>
            )}
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
              onBlur={() => handleBlur('PasswordHash')}
              required={!userToEdit}
              style={{
                ...inputStyle,
                paddingRight: '42px',
                borderColor: fieldErrors.PasswordHash ? '#c62828' : '#ccc'
              }}
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

            {fieldErrors.PasswordHash && (
              <small style={errorTextStyle}>{fieldErrors.PasswordHash}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              {userToEdit ? 'Only fill to change password' : 'Min 6 chars: 1 capital, 1 small, 1 number'}
            </small>
          </div>

          <div style={{ position: 'relative' }}>
            <label style={labelStyle}>
              Confirm Password {userToEdit ? '(leave blank to keep)' : '*'}
            </label>

            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (fieldErrors.confirmPassword) {
                  setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
                }
              }}
              onBlur={() => handleBlur('confirmPassword')}
              required={!userToEdit}
              style={{
                ...inputStyle,
                paddingRight: '42px',
                borderColor: fieldErrors.confirmPassword ? '#c62828' : '#ccc'
              }}
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

            {fieldErrors.confirmPassword && (
              <small style={errorTextStyle}>{fieldErrors.confirmPassword}</small>
            )}
          </div>

          <div>
            <label htmlFor="PhoneNumber" style={labelStyle}>
              Phone Number *
            </label>
            <input
              type="tel"
              id="PhoneNumber"
              name="PhoneNumber"
              value={formData.PhoneNumber}
              onChange={handleChange}
              onBlur={() => handleBlur('PhoneNumber')}
              required
              style={{
                ...inputStyle,
                borderColor: fieldErrors.PhoneNumber ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., +1234567890"
            />
            {fieldErrors.PhoneNumber && (
              <small style={errorTextStyle}>{fieldErrors.PhoneNumber}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Numbers only (+ allowed at start)
            </small>
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

const errorTextStyle: React.CSSProperties = {
  color: '#c62828',
  fontSize: '12px',
  display: 'block',
  marginTop: '4px',
  fontWeight: '500'
};