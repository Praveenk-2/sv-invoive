'use client';

import React, { useState, useEffect } from 'react';
import { purchaseOrdersService } from '@/services/purchaseOrdersService';
import { PurchaseOrder } from '@/types/purchaseOrders.types';
import { useAuth } from '@/context/AuthContext';

interface PurchaseOrdersFormProps {
  poToEdit?: PurchaseOrder | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PurchaseOrdersForm({ poToEdit, onSuccess, onCancel }: PurchaseOrdersFormProps) {
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    POId: 0,
    PONumber: '',
    SupplierId: 0,
    PODate: new Date().toISOString(),
    Status: '',
    TotalAmount: 0,
    CreatedBy: currentUser?.id || 0,
    CreatedAt: new Date().toISOString(),
    ModifiyBy: 0,
    ModifiyAt: null as string | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Field-specific errors
  const [fieldErrors, setFieldErrors] = useState({
    PONumber: '',
    SupplierId: '',
    Status: '',
    TotalAmount: '',
  });

  useEffect(() => {
    if (poToEdit) {
      console.log('Editing purchase order:', poToEdit);
      setFormData({
        POId: poToEdit.POId,
        PONumber: poToEdit.PONumber,
        SupplierId: poToEdit.SupplierId,
        PODate: poToEdit.PODate,
        Status: poToEdit.Status,
        TotalAmount: poToEdit.TotalAmount,
        CreatedBy: poToEdit.CreatedBy,
        CreatedAt: poToEdit.CreatedAt,
        ModifiyBy: currentUser?.id || 0,
        ModifiyAt: new Date().toISOString(),
      });
    } else {
      setFormData({
        POId: 0,
        PONumber: '',
        SupplierId: 0,
        PODate: new Date().toISOString(),
        Status: '',
        TotalAmount: 0,
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });
    }
    // Clear errors when switching modes
    setFieldErrors({
      PONumber: '',
      SupplierId: '',
      Status: '',
      TotalAmount: '',
    });
    setError('');
  }, [poToEdit, currentUser]);

  // Validation functions
  const validatePONumber = (poNumber: string): string => {
    if (!poNumber || poNumber.trim() === '') return 'PO Number is required';
    if (poNumber.length < 3) return 'PO Number must be at least 3 characters';
    return '';
  };

  const validateSupplierId = (supplierId: number): string => {
    if (!supplierId || supplierId === 0) return 'Supplier ID is required';
    if (supplierId < 1) return 'Supplier ID must be a positive number';
    return '';
  };

  const validateStatus = (status: string): string => {
    if (!status || status.trim() === '') return 'Status is required';
    const validStatuses = ['DRAFT', 'PENDING', 'APPROVED', 'IN PROGRESS', 'PROCESSING', 'COMPLETED', 'REJECTED', 'CANCELLED'];
    if (!validStatuses.includes(status)) return 'Please select a valid status';
    return '';
  };

  const validateTotalAmount = (amount: number): string => {
    if (amount < 0) return 'Total amount cannot be negative';
    if (amount === 0) return 'Total amount must be greater than 0';
    return '';
  };

  const handleBlur = (field: string) => {
    let errorMsg = '';
    
    switch (field) {
      case 'PONumber':
        errorMsg = validatePONumber(formData.PONumber);
        break;
      case 'SupplierId':
        errorMsg = validateSupplierId(formData.SupplierId);
        break;
      case 'Status':
        errorMsg = validateStatus(formData.Status);
        break;
      case 'TotalAmount':
        errorMsg = validateTotalAmount(formData.TotalAmount);
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
      PONumber: validatePONumber(formData.PONumber),
      SupplierId: validateSupplierId(formData.SupplierId),
      Status: validateStatus(formData.Status),
      TotalAmount: validateTotalAmount(formData.TotalAmount),
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

      if (poToEdit) {
        console.log('Updating purchase order with ID:', poToEdit.POId);
        await purchaseOrdersService.updatePurchaseOrder(poToEdit.POId, submitData);
        alert('Purchase order updated successfully!');
      } else {
        console.log('Creating new purchase order');
        await purchaseOrdersService.createPurchaseOrder(submitData);
        alert('Purchase order created successfully!');
      }

      setFormData({
        POId: 0,
        PONumber: '',
        SupplierId: 0,
        PODate: new Date().toISOString(),
        Status: '',
        TotalAmount: 0,
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });
      setFieldErrors({
        PONumber: '',
        SupplierId: '',
        Status: '',
        TotalAmount: '',
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting purchase order:', err);
      console.error('Error response:', err?.response?.data);
      
      // Handle different types of errors with user-friendly messages
      let errorMessage = '';
      
      if (err?.response?.status === 404) {
        errorMessage = 'Supplier ID not found in the database. Please verify the Supplier ID and try again.';
      } else if (err?.response?.status === 409) {
        errorMessage = 'A purchase order with this PO Number already exists. Please use a unique PO Number.';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Unable to save the purchase order. Please verify that the Supplier ID exists in the system.';
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
      [name]: name === 'POId' || name === 'SupplierId'
        ? Number(value) || 0
        : name === 'TotalAmount'
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
      <h2>{poToEdit ? 'Edit Purchase Order' : 'Create New Purchase Order'}</h2>

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
          {poToEdit && (
            <div>
              <label htmlFor="POId" style={labelStyle}>
                PO ID
              </label>
              <input
                type="number"
                id="POId"
                name="POId"
                value={formData.POId}
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

          <div style={{ gridColumn: poToEdit ? 'auto' : 'span 2' }}>
            <label htmlFor="PONumber" style={labelStyle}>
              PO Number *
            </label>
            <input
              type="text"
              id="PONumber"
              name="PONumber"
              value={formData.PONumber}
              onChange={handleChange}
              onBlur={() => handleBlur('PONumber')}
              required
              style={{
                ...inputStyle,
                borderColor: fieldErrors.PONumber ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., PO-2024-001"
            />
            {fieldErrors.PONumber && (
              <small style={errorTextStyle}>{fieldErrors.PONumber}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Unique purchase order identifier
            </small>
          </div>

          <div>
            <label htmlFor="SupplierId" style={labelStyle}>
              Supplier ID *
            </label>
            <input
              type="number"
              id="SupplierId"
              name="SupplierId"
              value={formData.SupplierId || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('SupplierId')}
              required
              min="1"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.SupplierId ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., 1"
            />
            {fieldErrors.SupplierId && (
              <small style={errorTextStyle}>{fieldErrors.SupplierId}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Select the supplier
            </small>
          </div>

          <div>
            <label htmlFor="PODate" style={labelStyle}>
              PO Date *
            </label>
            <input
              type="datetime-local"
              id="PODate"
              name="PODate"
              value={formData.PODate.slice(0, 16)}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  PODate: new Date(e.target.value).toISOString()
                });
              }}
              required
              style={inputStyle}
            />
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Date and time of order
            </small>
          </div>

          <div>
            <label htmlFor="Status" style={labelStyle}>
              Status *
            </label>
            <select
              id="Status"
              name="Status"
              value={formData.Status}
              onChange={handleChange}
              onBlur={() => handleBlur('Status')}
              required
              style={{
                ...inputStyle,
                borderColor: fieldErrors.Status ? '#c62828' : '#ccc'
              }}
            >
              <option value="">Select Status</option>
              <option value="DRAFT">DRAFT</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="IN PROGRESS">IN PROGRESS</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
            {fieldErrors.Status && (
              <small style={errorTextStyle}>{fieldErrors.Status}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Current order status
            </small>
          </div>

          <div>
            <label htmlFor="TotalAmount" style={labelStyle}>
              Total Amount *
            </label>
            <input
              type="number"
              id="TotalAmount"
              name="TotalAmount"
              value={formData.TotalAmount || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('TotalAmount')}
              required
              min="0.01"
              step="0.01"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.TotalAmount ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., 5000.00"
            />
            {fieldErrors.TotalAmount && (
              <small style={errorTextStyle}>{fieldErrors.TotalAmount}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Total order value
            </small>
          </div>
        </div>

        {formData.TotalAmount > 0 && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#e3f2fd',
            borderRadius: '8px',
            border: '2px solid #1976d2'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1976d2' }}>
                Purchase Order Total:
              </span>
              <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#1565c0' }}>
                {formatCurrency(formData.TotalAmount)}
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
            {submitting ? 'Saving...' : (poToEdit ? 'Update Purchase Order' : 'Create Purchase Order')}
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