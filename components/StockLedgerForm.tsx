// components/StockLedgerForm.tsx
// Component to create or update stock ledgers
'use client';

import React, { useState, useEffect } from 'react';
import { stockLedgerService } from '@/services/stockLedgerService';
import { StockLedger } from '@/types/Stockledger.types';
import { useAuth } from '@/context/AuthContext';

interface StockLedgerFormProps {
  ledgerToEdit?: StockLedger | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function StockLedgerForm({ ledgerToEdit, onSuccess, onCancel }: StockLedgerFormProps) {
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    LedgerId: 0,
    ItemId: 0,
    WarehouseId: 0,
    ChangeType: 'IN',
    Quantity: 0,
    ReferenceType: '',
    ReferenceId: 0,
    TransactionDate: new Date().toISOString().slice(0, 16),
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
    ChangeType: '',
    Quantity: '',
    ReferenceType: '',
    ReferenceId: '',
  });

  useEffect(() => {
    if (ledgerToEdit) {
      console.log('Editing stock ledger:', ledgerToEdit);
      setFormData({
        LedgerId: ledgerToEdit.LedgerId,
        ItemId: ledgerToEdit.ItemId,
        WarehouseId: ledgerToEdit.WarehouseId,
        ChangeType: ledgerToEdit.ChangeType,
        Quantity: ledgerToEdit.Quantity,
        ReferenceType: ledgerToEdit.ReferenceType,
        ReferenceId: ledgerToEdit.ReferenceId,
        TransactionDate: ledgerToEdit.TransactionDate.slice(0, 16),
        CreatedBy: ledgerToEdit.CreatedBy,
        CreatedAt: ledgerToEdit.CreatedAt,
        ModifiyBy: currentUser?.id || 0,
        ModifiyAt: new Date().toISOString(),
      });
    } else {
      setFormData({
        LedgerId: 0,
        ItemId: 0,
        WarehouseId: 0,
        ChangeType: 'IN',
        Quantity: 0,
        ReferenceType: '',
        ReferenceId: 0,
        TransactionDate: new Date().toISOString().slice(0, 16),
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
      ChangeType: '',
      Quantity: '',
      ReferenceType: '',
      ReferenceId: '',
    });
    setError('');
  }, [ledgerToEdit, currentUser]);

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

  const validateChangeType = (changeType: string): string => {
    if (!changeType || changeType.trim() === '') return 'Change type is required';
    const validTypes = ['IN', 'OUT', 'ADJUSTMENT', 'RETURN', 'TRANSFER'];
    if (!validTypes.includes(changeType)) return 'Please select a valid change type';
    return '';
  };

  const validateQuantity = (quantity: number): string => {
    if (quantity === 0) return 'Quantity cannot be zero';
    // Note: We allow negative quantities for OUT transactions
    return '';
  };

  const validateReferenceType = (refType: string): string => {
    if (!refType || refType.trim() === '') return 'Reference type is required';
    if (refType.length < 2) return 'Reference type must be at least 2 characters';
    return '';
  };

  const validateReferenceId = (refId: number): string => {
    if (!refId || refId === 0) return 'Reference ID is required';
    if (refId < 1) return 'Reference ID must be a positive number';
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
      case 'ChangeType':
        errorMsg = validateChangeType(formData.ChangeType);
        break;
      case 'Quantity':
        errorMsg = validateQuantity(formData.Quantity);
        break;
      case 'ReferenceType':
        errorMsg = validateReferenceType(formData.ReferenceType);
        break;
      case 'ReferenceId':
        errorMsg = validateReferenceId(formData.ReferenceId);
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
      ChangeType: validateChangeType(formData.ChangeType),
      Quantity: validateQuantity(formData.Quantity),
      ReferenceType: validateReferenceType(formData.ReferenceType),
      ReferenceId: validateReferenceId(formData.ReferenceId),
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
      const submissionData = {
        ...formData,
        TransactionDate: new Date(formData.TransactionDate).toISOString(),
        ModifiyAt: new Date().toISOString()
      };

      if (ledgerToEdit) {
        console.log('Updating stock ledger with ID:', ledgerToEdit.LedgerId);
        await stockLedgerService.updateStockLedger(ledgerToEdit.LedgerId, submissionData);
        alert('Stock ledger updated successfully!');
      } else {
        console.log('Creating new stock ledger');
        await stockLedgerService.createStockLedger(submissionData);
        alert('Stock ledger created successfully!');
      }

      setFormData({
        LedgerId: 0,
        ItemId: 0,
        WarehouseId: 0,
        ChangeType: 'IN',
        Quantity: 0,
        ReferenceType: '',
        ReferenceId: 0,
        TransactionDate: new Date().toISOString().slice(0, 16),
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });
      setFieldErrors({
        ItemId: '',
        WarehouseId: '',
        ChangeType: '',
        Quantity: '',
        ReferenceType: '',
        ReferenceId: '',
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting stock ledger:', err);
      console.error('Error response:', err?.response?.data);
      
      // Handle different types of errors with user-friendly messages
      let errorMessage = '';
      
      if (err?.response?.status === 404) {
        errorMessage = 'Item ID, Warehouse ID, or Reference ID not found in the database. Please verify the IDs and try again.';
      } else if (err?.response?.status === 409) {
        errorMessage = 'This stock ledger entry conflicts with existing records. Please check your data and try again.';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Unable to save the stock ledger entry. Please verify that Item ID and Warehouse ID exist in the system.';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['LedgerId', 'ItemId', 'WarehouseId', 'Quantity', 'ReferenceId'].includes(name) 
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
      maxWidth: '900px'
    }}>
      <h2>{ledgerToEdit ? 'Edit Stock Ledger Entry' : 'Create New Stock Ledger Entry'}</h2>

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
          {ledgerToEdit && (
            <div>
              <label htmlFor="LedgerId" style={labelStyle}>
                Ledger ID
              </label>
              <input
                type="number"
                id="LedgerId"
                name="LedgerId"
                value={formData.LedgerId}
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

          <div style={{ gridColumn: ledgerToEdit ? 'auto' : 'span 2' }}>
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
              Select the item for this transaction
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
            <label htmlFor="ChangeType" style={labelStyle}>
              Change Type *
            </label>
            <select
              id="ChangeType"
              name="ChangeType"
              value={formData.ChangeType}
              onChange={handleChange}
              onBlur={() => handleBlur('ChangeType')}
              required
              style={{
                ...inputStyle,
                borderColor: fieldErrors.ChangeType ? '#c62828' : '#ccc'
              }}
            >
              <option value="IN">IN - Stock Incoming</option>
              <option value="OUT">OUT - Stock Outgoing</option>
              <option value="ADJUSTMENT">ADJUSTMENT - Inventory Adjustment</option>
              <option value="RETURN">RETURN - Stock Return</option>
              <option value="TRANSFER">TRANSFER - Warehouse Transfer</option>
            </select>
            {fieldErrors.ChangeType && (
              <small style={errorTextStyle}>{fieldErrors.ChangeType}</small>
            )}
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
              style={{
                ...inputStyle,
                borderColor: fieldErrors.Quantity ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., 100 or -50"
            />
            {fieldErrors.Quantity && (
              <small style={errorTextStyle}>{fieldErrors.Quantity}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Use positive for IN, negative for OUT
            </small>
          </div>

          <div>
            <label htmlFor="ReferenceType" style={labelStyle}>
              Reference Type *
            </label>
            <input
              type="text"
              id="ReferenceType"
              name="ReferenceType"
              value={formData.ReferenceType}
              onChange={handleChange}
              onBlur={() => handleBlur('ReferenceType')}
              required
              style={{
                ...inputStyle,
                borderColor: fieldErrors.ReferenceType ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., PURCHASE_ORDER, SALE, etc."
            />
            {fieldErrors.ReferenceType && (
              <small style={errorTextStyle}>{fieldErrors.ReferenceType}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Transaction reference type
            </small>
          </div>

          <div>
            <label htmlFor="ReferenceId" style={labelStyle}>
              Reference ID *
            </label>
            <input
              type="number"
              id="ReferenceId"
              name="ReferenceId"
              value={formData.ReferenceId || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('ReferenceId')}
              required
              min="1"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.ReferenceId ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., 5001"
            />
            {fieldErrors.ReferenceId && (
              <small style={errorTextStyle}>{fieldErrors.ReferenceId}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Related transaction ID
            </small>
          </div>

          <div>
            <label htmlFor="TransactionDate" style={labelStyle}>
              Transaction Date *
            </label>
            <input
              type="datetime-local"
              id="TransactionDate"
              name="TransactionDate"
              value={formData.TransactionDate}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Date and time of transaction
            </small>
          </div>
        </div>

        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '4px',
          fontSize: '13px'
        }}>
          <strong>Note:</strong> This transaction will affect the inventory levels for Item #{formData.ItemId || '?'} 
          in Warehouse #{formData.WarehouseId || '?'}. Please verify the details before submitting.
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
            {submitting ? 'Saving...' : (ledgerToEdit ? 'Update Entry' : 'Create Entry')}
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