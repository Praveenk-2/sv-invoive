// components/SupplierForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { supplierService } from '@/services/supplierService';
import { Supplier } from '@/types/supplier.types';
import { useAuth } from '@/context/AuthContext';

interface SupplierFormProps {
  supplierToEdit?: Supplier | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function SupplierForm({ supplierToEdit, onSuccess, onCancel }: SupplierFormProps) {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    SupplierId: 0,
    SupplierName: '',
    Contact: '',
    Email: '',
    Address: '',
    GSTNumber: '',
    IsActive: true,
    CreatedBy: user?.id || 0,
    CreatedAt: new Date().toISOString(),
    ModifiyBy: 0,
    ModifiyAt: new Date().toISOString(),
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Field-specific errors
  const [fieldErrors, setFieldErrors] = useState({
    SupplierName: '',
    Contact: '',
    Email: '',
    Address: '',
    GSTNumber: '',
  });

  useEffect(() => {
    if (supplierToEdit) {
      console.log('Editing supplier:', supplierToEdit);
      setFormData({
        SupplierId: supplierToEdit.SupplierId,
        SupplierName: supplierToEdit.SupplierName,
        Contact: supplierToEdit.Contact,
        Email: supplierToEdit.Email,
        Address: supplierToEdit.Address,
        GSTNumber: supplierToEdit.GSTNumber,
        IsActive: supplierToEdit.IsActive,
        CreatedBy: supplierToEdit.CreatedBy,
        CreatedAt: supplierToEdit.CreatedAt,
        ModifiyBy: user?.id || 0,
        ModifiyAt: new Date().toISOString(),
      });
    } else {
      setFormData({
        SupplierId: 0,
        SupplierName: '',
        Contact: '',
        Email: '',
        Address: '',
        GSTNumber: '',
        IsActive: true,
        CreatedBy: user?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: new Date().toISOString(),
      });
    }
    // Clear errors when switching modes
    setFieldErrors({
      SupplierName: '',
      Contact: '',
      Email: '',
      Address: '',
      GSTNumber: '',
    });
    setError('');
  }, [supplierToEdit, user]);

  // Validation functions
  const validateSupplierName = (name: string): string => {
    if (!name || name.trim() === '') return 'Supplier name is required';
    if (name.length < 2) return 'Supplier name must be at least 2 characters';
    return '';
  };

  const validateContact = (contact: string): string => {
    if (!contact || contact.trim() === '') return 'Contact number is required';
    // Remove common separators for validation
    const cleanContact = contact.replace(/[-\s()]/g, '');
    if (!/^\+?[0-9]+$/.test(cleanContact)) return 'Contact number must contain only numbers (and optional + at start)';
    if (cleanContact.replace('+', '').length < 10) return 'Contact number must be at least 10 digits';
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email || email.trim() === '') return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validateAddress = (address: string): string => {
    if (!address || address.trim() === '') return 'Address is required';
    if (address.length < 10) return 'Address must be at least 10 characters';
    return '';
  };

  const validateGSTNumber = (gstNumber: string): string => {
    if (!gstNumber || gstNumber.trim() === '') return 'GST Number is required';
    // GST format: 2 digits state code + 10 chars PAN + 1 char entity number + 1 char Z + 1 char checksum
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(gstNumber)) {
      return 'Invalid GST Number format (e.g., 29ABCDE1234F1Z5)';
    }
    return '';
  };

