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
  }, [adjustmentToEdit, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting stock adjustment:', err);
      console.error('Error response:', err?.response?.data);
      const errorMessage = err?.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(', ')
        : err?.response?.data?.message || err.message || 'Operation failed';
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
        ? Number(value)
        : value,
    });
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
          <div>
            <label htmlFor="AdjustmentId" style={labelStyle}>
              Adjustment ID *
            </label>
            <input
              type="number"
              id="AdjustmentId"
              name="AdjustmentId"
              value={formData.AdjustmentId}
              onChange={handleChange}
              required
              disabled={!!adjustmentToEdit}
              style={{
                ...inputStyle,
                backgroundColor: adjustmentToEdit ? '#e0e0e0' : 'white',
              }}
              placeholder="e.g., 1"
            />
            {adjustmentToEdit && (
              <small style={{ color: '#666', fontSize: '12px' }}>
                ID cannot be changed
              </small>
            )}
          </div>

          <div>
            <label htmlFor="ItemId" style={labelStyle}>
              Item ID *
            </label>
            <input
              type="number"
              id="ItemId"
              name="ItemId"
              value={formData.ItemId}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., 101"
            />
          </div>

          <div>
            <label htmlFor="WarehouseId" style={labelStyle}>
              Warehouse ID *
            </label>
            <input
              type="number"
              id="WarehouseId"
              name="WarehouseId"
              value={formData.WarehouseId}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., 1"
            />
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
              required
              style={inputStyle}
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
          </div>

          <div>
            <label htmlFor="Quantity" style={labelStyle}>
              Quantity *
            </label>
            <input
              type="number"
              id="Quantity"
              name="Quantity"
              value={formData.Quantity}
              onChange={handleChange}
              required
              min="1"
              style={inputStyle}
              placeholder="e.g., 50"
            />
          </div>

          <div>
            <label htmlFor="AdjustedBy" style={labelStyle}>
              Adjusted By (User ID) *
            </label>
            <input
              type="number"
              id="AdjustedBy"
              name="AdjustedBy"
              value={formData.AdjustedBy}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., 1"
            />
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
              required
              style={{
                ...inputStyle,
                minHeight: '100px',
                resize: 'vertical'
              }}
              placeholder="Explain the reason for this stock adjustment..."
            />
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