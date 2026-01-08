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
  }, [batchToEdit, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting item batch:', err);
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
      [name]: name === 'BatchId' || name === 'ItemId' || name === 'Quantity'
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
          <div>
            <label htmlFor="BatchId" style={labelStyle}>
              Batch ID *
            </label>
            <input
              type="number"
              id="BatchId"
              name="BatchId"
              value={formData.BatchId}
              onChange={handleChange}
              required
              disabled={!!batchToEdit}
              style={{
                ...inputStyle,
                backgroundColor: batchToEdit ? '#e0e0e0' : 'white',
              }}
              placeholder="e.g., 1"
            />
            {batchToEdit && (
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
              min="0"
              style={inputStyle}
              placeholder="e.g., 100"
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