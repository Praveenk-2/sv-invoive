'use client';

import React, { useState, useEffect } from 'react';
import { customerService } from '@/services/customerService';
import { Customer } from '@/types/customer.types';
import { useAuth } from '@/context/AuthContext';

interface CustomersFormProps {
  customerToEdit?: Customer | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CustomersForm({ customerToEdit, onSuccess, onCancel }: CustomersFormProps) {
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    CustomerId: 0,
    CustomerName: '',
    Contact: '',
    Email: '',
    Address: '',
    GSTNumber: '',
    IsActive: true,
    CreatedBy: currentUser?.id || 0,
    CreatedAt: new Date().toISOString(),
    ModifiyBy: 0,
    ModifiyAt: null as string | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (customerToEdit) {
      console.log('Editing customer:', customerToEdit);
      setFormData({
        CustomerId: customerToEdit.CustomerId,
        CustomerName: customerToEdit.CustomerName,
        Contact: customerToEdit.Contact,
        Email: customerToEdit.Email,
        Address: customerToEdit.Address,
        GSTNumber: customerToEdit.GSTNumber,
        IsActive: customerToEdit.IsActive,
        CreatedBy: customerToEdit.CreatedBy,
        CreatedAt: customerToEdit.CreatedAt,
        ModifiyBy: currentUser?.id || 0,
        ModifiyAt: new Date().toISOString(),
      });
    } else {
      setFormData({
        CustomerId: 0,
        CustomerName: '',
        Contact: '',
        Email: '',
        Address: '',
        GSTNumber: '',
        IsActive: true,
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });
    }
  }, [customerToEdit, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    console.log('Form data before sending:', formData);

    try {
      const submitData = {
        ...formData,
        ModifiyAt: new Date().toISOString()
      };

      if (customerToEdit) {
        console.log('Updating customer with ID:', customerToEdit.CustomerId);
        await customerService.updateCustomer(customerToEdit.CustomerId, submitData);
        alert('Customer updated successfully!');
      } else {
        console.log('Creating new customer');
        await customerService.createCustomer(submitData);
        alert('Customer created successfully!');
      }

      setFormData({
        CustomerId: 0,
        CustomerName: '',
        Contact: '',
        Email: '',
        Address: '',
        GSTNumber: '',
        IsActive: true,
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting customer:', err);
      console.error('Error response:', err?.response?.data);
      const errorMessage = err?.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(', ')
        : err?.response?.data?.message || err.message || 'Operation failed';
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
      [name]: type === 'checkbox' ? checked : name === 'CustomerId' ? Number(value) : value,
    });
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '800px'
    }}>
      <h2>{customerToEdit ? 'Edit Customer' : 'Create New Customer'}</h2>

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
            <label htmlFor="CustomerId" style={labelStyle}>
              Customer ID *
            </label>
            <input
              type="number"
              id="CustomerId"
              name="CustomerId"
              value={formData.CustomerId}
              onChange={handleChange}
              required
              disabled={!!customerToEdit}
              style={{
                ...inputStyle,
                backgroundColor: customerToEdit ? '#e0e0e0' : 'white',
              }}
              placeholder="e.g., 1"
            />
            {customerToEdit && (
              <small style={{ color: '#666', fontSize: '12px' }}>
                ID cannot be changed
              </small>
            )}
          </div>

          <div>
            <label htmlFor="CustomerName" style={labelStyle}>
              Customer Name *
            </label>
            <input
              type="text"
              id="CustomerName"
              name="CustomerName"
              value={formData.CustomerName}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., ABC Corporation"
            />
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
              required
              style={inputStyle}
              placeholder="e.g., +1234567890"
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
              placeholder="customer@example.com"
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="Address" style={labelStyle}>
              Address *
            </label>
            <textarea
              id="Address"
              name="Address"
              value={formData.Address}
              onChange={handleChange}
              required
              style={{
                ...inputStyle,
                minHeight: '80px',
                resize: 'vertical'
              }}
              placeholder="Enter complete address..."
            />
          </div>

          <div>
            <label htmlFor="GSTNumber" style={labelStyle}>
              GST Number
            </label>
            <input
              type="text"
              id="GSTNumber"
              name="GSTNumber"
              value={formData.GSTNumber}
              onChange={handleChange}
              style={inputStyle}
              placeholder="e.g., 22AAAAA0000A1Z5"
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              Optional - Leave blank if not applicable
            </small>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', paddingTop: '20px' }}>
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
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
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
            {submitting ? 'Saving...' : (customerToEdit ? 'Update Customer' : 'Create Customer')}
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