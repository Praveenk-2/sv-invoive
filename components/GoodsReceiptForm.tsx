'use client';

import React, { useState, useEffect } from 'react';
import { goodsReceiptService } from '@/services/goodsReceiptService';
import { GoodsReceipt } from '@/types/goodsReceipt.types';
import { useAuth } from '@/context/AuthContext';

interface GoodsReceiptFormProps {
  grnToEdit?: GoodsReceipt | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function GoodsReceiptForm({ grnToEdit, onSuccess, onCancel }: GoodsReceiptFormProps) {
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    GRNId: 0,
    GRNNumber: '',
    POId: 0,
    ReceivedDate: new Date().toISOString(),
    ReceivedBy: currentUser?.id || 0,
    Status: '',
    CreatedBy: currentUser?.id || 0,
    CreatedAt: new Date().toISOString(),
    ModifiyBy: 0,
    ModifiyAt: null as string | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Field-specific errors
  const [fieldErrors, setFieldErrors] = useState({
    GRNNumber: '',
    POId: '',
    ReceivedBy: '',
    Status: '',
  });

  useEffect(() => {
    if (grnToEdit) {
      console.log('Editing goods receipt:', grnToEdit);
      setFormData({
        GRNId: grnToEdit.GRNId,
        GRNNumber: grnToEdit.GRNNumber,
        POId: grnToEdit.POId,
        ReceivedDate: grnToEdit.ReceivedDate,
        ReceivedBy: grnToEdit.ReceivedBy,
        Status: grnToEdit.Status,
        CreatedBy: grnToEdit.CreatedBy,
        CreatedAt: grnToEdit.CreatedAt,
        ModifiyBy: currentUser?.id || 0,
        ModifiyAt: new Date().toISOString(),
      });
    } else {
      setFormData({
        GRNId: 0,
        GRNNumber: '',
        POId: 0,
        ReceivedDate: new Date().toISOString(),
        ReceivedBy: currentUser?.id || 0,
        Status: '',
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });
    }
    // Clear errors when switching modes
    setFieldErrors({
      GRNNumber: '',
      POId: '',
      ReceivedBy: '',
      Status: '',
    });
    setError('');
  }, [grnToEdit, currentUser]);

  // Validation functions
  const validateGRNNumber = (grnNumber: string): string => {
    if (!grnNumber || grnNumber.trim() === '') return 'GRN Number is required';
    if (grnNumber.length < 3) return 'GRN Number must be at least 3 characters';
    return '';
  };

  const validatePOId = (poId: number): string => {
    if (!poId || poId === 0) return 'Purchase Order ID is required';
    if (poId < 1) return 'Purchase Order ID must be a positive number';
    return '';
  };

  const validateReceivedBy = (receivedBy: number): string => {
    if (!receivedBy || receivedBy === 0) return 'Received By (User ID) is required';
    if (receivedBy < 1) return 'Received By must be a valid User ID';
    return '';
  };

  const validateStatus = (status: string): string => {
    if (!status || status.trim() === '') return 'Status is required';
    const validStatuses = ['PENDING', 'RECEIVED', 'PARTIAL', 'COMPLETED', 'REJECTED', 'CANCELLED', 'IN PROGRESS'];
    if (!validStatuses.includes(status)) return 'Please select a valid status';
    return '';
  };

  const handleBlur = (field: string) => {
    let errorMsg = '';
    
    switch (field) {
      case 'GRNNumber':
        errorMsg = validateGRNNumber(formData.GRNNumber);
        break;
      case 'POId':
        errorMsg = validatePOId(formData.POId);
        break;
      case 'ReceivedBy':
        errorMsg = validateReceivedBy(formData.ReceivedBy);
        break;
      case 'Status':
        errorMsg = validateStatus(formData.Status);
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
      GRNNumber: validateGRNNumber(formData.GRNNumber),
      POId: validatePOId(formData.POId),
      ReceivedBy: validateReceivedBy(formData.ReceivedBy),
      Status: validateStatus(formData.Status),
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
      if (grnToEdit) {
        console.log('Updating goods receipt with ID:', grnToEdit.GRNId);
        await goodsReceiptService.updateGoodsReceipt(grnToEdit.GRNId, {
          ...formData,
          ModifiyAt: new Date().toISOString()
        });
        alert('Goods receipt updated successfully!');
      } else {
        console.log('Creating new goods receipt');
        await goodsReceiptService.createGoodsReceipt({
          ...formData,
          ModifiyAt: new Date().toISOString()
        });
        alert('Goods receipt created successfully!');
      }

      setFormData({
        GRNId: 0,
        GRNNumber: '',
        POId: 0,
        ReceivedDate: new Date().toISOString(),
        ReceivedBy: currentUser?.id || 0,
        Status: '',
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });
      setFieldErrors({
        GRNNumber: '',
        POId: '',
        ReceivedBy: '',
        Status: '',
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting goods receipt:', err);
      console.error('Error response:', err?.response?.data);
      
      // Handle different types of errors with user-friendly messages
      let errorMessage = '';
      
      if (err?.response?.status === 404) {
        errorMessage = 'Purchase Order ID or User ID not found in the database. Please verify the IDs and try again.';
      } else if (err?.response?.status === 409) {
        errorMessage = 'A goods receipt with this GRN Number already exists. Please use a unique GRN Number.';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Unable to save the goods receipt. Please verify that the Purchase Order ID and User ID exist in the system.';
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
      [name]: name === 'GRNId' || name === 'POId' || name === 'ReceivedBy' ? Number(value) || 0 : value,
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
      <h2>{grnToEdit ? 'Edit Goods Receipt' : 'Create New Goods Receipt'}</h2>

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
          {grnToEdit && (
            <div>
              <label htmlFor="GRNId" style={labelStyle}>
                GRN ID
              </label>
              <input
                type="number"
                id="GRNId"
                name="GRNId"
                value={formData.GRNId}
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

          <div style={{ gridColumn: grnToEdit ? 'auto' : 'span 2' }}>
            <label htmlFor="GRNNumber" style={labelStyle}>
              GRN Number *
            </label>
            <input
              type="text"
              id="GRNNumber"
              name="GRNNumber"
              value={formData.GRNNumber}
              onChange={handleChange}
              onBlur={() => handleBlur('GRNNumber')}
              required
              style={{
                ...inputStyle,
                borderColor: fieldErrors.GRNNumber ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., GRN-2024-001"
            />
            {fieldErrors.GRNNumber && (
              <small style={errorTextStyle}>{fieldErrors.GRNNumber}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Unique goods receipt identifier
            </small>
          </div>

          <div>
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
              placeholder="e.g., 123"
            />
            {fieldErrors.POId && (
              <small style={errorTextStyle}>{fieldErrors.POId}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Related purchase order
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
              <option value="PENDING">PENDING</option>
              <option value="RECEIVED">RECEIVED</option>
              <option value="PARTIAL">PARTIAL</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="IN PROGRESS">IN PROGRESS</option>
            </select>
            {fieldErrors.Status && (
              <small style={errorTextStyle}>{fieldErrors.Status}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Current receipt status
            </small>
          </div>

          <div>
            <label htmlFor="ReceivedBy" style={labelStyle}>
              Received By (User ID) *
            </label>
            <input
              type="number"
              id="ReceivedBy"
              name="ReceivedBy"
              value={formData.ReceivedBy || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('ReceivedBy')}
              required
              min="1"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.ReceivedBy ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., 1"
            />
            {fieldErrors.ReceivedBy && (
              <small style={errorTextStyle}>{fieldErrors.ReceivedBy}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              User who received the goods
            </small>
          </div>

          <div>
            <label htmlFor="ReceivedDate" style={labelStyle}>
              Received Date *
            </label>
            <input
              type="datetime-local"
              id="ReceivedDate"
              name="ReceivedDate"
              value={formData.ReceivedDate.slice(0, 16)}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  ReceivedDate: new Date(e.target.value).toISOString()
                });
              }}
              required
              style={inputStyle}
            />
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Date and time goods were received
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
            {submitting ? 'Saving...' : (grnToEdit ? 'Update Goods Receipt' : 'Create Goods Receipt')}
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