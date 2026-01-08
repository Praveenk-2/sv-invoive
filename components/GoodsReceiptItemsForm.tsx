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
  }, [itemToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting goods receipt item:', err);
      console.error('Error response:', err?.response?.data);
      const errorMessage = err?.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(', ')
        : err?.response?.data?.message || err.message || 'Operation failed';
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
        ? Number(value)
        : name === 'UnitPrice'
        ? parseFloat(value) || 0
        : value,
    });
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
          <div>
            <label htmlFor="GRNItemId" style={labelStyle}>
              GRN Item ID *
            </label>
            <input
              type="number"
              id="GRNItemId"
              name="GRNItemId"
              value={formData.GRNItemId}
              onChange={handleChange}
              required
              disabled={!!itemToEdit}
              style={{
                ...inputStyle,
                backgroundColor: itemToEdit ? '#e0e0e0' : 'white',
              }}
              placeholder="e.g., 1"
            />
            {itemToEdit && (
              <small style={{ color: '#666', fontSize: '12px' }}>
                ID cannot be changed
              </small>
            )}
          </div>

          <div>
            <label htmlFor="GRNId" style={labelStyle}>
              GRN ID *
            </label>
            <input
              type="number"
              id="GRNId"
              name="GRNId"
              value={formData.GRNId}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., 1"
            />
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
            <label htmlFor="QuantityReceived" style={labelStyle}>
              Quantity Received *
            </label>
            <input
              type="number"
              id="QuantityReceived"
              name="QuantityReceived"
              value={formData.QuantityReceived}
              onChange={handleChange}
              required
              min="1"
              style={inputStyle}
              placeholder="e.g., 100"
            />
          </div>

          <div>
            <label htmlFor="UnitPrice" style={labelStyle}>
              Unit Price *
            </label>
            <input
              type="number"
              id="UnitPrice"
              name="UnitPrice"
              value={formData.UnitPrice}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              style={inputStyle}
              placeholder="e.g., 25.50"
            />
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
              required
              style={inputStyle}
              placeholder="e.g., BATCH-2024-001"
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="ExpiryDate" style={labelStyle}>
              Expiry Date
            </label>
            <input
              type="date"
              id="ExpiryDate"
              name="ExpiryDate"
              value={formData.ExpiryDate}
              onChange={handleChange}
              style={inputStyle}
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
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
            <small style={{ color: '#666', fontSize: '12px' }}>
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