  const handleBlur = (field: string) => {
    let errorMsg = '';
    
    switch (field) {
      case 'SupplierName':
        errorMsg = validateSupplierName(formData.SupplierName);
        break;
      case 'Contact':
        errorMsg = validateContact(formData.Contact);
        break;
      case 'Email':
        errorMsg = validateEmail(formData.Email);
        break;
      case 'Address':
        errorMsg = validateAddress(formData.Address);
        break;
      case 'GSTNumber':
        errorMsg = validateGSTNumber(formData.GSTNumber);
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

    // Validate all fields before submission
    const errors = {
      SupplierName: validateSupplierName(formData.SupplierName),
      Contact: validateContact(formData.Contact),
      Email: validateEmail(formData.Email),
      Address: validateAddress(formData.Address),
      GSTNumber: validateGSTNumber(formData.GSTNumber),
    };

    setFieldErrors(errors);

    // Check if there are any validation errors
    const hasErrors = Object.values(errors).some(err => err !== '');
    if (hasErrors) {
      setError('Please fix all validation errors before submitting');
      return;
    }

    setSubmitting(true);

    console.log('Submitting supplier data:', formData);

    try {
      if (supplierToEdit) {
        console.log('Updating supplier with ID:', supplierToEdit.SupplierId);
        await supplierService.updateSupplier(supplierToEdit.SupplierId, {
          ...formData,
          ModifiyAt: new Date().toISOString()
        });
        alert('Supplier updated successfully!');
      } else {
        console.log('Creating new supplier');
        await supplierService.createSupplier({
          ...formData,
          ModifiyAt: new Date().toISOString()
        });
        alert('Supplier created successfully!');
      }

      setFormData({
        SupplierId: 0,
        SupplierName: '',
        Contact: '',
        Email: '',
        Address: '',
        GSTNumber: '',
        IsActive: true,
        CreatedBy: user?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: new Date().toISOString(),
      });
      setFieldErrors({
        SupplierName: '',
        Contact: '',
        Email: '',
        Address: '',
        GSTNumber: '',
      });
      
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting supplier:', err);
      console.error('Error response:', err?.response?.data);
      
      // Handle different types of errors with user-friendly messages
      let errorMessage = '';
      
      if (err?.response?.status === 409) {
        errorMessage = 'A supplier with this email, contact number, or GST number already exists. Please use unique details.';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Unable to save the supplier. Please check your entries and try again.';
      } else if (err?.response?.status === 400) {
        // Bad request - validation error from server
        if (err?.response?.data?.errors) {
          const serverErrors = Object.values(err.response.data.errors).flat();
          errorMessage = serverErrors.join(', ');
        } else {
          errorMessage = err?.response?.data?.message || 'Invalid data provided. Please check your entries.';
        }
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message && !err.message.includes('status code')) {
        errorMessage = err.message;
      } else {
        errorMessage = 'Unable to complete the operation. Please verify your data and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : 
              name === 'SupplierId' ? Number(value) : 
              value,
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
      maxWidth: '900px'
    }}>
      <h2>{supplierToEdit ? 'Edit Supplier' : 'Create New Supplier'}</h2>

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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px' }}>
          {supplierToEdit && (
            <div>
              <label htmlFor="SupplierId" style={labelStyle}>
                Supplier ID
              </label>
              <input
                type="number"
                id="SupplierId"
                name="SupplierId"
                value={formData.SupplierId}
                disabled
                style={{
                  ...inputStyle,
                  backgroundColor: '#e0e0e0',
                }}
              />
              <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                ID cannot be changed
              </small>
            </div>
          )}

          <div style={{ gridColumn: supplierToEdit ? 'auto' : 'span 2' }}>
            <label htmlFor="SupplierName" style={labelStyle}>
              Supplier Name *
            </label>
            <input
              type="text"
              id="SupplierName"
              name="SupplierName"
              value={formData.SupplierName}
              onChange={handleChange}
              onBlur={() => handleBlur('SupplierName')}
              required
              style={{
                ...inputStyle,
                borderColor: fieldErrors.SupplierName ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., ABC Suppliers Ltd."
            />
            {fieldErrors.SupplierName && (
              <small style={errorTextStyle}>{fieldErrors.SupplierName}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Full company or business name
            </small>
          </div>

          <div>
            <label htmlFor="Contact" style={labelStyle}>
              Contact Number *
            </label>
            <input
              type="tel"
              id="Contact"
              name="Contact"
              value={formData.Contact}
              onChange={handleChange}
              onBlur={() => handleBlur('Contact')}
              required
              style={{
                ...inputStyle,
                borderColor: fieldErrors.Contact ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., +91-9876543210"
            />
            {fieldErrors.Contact && (
              <small style={errorTextStyle}>{fieldErrors.Contact}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Min 10 digits, numbers only
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
              placeholder="supplier@example.com"
            />
            {fieldErrors.Email && (
              <small style={errorTextStyle}>{fieldErrors.Email}</small>
            )}
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label htmlFor="GSTNumber" style={labelStyle}>
              GST Number *
            </label>
            <input
              type="text"
              id="GSTNumber"
              name="GSTNumber"
              value={formData.GSTNumber}
              onChange={handleChange}
              onBlur={() => handleBlur('GSTNumber')}
              required
              style={{
                ...inputStyle,
                borderColor: fieldErrors.GSTNumber ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., 29ABCDE1234F1Z5"
              maxLength={15}
            />
            {fieldErrors.GSTNumber && (
              <small style={errorTextStyle}>{fieldErrors.GSTNumber}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              15-character GST identification number
            </small>
          </div>
        </div>

        <div style={{ marginTop: '15px', marginBottom: '15px' }}>
          <label htmlFor="Address" style={labelStyle}>
            Address *
          </label>
          <textarea
            id="Address"
            name="Address"
            value={formData.Address}
            onChange={handleChange}
            onBlur={() => handleBlur('Address')}
            required
            rows={3}
            style={{
              ...inputStyle,
              resize: 'vertical',
              borderColor: fieldErrors.Address ? '#c62828' : '#ccc'
            }}
            placeholder="Enter full address with city, state, and pincode"
          />
          {fieldErrors.Address && (
            <small style={errorTextStyle}>{fieldErrors.Address}</small>
          )}
          <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
            Complete address with street, city, state, and postal code
          </small>
        </div>

        <div style={{ marginBottom: '15px' }}>
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
          <small style={{ color: '#666', fontSize: '12px', marginLeft: '30px', display: 'block', marginTop: '4px' }}>
            Active suppliers can be used in purchase orders
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
            {submitting ? 'Saving...' : (supplierToEdit ? 'Update Supplier' : 'Create Supplier')}
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