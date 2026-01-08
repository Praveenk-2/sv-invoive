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
  }, [grnToEdit, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting goods receipt:', err);
      console.error('Error response:', err?.response?.data);
      const errorMessage = err?.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(', ')
        : err?.response?.data?.message || err.message || 'Operation failed';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'GRNId' || name === 'POId' || name === 'ReceivedBy' ? Number(value) : value,
    });
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
              disabled={!!grnToEdit}
              style={{
                ...inputStyle,
                backgroundColor: grnToEdit ? '#e0e0e0' : 'white',
              }}
              placeholder="e.g., 1"
            />
            {grnToEdit && (
              <small style={{ color: '#666', fontSize: '12px' }}>
                ID cannot be changed
              </small>
            )}
          </div>

          <div>
            <label htmlFor="GRNNumber" style={labelStyle}>
              GRN Number *
            </label>
            <input
              type="text"
              id="GRNNumber"
              name="GRNNumber"
              value={formData.GRNNumber}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., GRN-2024-001"
            />
          </div>

          <div>
            <label htmlFor="POId" style={labelStyle}>
              Purchase Order ID *
            </label>
            <input
              type="number"
              id="POId"
              name="POId"
              value={formData.POId}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., 123"
            />
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
              required
              style={inputStyle}
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
          </div>

          <div>
            <label htmlFor="ReceivedBy" style={labelStyle}>
              Received By (User ID) *
            </label>
            <input
              type="number"
              id="ReceivedBy"
              name="ReceivedBy"
              value={formData.ReceivedBy}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., 1"
            />
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