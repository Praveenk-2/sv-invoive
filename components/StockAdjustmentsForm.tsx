'use client';

import React, { useState, useEffect } from 'react';
import { stockAdjustmentsService } from '@/services/stockAdjustmentsService';
import { StockAdjustment } from '@/types/stockAdjustments.types';
import { useAuth } from '@/context/AuthContext';

interface StockAdjustmentsFormProps {
  adjustmentToEdit?: StockAdjustment | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function StockAdjustmentsForm({ adjustmentToEdit, onSuccess, onCancel }: StockAdjustmentsFormProps) {
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    AdjustmentId: 0,
    ItemId: 0,
    WarehouseId: 0,
    AdjustmentType: '',
    Quantity: 0,
    Reason: '',
    AdjustedBy: currentUser?.id || 0,
    AdjustedDate: new Date().toISOString(),
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
    AdjustmentType: '',
    Quantity: '',
    Reason: '',
    AdjustedBy: '',
  });

  useEffect(() => {
    if (adjustmentToEdit) {
      console.log('Editing stock adjustment:', adjustmentToEdit);
      setFormData({
        AdjustmentId: adjustmentToEdit.AdjustmentId,
        ItemId: adjustmentToEdit.ItemId,
        WarehouseId: adjustmentToEdit.WarehouseId,
        AdjustmentType: adjustmentToEdit.AdjustmentType,
        Quantity: adjustmentToEdit.Quantity,
        Reason: adjustmentToEdit.Reason,
        AdjustedBy: adjustmentToEdit.AdjustedBy,
        AdjustedDate: adjustmentToEdit.AdjustedDate,
        CreatedBy: adjustmentToEdit.CreatedBy,
        CreatedAt: adjustmentToEdit.CreatedAt,
        ModifiyBy: currentUser?.id || 0,
        ModifiyAt: new Date().toISOString(),
      });
    } else {
      setFormData({
        AdjustmentId: 0,
        ItemId: 0,
        WarehouseId: 0,
        AdjustmentType: '',
        Quantity: 0,
        Reason: '',
        AdjustedBy: currentUser?.id || 0,
        AdjustedDate: new Date().toISOString(),
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
      AdjustmentType: '',
      Quantity: '',
      Reason: '',
      AdjustedBy: '',
    });
    setError('');
  }, [adjustmentToEdit, currentUser]);

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

  const validateAdjustmentType = (type: string): string => {
    if (!type || type.trim() === '') return 'Adjustment type is required';
    const validTypes = ['INCREASE', 'DECREASE', 'ADD', 'REMOVE', 'IN', 'OUT', 'CORRECTION', 'ADJUST', 'TRANSFER'];
    if (!validTypes.includes(type)) return 'Please select a valid adjustment type';
    return '';
  };

  const validateQuantity = (quantity: number): string => {
    if (quantity === 0) return 'Quantity is required';
    if (quantity < 1) return 'Quantity must be at least 1';
    return '';
  };

  const validateReason = (reason: string): string => {
    if (!reason || reason.trim() === '') return 'Reason is required';
    if (reason.length < 10) return 'Reason must be at least 10 characters';
    if (reason.length > 500) return 'Reason must not exceed 500 characters';
    return '';
  };

  const validateAdjustedBy = (adjustedBy: number): string => {
    if (!adjustedBy || adjustedBy === 0) return 'Adjusted By (User ID) is required';
    if (adjustedBy < 1) return 'Adjusted By must be a valid User ID';
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
      case 'AdjustmentType':
        errorMsg = validateAdjustmentType(formData.AdjustmentType);
        break;
      case 'Quantity':
        errorMsg = validateQuantity(formData.Quantity);
        break;
      case 'Reason':
        errorMsg = validateReason(formData.Reason);
        break;
      case 'AdjustedBy':
        errorMsg = validateAdjustedBy(formData.AdjustedBy);
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
      AdjustmentType: validateAdjustmentType(formData.AdjustmentType),
      Quantity: validateQuantity(formData.Quantity),
      Reason: validateReason(formData.Reason),
      AdjustedBy: validateAdjustedBy(formData.AdjustedBy),
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
        ModifiyAt: new Date().toISOString()
      };

      if (adjustmentToEdit) {
        console.log('Updating stock adjustment with ID:', adjustmentToEdit.AdjustmentId);
        await stockAdjustmentsService.updateStockAdjustment(adjustmentToEdit.AdjustmentId, submitData);
        alert('Stock adjustment updated successfully!');
      } else {
        console.log('Creating new stock adjustment');
        await stockAdjustmentsService.createStockAdjustment(submitData);
        alert('Stock adjustment created successfully!');
      }

      setFormData({
        AdjustmentId: 0,
        ItemId: 0,
        WarehouseId: 0,
        AdjustmentType: '',
        Quantity: 0,
        Reason: '',
        AdjustedBy: currentUser?.id || 0,
        AdjustedDate: new Date().toISOString(),
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });
      setFieldErrors({
        ItemId: '',
        WarehouseId: '',
        AdjustmentType: '',
        Quantity: '',
        Reason: '',
        AdjustedBy: '',
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting stock adjustment:', err);
      console.error('Error response:', err?.response?.data);
      
      // Handle different types of errors with user-friendly messages
      let errorMessage = '';
      
      if (err?.response?.status === 404) {
        errorMessage = 'Item ID, Warehouse ID, or User ID not found in the database. Please verify the IDs and try again.';
      } else if (err?.response?.status === 409) {
        errorMessage = 'This stock adjustment conflicts with existing records. Please check your data and try again.';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Unable to save the stock adjustment. Please verify that Item ID, Warehouse ID, and User ID exist in the system.';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'AdjustmentId' || name === 'ItemId' || name === 'WarehouseId' || name === 'Quantity' || name === 'AdjustedBy'
        ? Number(value) || 0
        : value,
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
      maxWidth: '800px'
    }}>
      <h2>{adjustmentToEdit ? 'Edit Stock Adjustment' : 'Create New Stock Adjustment'}</h2>

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
          {adjustmentToEdit && (
            <div>
              <label htmlFor="AdjustmentId" style={labelStyle}>
                Adjustment ID
              </label>
              <input
                type="number"
                id="AdjustmentId"
                name="AdjustmentId"
                value={formData.AdjustmentId}
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

          <div style={{ gridColumn: adjustmentToEdit ? 'auto' : 'span 2' }}>
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
              Select the item to adjust
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
              Warehouse location
            </small>
          </div>

          <div>
            <label htmlFor="AdjustmentType" style={labelStyle}>
              Adjustment Type *
            </label>
            <select
              id="AdjustmentType"
              name="AdjustmentType"
              value={formData.AdjustmentType}
              onChange={handleChange}
              onBlur={() => handleBlur('AdjustmentType')}
              required
              style={{
                ...inputStyle,
                borderColor: fieldErrors.AdjustmentType ? '#c62828' : '#ccc'
              }}
            >
              <option value="">Select Type</option>
              <option value="INCREASE">INCREASE</option>
              <option value="DECREASE">DECREASE</option>
              <option value="ADD">ADD</option>
              <option value="REMOVE">REMOVE</option>
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
              <option value="CORRECTION">CORRECTION</option>
              <option value="ADJUST">ADJUST</option>
              <option value="TRANSFER">TRANSFER</option>
            </select>
            {fieldErrors.AdjustmentType && (
              <small style={errorTextStyle}>{fieldErrors.AdjustmentType}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Type of adjustment
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
              min="1"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.Quantity ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., 50"
            />
            {fieldErrors.Quantity && (
              <small style={errorTextStyle}>{fieldErrors.Quantity}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Number of units to adjust
            </small>
          </div>

          <div>
            <label htmlFor="AdjustedBy" style={labelStyle}>
              Adjusted By (User ID) *
            </label>
            <input
              type="number"
              id="AdjustedBy"
              name="AdjustedBy"
              value={formData.AdjustedBy || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('AdjustedBy')}
              required
              min="1"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.AdjustedBy ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., 1"
            />
            {fieldErrors.AdjustedBy && (
              <small style={errorTextStyle}>{fieldErrors.AdjustedBy}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              User making the adjustment
            </small>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="AdjustedDate" style={labelStyle}>
              Adjusted Date *
            </label>
            <input
              type="datetime-local"
              id="AdjustedDate"
              name="AdjustedDate"
              value={formData.AdjustedDate.slice(0, 16)}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  AdjustedDate: new Date(e.target.value).toISOString()
                });
              }}
              required
              style={inputStyle}
            />
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Date and time of adjustment
            </small>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="Reason" style={labelStyle}>
              Reason *
            </label>
            <textarea
              id="Reason"
              name="Reason"
              value={formData.Reason}
              onChange={handleChange}
              onBlur={() => handleBlur('Reason')}
              required
              style={{
                ...inputStyle,
                minHeight: '100px',
                resize: 'vertical',
                borderColor: fieldErrors.Reason ? '#c62828' : '#ccc'
              }}
              placeholder="Explain the reason for this stock adjustment..."
              maxLength={500}
            />
            {fieldErrors.Reason && (
              <small style={errorTextStyle}>{fieldErrors.Reason}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Min 10 characters, max 500 characters ({formData.Reason.length}/500)
            </small>
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
            {submitting ? 'Saving...' : (adjustmentToEdit ? 'Update Adjustment' : 'Create Adjustment')}
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