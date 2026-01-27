'use client';

import React, { useState, useEffect } from 'react';
import { purchaseOrderItemsService } from '@/services/purchaseOrderItemsService';
import { PurchaseOrderItem } from '@/types/purchaseOrderItems.types';
import { useAuth } from '@/context/AuthContext';

interface PurchaseOrderItemsFormProps {
  itemToEdit?: PurchaseOrderItem | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PurchaseOrderItemsForm({ itemToEdit, onSuccess, onCancel }: PurchaseOrderItemsFormProps) {
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    POItemId: 0,
    POId: 0,
    ItemId: 0,
    Quantity: 0,
    UnitPrice: 0,
    Total: 0,
    CreatedBy: currentUser?.id || 0,
    CreatedAt: new Date().toISOString(),
    ModifiyBy: 0,
    ModifiyAt: null as string | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Field-specific errors
  const [fieldErrors, setFieldErrors] = useState({
    POId: '',
    ItemId: '',
    Quantity: '',
    UnitPrice: '',
  });

  useEffect(() => {
    if (itemToEdit) {
      console.log('Editing purchase order item:', itemToEdit);
      setFormData({
        POItemId: itemToEdit.POItemId,
        POId: itemToEdit.POId,
        ItemId: itemToEdit.ItemId,
        Quantity: itemToEdit.Quantity,
        UnitPrice: itemToEdit.UnitPrice,
        Total: itemToEdit.Total,
        CreatedBy: itemToEdit.CreatedBy,
        CreatedAt: itemToEdit.CreatedAt,
        ModifiyBy: currentUser?.id || 0,
        ModifiyAt: new Date().toISOString(),
      });
    } else {
      setFormData({
        POItemId: 0,
        POId: 0,
        ItemId: 0,
        Quantity: 0,
        UnitPrice: 0,
        Total: 0,
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });
    }
    // Clear errors when switching modes
    setFieldErrors({
      POId: '',
      ItemId: '',
      Quantity: '',
      UnitPrice: '',
    });
    setError('');
  }, [itemToEdit, currentUser]);

  // Auto-calculate total when quantity or unit price changes
  useEffect(() => {
    const calculatedTotal = formData.Quantity * formData.UnitPrice;
    if (calculatedTotal !== formData.Total) {
      setFormData(prev => ({ ...prev, Total: calculatedTotal }));
    }
  }, [formData.Quantity, formData.UnitPrice]);

  // Validation functions
  const validatePOId = (poId: number): string => {
    if (!poId || poId === 0) return 'Purchase Order ID is required';
    if (poId < 1) return 'Purchase Order ID must be a positive number';
    return '';
  };

  const validateItemId = (itemId: number): string => {
    if (!itemId || itemId === 0) return 'Item ID is required';
    if (itemId < 1) return 'Item ID must be a positive number';
    return '';
  };

  const validateQuantity = (quantity: number): string => {
    if (quantity === 0) return 'Quantity is required';
    if (quantity < 1) return 'Quantity must be at least 1';
    return '';
  };

  const validateUnitPrice = (price: number): string => {
    if (price === 0) return 'Unit price is required';
    if (price < 0) return 'Unit price cannot be negative';
    return '';
  };

  const handleBlur = (field: string) => {
    let errorMsg = '';
    
    switch (field) {
      case 'POId':
        errorMsg = validatePOId(formData.POId);
        break;
      case 'ItemId':
        errorMsg = validateItemId(formData.ItemId);
        break;
      case 'Quantity':
        errorMsg = validateQuantity(formData.Quantity);
        break;
      case 'UnitPrice':
        errorMsg = validateUnitPrice(formData.UnitPrice);
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
      POId: validatePOId(formData.POId),
      ItemId: validateItemId(formData.ItemId),
      Quantity: validateQuantity(formData.Quantity),
      UnitPrice: validateUnitPrice(formData.UnitPrice),
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

      if (itemToEdit) {
        console.log('Updating purchase order item with ID:', itemToEdit.POItemId);
        await purchaseOrderItemsService.updatePurchaseOrderItem(itemToEdit.POItemId, submitData);
        alert('Purchase order item updated successfully!');
      } else {
        console.log('Creating new purchase order item');
        await purchaseOrderItemsService.createPurchaseOrderItem(submitData);
        alert('Purchase order item created successfully!');
      }

      setFormData({
        POItemId: 0,
        POId: 0,
        ItemId: 0,
        Quantity: 0,
        UnitPrice: 0,
        Total: 0,
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });
      setFieldErrors({
        POId: '',
        ItemId: '',
        Quantity: '',
        UnitPrice: '',
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting purchase order item:', err);
      console.error('Error response:', err?.response?.data);
      
      // Handle different types of errors with user-friendly messages
      let errorMessage = '';
      
      if (err?.response?.status === 404) {
        errorMessage = 'Purchase Order ID or Item ID not found in the database. Please verify the IDs and try again.';
      } else if (err?.response?.status === 409) {
        errorMessage = 'This item already exists in the purchase order. Please check and try again.';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Unable to save the purchase order item. Please verify that both Purchase Order ID and Item ID exist in the system.';
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
      [name]: name === 'POItemId' || name === 'POId' || name === 'ItemId' || name === 'Quantity'
        ? Number(value) || 0
        : name === 'UnitPrice' || name === 'Total'
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '800px'
    }}>
      <h2>{itemToEdit ? 'Edit Purchase Order Item' : 'Create New Purchase Order Item'}</h2>

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
              <label htmlFor="POItemId" style={labelStyle}>
                PO Item ID
              </label>
              <input
                type="number"
                id="POItemId"
                name="POItemId"
                value={formData.POItemId}
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
            <label htmlFor="POId" style={labelStyle}>
              Purchase Order ID *
            </label>
            <input
              type="number"
              id="POId"
              name="POId"
              value={formData.POId || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('POId')}
              required
              min="1"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.POId ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., 1"
            />
            {fieldErrors.POId && (
              <small style={errorTextStyle}>{fieldErrors.POId}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Select the purchase order
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
              Select the item to order
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
              Number of units to order
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
            <label htmlFor="Total" style={labelStyle}>
              Total (Auto-calculated)
            </label>
            <input
              type="number"
              id="Total"
              name="Total"
              value={formData.Total}
              readOnly
              style={{
                ...inputStyle,
                backgroundColor: '#e0e0e0',
                fontWeight: 'bold',
                color: '#1565c0'
              }}
              placeholder="0.00"
            />
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Automatically calculated (Quantity × Unit Price)
            </small>
          </div>
        </div>

        {(formData.Quantity > 0 && formData.UnitPrice > 0) && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#e3f2fd',
            borderRadius: '8px',
            border: '2px solid #1976d2'
          }}>
            <div style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '14px', color: '#666' }}>Calculation:</span>
              <div style={{ fontSize: '16px', marginTop: '5px' }}>
                {formData.Quantity.toLocaleString()} units × {formatCurrency(formData.UnitPrice)}
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              paddingTop: '15px',
              borderTop: '2px solid #1976d2'
            }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1976d2' }}>
                Total Amount:
              </span>
              <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#1565c0' }}>
                {formatCurrency(formData.Total)}
              </span>
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