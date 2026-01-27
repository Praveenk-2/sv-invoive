// components/WarehouseForm.tsx
// Component to create or update warehouses
'use client';

import React, { useState, useEffect } from 'react';
import { warehouseService } from '@/services/warehouseService';
import { Warehouse } from '@/types/warehouse.types';
import { useAuth } from '@/context/AuthContext';

interface WarehouseFormProps {
  warehouseToEdit?: Warehouse | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function WarehouseForm({ warehouseToEdit, onSuccess, onCancel }: WarehouseFormProps) {
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    WarehouseId: 0,
    WarehouseName: '',
    Location: '',
    IsActive: true,
    CreatedBy: currentUser?.id || 0,
    CreatedAt: new Date().toISOString(),
    ModifiyBy: 0,
    ModifiyAt: null as string | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (warehouseToEdit) {
      console.log('Editing warehouse:', warehouseToEdit);
      setFormData({
        WarehouseId: warehouseToEdit.WarehouseId,
        WarehouseName: warehouseToEdit.WarehouseName,
        Location: warehouseToEdit.Location,
        IsActive: warehouseToEdit.IsActive,
        CreatedBy: warehouseToEdit.CreatedBy,
        CreatedAt: warehouseToEdit.CreatedAt,
        ModifiyBy: currentUser?.id || 0,
        ModifiyAt: new Date().toISOString(),
      });
    } else {
      setFormData({
        WarehouseId: 0,
        WarehouseName: '',
        Location: '',
        IsActive: true,
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });
    }
  }, [warehouseToEdit, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    console.log('Form data before sending:', formData);

    try {
      if (warehouseToEdit) {
        console.log('Updating warehouse with ID:', warehouseToEdit.WarehouseId);
        await warehouseService.updateWarehouse(warehouseToEdit.WarehouseId, {
          ...formData,
          ModifiyAt: new Date().toISOString()
        });
        alert('Warehouse updated successfully!');
      } else {
        console.log('Creating new warehouse');
        await warehouseService.createWarehouse({
          ...formData,
          ModifiyAt: new Date().toISOString()
        });
        alert('Warehouse created successfully!');
      }

      setFormData({
        WarehouseId: 0,
        WarehouseName: '',
        Location: '',
        IsActive: true,
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting warehouse:', err);
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
      [name]: type === 'checkbox' ? checked : name === 'WarehouseId' ? Number(value) : value,
    });
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '700px'
    }}>
      <h2>{warehouseToEdit ? 'Edit Warehouse' : 'Create New Warehouse'}</h2>

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
          <div>
            <label htmlFor="WarehouseName" style={labelStyle}>
              Warehouse Name *
            </label>
            <input
              type="text"
              id="WarehouseName"
              name="WarehouseName"
              value={formData.WarehouseName}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., Main Warehouse"
            />
          </div>

        <div style={{ marginTop: '15px' }}>
          <label htmlFor="Location" style={labelStyle}>
            Location *
          </label>
          <textarea
            id="Location"
            name="Location"
            value={formData.Location}
            onChange={handleChange}
            required
            rows={3}
            style={{
              ...inputStyle,
              resize: 'vertical',
            }}
            placeholder="Enter full warehouse address..."
          />
          <small style={{ color: '#666', fontSize: '12px' }}>
            Include street address, city, state, and postal code
          </small>
        </div>

        <div style={{ marginTop: '15px', marginBottom: '15px' }}>
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
            Active warehouses are available for stock operations
          </small>
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
            {submitting ? 'Saving...' : (warehouseToEdit ? 'Update Warehouse' : 'Create Warehouse')}
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