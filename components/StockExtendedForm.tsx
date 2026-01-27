'use client';

import React, { useState, useEffect } from 'react';
import { stockExtendedService } from '@/services/stockExtendedService';
import { StockExtended } from '@/types/stockExtended.types';
import { useAuth } from '@/context/AuthContext';

interface StockExtendedFormProps {
  stockToEdit?: StockExtended | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function StockExtendedForm({ stockToEdit, onSuccess, onCancel }: StockExtendedFormProps) {
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    StockId: 0,
    ItemId: 0,
    WarehouseId: 0,
    Quantity: 0,
    LastUpdated: new Date().toISOString(),
    CreatedBy: currentUser?.id || 0,
    CreatedAt: new Date().toISOString(),
    ModifiyBy: 0,
    ModifiyAt: null as string | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Field-specific errors
  const [fieldErrors, setFieldErrors] = useState({
    ItemId: '',
    WarehouseId: '',
    Quantity: '',
  });

  useEffect(() => {
    if (stockToEdit) {
      console.log('Editing stock:', stockToEdit);
      setFormData({
        StockId: stockToEdit.StockId,
        ItemId: stockToEdit.ItemId,
        WarehouseId: stockToEdit.WarehouseId,
        Quantity: stockToEdit.Quantity,
        LastUpdated: stockToEdit.LastUpdated,
        CreatedBy: stockToEdit.CreatedBy,
        CreatedAt: stockToEdit.CreatedAt,
        ModifiyBy: currentUser?.id || 0,
        ModifiyAt: new Date().toISOString(),
      });
    } else {
      setFormData({
        StockId: 0,
        ItemId: 0,
        WarehouseId: 0,
        Quantity: 0,
        LastUpdated: new Date().toISOString(),
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });
    }
    // Clear errors when switching modes
    setFieldErrors({
      ItemId: '',
      WarehouseId: '',
      Quantity: '',
    });
    setError('');
  }, [stockToEdit, currentUser]);

  // Validation functions
  const validateItemId = (itemId: number): string => {
    if (!itemId || itemId === 0) return 'Item ID is required';
    if (itemId < 1) return 'Item ID must be a positive number';
    return '';
  };

  const validateWarehouseId = (warehouseId: number): string => {
    if (!warehouseId || warehouseId === 0) return 'Warehouse ID is required';
    if (warehouseId < 1) return 'Warehouse ID must be a positive number';
    return '';
  };

  const validateQuantity = (quantity: number): string => {
    if (quantity < 0) return 'Quantity cannot be negative';
    return '';
  };

  const handleBlur = (field: string) => {
    let errorMsg = '';
    
    switch (field) {
      case 'ItemId':
        errorMsg = validateItemId(formData.ItemId);
        break;
      case 'WarehouseId':
        errorMsg = validateWarehouseId(formData.WarehouseId);
        break;
      case 'Quantity':
        errorMsg = validateQuantity(formData.Quantity);
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
      ItemId: validateItemId(formData.ItemId),
      WarehouseId: validateWarehouseId(formData.WarehouseId),
      Quantity: validateQuantity(formData.Quantity),
    };

    setFieldErrors(errors);

    // Check if there are any validation errors
    const hasErrors = Object.values(errors).some(err => err !== '');
    if (hasErrors) {
      setError('Please fix all validation errors before submitting');
      return;
    }

    setSubmitting(true);

    console.log('Form data before sending:', formData);

    try {
      const submitData = {
        ...formData,
        LastUpdated: new Date().toISOString(),
        ModifiyAt: new Date().toISOString()
      };

      if (stockToEdit) {
        console.log('Updating stock with ID:', stockToEdit.StockId);
        await stockExtendedService.updateStock(stockToEdit.StockId, submitData);
        alert('Stock record updated successfully!');
      } else {
        console.log('Creating new stock record');
        await stockExtendedService.createStock(submitData);
        alert('Stock record created successfully!');
      }

      setFormData({
        StockId: 0,
        ItemId: 0,
        WarehouseId: 0,
        Quantity: 0,
        LastUpdated: new Date().toISOString(),
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });
      setFieldErrors({
        ItemId: '',
        WarehouseId: '',
        Quantity: '',
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting stock:', err);
      console.error('Error response:', err?.response?.data);
      
      // Handle different types of errors with user-friendly messages
      let errorMessage = '';
      
      if (err?.response?.status === 404) {
        errorMessage = 'Item ID or Warehouse ID not found in the database. Please verify the IDs and try again.';
      } else if (err?.response?.status === 409) {
        errorMessage = 'A stock record for this Item and Warehouse combination already exists. Please update the existing record or use different IDs.';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Unable to save the stock record. Please verify that both Item ID and Warehouse ID exist in the system.';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: Number(value) || 0,
    });

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getStockStatus = () => {
    if (formData.Quantity === 0) return { text: 'OUT OF STOCK', color: '#f44336' };
    if (formData.Quantity < 10) return { text: 'LOW STOCK', color: '#ff9800' };
    if (formData.Quantity < 50) return { text: 'MEDIUM STOCK', color: '#2196f3' };
    return { text: 'IN STOCK', color: '#4caf50' };
  };

  const status = getStockStatus();

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '700px'
    }}>
      <h2>{stockToEdit ? 'Edit Stock Record' : 'Create New Stock Record'}</h2>

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
          {stockToEdit && (
            <div>
              <label htmlFor="StockId" style={labelStyle}>
                Stock ID
              </label>
              <input
                type="number"
                id="StockId"
                name="StockId"
                value={formData.StockId}
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

          <div style={{ gridColumn: stockToEdit ? 'auto' : 'span 2' }}>
            <label htmlFor="ItemId" style={labelStyle}>
              Item ID *
            </label>
            <input
              type="number"
              id="ItemId"
              name="ItemId"
              value={formData.ItemId || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('ItemId')}
              required
              min="1"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.ItemId ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., 101"
            />
            {fieldErrors.ItemId && (
              <small style={errorTextStyle}>{fieldErrors.ItemId}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Select the item for stock tracking
            </small>
          </div>

          <div>
            <label htmlFor="WarehouseId" style={labelStyle}>
              Warehouse ID *
            </label>
            <input
              type="number"
              id="WarehouseId"
              name="WarehouseId"
              value={formData.WarehouseId || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('WarehouseId')}
              required
              min="1"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.WarehouseId ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., 1"
            />
            {fieldErrors.WarehouseId && (
              <small style={errorTextStyle}>{fieldErrors.WarehouseId}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Select the warehouse location
            </small>
          </div>

          <div>
            <label htmlFor="Quantity" style={labelStyle}>
              Quantity *
            </label>
            <input
              type="number"
              id="Quantity"
              name="Quantity"
              value={formData.Quantity || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('Quantity')}
              required
              min="0"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.Quantity ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., 100"
            />
            {fieldErrors.Quantity && (
              <small style={errorTextStyle}>{fieldErrors.Quantity}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Current stock quantity
            </small>
          </div>
        </div>

        {formData.ItemId > 0 && formData.WarehouseId > 0 && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: `3px solid ${status.color}`
          }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                  Stock Status
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: status.color
                }}>
                  {status.text}
                </div>
              </div>
              <div style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: status.color
              }}>
                {formData.Quantity.toLocaleString()}
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: '10px',
              paddingTop: '15px',
              borderTop: '1px solid #ddd'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Item</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>#{formData.ItemId}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Warehouse</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>#{formData.WarehouseId}</div>
              </div>
            </div>
          </div>
        )}

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
            {submitting ? 'Saving...' : (stockToEdit ? 'Update Stock' : 'Create Stock')}
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