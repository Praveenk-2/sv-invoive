'use client';

import React, { useState, useEffect } from 'react';
import { goodsReceiptItemsService } from '@/services/goodsReceiptItemsService';
import { GoodsReceiptItem } from '@/types/goodsReceiptItems.types';

interface GoodsReceiptItemsFormProps {
  itemToEdit?: GoodsReceiptItem | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function GoodsReceiptItemsForm({ itemToEdit, onSuccess, onCancel }: GoodsReceiptItemsFormProps) {
  const [formData, setFormData] = useState({
    GRNItemId: 0,
    GRNId: 0,
    ItemId: 0,
    QuantityReceived: 0,
    UnitPrice: 0,
    BatchNo: '',
    ExpiryDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Field-specific errors
  const [fieldErrors, setFieldErrors] = useState({
    GRNId: '',
    ItemId: '',
    QuantityReceived: '',
    UnitPrice: '',
    BatchNo: '',
    ExpiryDate: '',
  });

  useEffect(() => {
    if (itemToEdit) {
      console.log('Editing goods receipt item:', itemToEdit);
      setFormData({
        GRNItemId: itemToEdit.GRNItemId,
        GRNId: itemToEdit.GRNId,
        ItemId: itemToEdit.ItemId,
        QuantityReceived: itemToEdit.QuantityReceived,
        UnitPrice: itemToEdit.UnitPrice,
        BatchNo: itemToEdit.BatchNo,
        ExpiryDate: itemToEdit.ExpiryDate ? itemToEdit.ExpiryDate.slice(0, 10) : '',
      });
    } else {
      setFormData({
        GRNItemId: 0,
        GRNId: 0,
        ItemId: 0,
        QuantityReceived: 0,
        UnitPrice: 0,
        BatchNo: '',
        ExpiryDate: '',
      });
    }
    // Clear errors when switching modes
    setFieldErrors({
      GRNId: '',
      ItemId: '',
      QuantityReceived: '',
      UnitPrice: '',
      BatchNo: '',
      ExpiryDate: '',
    });
    setError('');
  }, [itemToEdit]);

  // Validation functions
  const validateGRNId = (grnId: number): string => {
    if (!grnId || grnId === 0) return 'GRN ID is required';
    if (grnId < 1) return 'GRN ID must be a positive number';
    return '';
  };

  const validateItemId = (itemId: number): string => {
    if (!itemId || itemId === 0) return 'Item ID is required';
    if (itemId < 1) return 'Item ID must be a positive number';
    return '';
  };

  const validateQuantityReceived = (quantity: number): string => {
    if (quantity === 0) return 'Quantity received is required';
    if (quantity < 1) return 'Quantity must be at least 1';
    return '';
  };

  const validateUnitPrice = (price: number): string => {
    if (price === 0) return 'Unit price is required';
    if (price < 0) return 'Unit price cannot be negative';
    return '';
  };

  const validateBatchNo = (batchNo: string): string => {
    if (!batchNo || batchNo.trim() === '') return 'Batch number is required';
    if (batchNo.length < 3) return 'Batch number must be at least 3 characters';
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
      case 'GRNId':
        errorMsg = validateGRNId(formData.GRNId);
        break;
      case 'ItemId':
        errorMsg = validateItemId(formData.ItemId);
        break;
      case 'QuantityReceived':
        errorMsg = validateQuantityReceived(formData.QuantityReceived);
        break;
      case 'UnitPrice':
        errorMsg = validateUnitPrice(formData.UnitPrice);
        break;
      case 'BatchNo':
        errorMsg = validateBatchNo(formData.BatchNo);
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
      GRNId: validateGRNId(formData.GRNId),
      ItemId: validateItemId(formData.ItemId),
      QuantityReceived: validateQuantityReceived(formData.QuantityReceived),
      UnitPrice: validateUnitPrice(formData.UnitPrice),
      BatchNo: validateBatchNo(formData.BatchNo),
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
        ExpiryDate: formData.ExpiryDate ? new Date(formData.ExpiryDate).toISOString() : undefined
      };

      if (itemToEdit) {
        console.log('Updating goods receipt item with ID:', itemToEdit.GRNItemId);
        await goodsReceiptItemsService.updateGoodsReceiptItem(itemToEdit.GRNItemId, submitData);
        alert('Goods receipt item updated successfully!');
      } else {
        console.log('Creating new goods receipt item');
        await goodsReceiptItemsService.createGoodsReceiptItem(submitData);
        alert('Goods receipt item created successfully!');
      }

      setFormData({
        GRNItemId: 0,
        GRNId: 0,
        ItemId: 0,
        QuantityReceived: 0,
        UnitPrice: 0,
        BatchNo: '',
        ExpiryDate: '',
      });
      setFieldErrors({
        GRNId: '',
        ItemId: '',
        QuantityReceived: '',
        UnitPrice: '',
        BatchNo: '',
        ExpiryDate: '',
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting goods receipt item:', err);
      console.error('Error response:', err?.response?.data);
      
      // Handle different types of errors with user-friendly messages
      let errorMessage = '';
      
      if (err?.response?.status === 404) {
        errorMessage = 'GRN ID or Item ID not found in the database. Please verify the IDs and try again.';
      } else if (err?.response?.status === 409) {
        errorMessage = 'This item already exists in the goods receipt or the batch number conflicts. Please check and try again.';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Unable to save the goods receipt item. Please verify that both GRN ID and Item ID exist in the system.';
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
      [name]: name === 'GRNItemId' || name === 'GRNId' || name === 'ItemId' || name === 'QuantityReceived'
        ? Number(value) || 0
        : name === 'UnitPrice'
        ? parseFloat(value) || 0
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

  const calculateTotal = () => {
    return (formData.QuantityReceived * formData.UnitPrice).toFixed(2);
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '800px'
    }}>
      <h2>{itemToEdit ? 'Edit Goods Receipt Item' : 'Create New Goods Receipt Item'}</h2>

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
          {itemToEdit && (
            <div>
              <label htmlFor="GRNItemId" style={labelStyle}>
                GRN Item ID
              </label>
              <input
                type="number"
                id="GRNItemId"
                name="GRNItemId"
                value={formData.GRNItemId}
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

          <div style={{ gridColumn: itemToEdit ? 'auto' : 'span 2' }}>
            <label htmlFor="GRNId" style={labelStyle}>
              GRN ID *
            </label>
            <input
              type="number"
              id="GRNId"
              name="GRNId"
              value={formData.GRNId || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('GRNId')}
              required
              min="1"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.GRNId ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., 1"
            />
            {fieldErrors.GRNId && (
              <small style={errorTextStyle}>{fieldErrors.GRNId}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Select the goods receipt
            </small>
          </div>

          <div>
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
              Select the item received
            </small>
          </div>

          <div>
            <label htmlFor="QuantityReceived" style={labelStyle}>
              Quantity Received *
            </label>
            <input
              type="number"
              id="QuantityReceived"
              name="QuantityReceived"
              value={formData.QuantityReceived || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('QuantityReceived')}
              required
              min="1"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.QuantityReceived ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., 100"
            />
            {fieldErrors.QuantityReceived && (
              <small style={errorTextStyle}>{fieldErrors.QuantityReceived}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Number of units received
            </small>
          </div>

          <div>
            <label htmlFor="UnitPrice" style={labelStyle}>
              Unit Price *
            </label>
            <input
              type="number"
              id="UnitPrice"
              name="UnitPrice"
              value={formData.UnitPrice || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('UnitPrice')}
              required
              min="0.01"
              step="0.01"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.UnitPrice ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., 25.50"
            />
            {fieldErrors.UnitPrice && (
              <small style={errorTextStyle}>{fieldErrors.UnitPrice}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Price per unit
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

        {(formData.QuantityReceived > 0 && formData.UnitPrice > 0) && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#e3f2fd',
            borderRadius: '4px',
            border: '2px solid #1976d2'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1976d2' }}>
                Total Amount:
              </span>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1565c0' }}>
                ${calculateTotal()}
              </span>
            </div>
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              {formData.QuantityReceived} units × ${formData.UnitPrice.toFixed(2)}
            </small>
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
            {submitting ? 'Saving...' : (itemToEdit ? 'Update Item' : 'Create Item')}
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