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
  }, [supplierToEdit, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
      
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting supplier:', err);
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
      [name]: type === 'checkbox' ? checked : 
              name === 'SupplierId' ? Number(value) : 
              value,
    });
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
          <div>
            <label htmlFor="SupplierId" style={labelStyle}>
              Supplier ID *
            </label>
            <input
              type="number"
              id="SupplierId"
              name="SupplierId"
              value={formData.SupplierId}
              onChange={handleChange}
              required
              disabled={!!supplierToEdit}
              style={{
                ...inputStyle,
                backgroundColor: supplierToEdit ? '#e0e0e0' : 'white',
              }}
              placeholder="e.g., 1"
            />
            {supplierToEdit && (
              <small style={{ color: '#666', fontSize: '12px' }}>
                ID cannot be changed
              </small>
            )}
          </div>

          <div>
            <label htmlFor="SupplierName" style={labelStyle}>
              Supplier Name *
            </label>
            <input
              type="text"
              id="SupplierName"
              name="SupplierName"
              value={formData.SupplierName}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., ABC Suppliers Ltd."
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
              placeholder="e.g., +91-9876543210"
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
              placeholder="supplier@example.com"
            />
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
              required
              style={inputStyle}
              placeholder="e.g., 29ABCDE1234F1Z5"
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              15-digit GST identification number
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
            required
            rows={3}
            style={{
              ...inputStyle,
              resize: 'vertical',
            }}
            placeholder="Enter full address with city, state, and pincode"
          />
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
          <small style={{ color: '#666', fontSize: '12px', marginLeft: '30px' }}>
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