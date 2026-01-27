'use client';

import React, { useState, useEffect } from 'react';
import { itemBatchesService } from '@/services/itemBatchesService';
import { ItemBatch } from '@/types/itemBatches.types';
import { useAuth } from '@/context/AuthContext';

interface ItemBatchesFormProps {
  batchToEdit?: ItemBatch | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ItemBatchesForm({ batchToEdit, onSuccess, onCancel }: ItemBatchesFormProps) {
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    BatchId: 0,
    ItemId: 0,
    BatchNo: '',
    Quantity: 0,
    ExpiryDate: '',
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
    BatchNo: '',
    Quantity: '',
    ExpiryDate: '',
  });

  useEffect(() => {
    if (batchToEdit) {
      console.log('Editing item batch:', batchToEdit);
      setFormData({
        BatchId: batchToEdit.BatchId,
        ItemId: batchToEdit.ItemId,
        BatchNo: batchToEdit.BatchNo,
        Quantity: batchToEdit.Quantity,
        ExpiryDate: batchToEdit.ExpiryDate ? batchToEdit.ExpiryDate.slice(0, 10) : '',
        CreatedBy: batchToEdit.CreatedBy,
        CreatedAt: batchToEdit.CreatedAt,
        ModifiyBy: currentUser?.id || 0,
        ModifiyAt: new Date().toISOString(),
      });
    } else {
      setFormData({
        BatchId: 0,
        ItemId: 0,
        BatchNo: '',
        Quantity: 0,
        ExpiryDate: '',
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });
    }
    // Clear errors when switching modes
    setFieldErrors({
      ItemId: '',
      BatchNo: '',
      Quantity: '',
      ExpiryDate: '',
    });
    setError('');
  }, [batchToEdit, currentUser]);

  // Validation functions
  const validateItemId = (itemId: number): string => {
    if (!itemId || itemId === 0) return 'Item ID is required';
    if (itemId < 1) return 'Item ID must be a positive number';
    return '';
  };

  const validateBatchNo = (batchNo: string): string => {
    if (!batchNo || batchNo.trim() === '') return 'Batch number is required';
    if (batchNo.length < 3) return 'Batch number must be at least 3 characters';
    return '';
  };

  const validateQuantity = (quantity: number): string => {
    if (quantity === 0) return 'Quantity is required';
    if (quantity < 0) return 'Quantity cannot be negative';
    if (quantity < 1) return 'Quantity must be at least 1';
    return '';
  };

  const validateExpiryDate = (date: string): string => {
    if (date) {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        return 'Expiry date cannot be in the past';
      }
    }
    return '';
  };

  const handleBlur = (field: string) => {
    let errorMsg = '';
    
    switch (field) {
      case 'ItemId':
        errorMsg = validateItemId(formData.ItemId);
        break;
      case 'BatchNo':
        errorMsg = validateBatchNo(formData.BatchNo);
        break;
      case 'Quantity':
        errorMsg = validateQuantity(formData.Quantity);
        break;
      case 'ExpiryDate':
        errorMsg = validateExpiryDate(formData.ExpiryDate);
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
      BatchNo: validateBatchNo(formData.BatchNo),
      Quantity: validateQuantity(formData.Quantity),
      ExpiryDate: validateExpiryDate(formData.ExpiryDate),
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
        ExpiryDate: formData.ExpiryDate ? new Date(formData.ExpiryDate).toISOString() : undefined,
        ModifiyAt: new Date().toISOString()
      };

      if (batchToEdit) {
        console.log('Updating item batch with ID:', batchToEdit.BatchId);
        await itemBatchesService.updateItemBatch(batchToEdit.BatchId, submitData);
        alert('Item batch updated successfully!');
      } else {
        console.log('Creating new item batch');
        await itemBatchesService.createItemBatch(submitData);
        alert('Item batch created successfully!');
      }

      setFormData({
        BatchId: 0,
        ItemId: 0,
        BatchNo: '',
        Quantity: 0,
        ExpiryDate: '',
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });
      setFieldErrors({
        ItemId: '',
        BatchNo: '',
        Quantity: '',
        ExpiryDate: '',
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting item batch:', err);
      console.error('Error response:', err?.response?.data);
      
      // Handle different types of errors with user-friendly messages
      let errorMessage = '';
      
      if (err?.response?.status === 404) {
        errorMessage = 'Item ID not found in the database. Please verify the Item ID and try again.';
      } else if (err?.response?.status === 409) {
        errorMessage = 'A batch with this Batch Number already exists. Please use a unique batch number.';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Unable to save the batch. Please verify that the Item ID exists in the system.';
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
      [name]: name === 'BatchId' || name === 'ItemId' || name === 'Quantity'
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
      <h2>{batchToEdit ? 'Edit Item Batch' : 'Create New Item Batch'}</h2>

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
          {batchToEdit && (
            <div>
              <label htmlFor="BatchId" style={labelStyle}>
                Batch ID
              </label>
              <input
                type="number"
                id="BatchId"
                name="BatchId"
                value={formData.BatchId}
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

          <div style={{ gridColumn: batchToEdit ? 'auto' : '1 / -1' }}>
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
              Select the item for this batch
            </small>
          </div>

          <div>
            <label htmlFor="BatchNo" style={labelStyle}>
              Batch Number *
            </label>
            <input
              type="text"
              id="BatchNo"
              name="BatchNo"
              value={formData.BatchNo}
              onChange={handleChange}
              onBlur={() => handleBlur('BatchNo')}
              required
              style={{
                ...inputStyle,
                borderColor: fieldErrors.BatchNo ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., BATCH-2024-001"
            />
            {fieldErrors.BatchNo && (
              <small style={errorTextStyle}>{fieldErrors.BatchNo}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Unique batch identifier
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
              placeholder="e.g., 100"
            />
            {fieldErrors.Quantity && (
              <small style={errorTextStyle}>{fieldErrors.Quantity}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Number of items in this batch
            </small>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="ExpiryDate" style={labelStyle}>
              Expiry Date (Optional)
            </label>
            <input
              type="date"
              id="ExpiryDate"
              name="ExpiryDate"
              value={formData.ExpiryDate}
              onChange={handleChange}
              onBlur={() => handleBlur('ExpiryDate')}
              style={{
                ...inputStyle,
                borderColor: fieldErrors.ExpiryDate ? '#c62828' : '#ccc'
              }}
            />
            {fieldErrors.ExpiryDate && (
              <small style={errorTextStyle}>{fieldErrors.ExpiryDate}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Leave blank if not applicable
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
            {submitting ? 'Saving...' : (batchToEdit ? 'Update Batch' : 'Create Batch')}
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