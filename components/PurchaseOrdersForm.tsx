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
  }, [poToEdit, currentUser]);

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

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting purchase order:', err);
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
      [name]: name === 'POId' || name === 'SupplierId'
        ? Number(value)
        : name === 'TotalAmount'
        ? parseFloat(value) || 0
        : value,
    });
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
          <div>
            <label htmlFor="POId" style={labelStyle}>
              PO ID *
            </label>
            <input
              type="number"
              id="POId"
              name="POId"
              value={formData.POId}
              onChange={handleChange}
              required
              disabled={!!poToEdit}
              style={{
                ...inputStyle,
                backgroundColor: poToEdit ? '#e0e0e0' : 'white',
              }}
              placeholder="e.g., 1"
            />
            {poToEdit && (
              <small style={{ color: '#666', fontSize: '12px' }}>
                ID cannot be changed
              </small>
            )}
          </div>

          <div>
            <label htmlFor="PONumber" style={labelStyle}>
              PO Number *
            </label>
            <input
              type="text"
              id="PONumber"
              name="PONumber"
              value={formData.PONumber}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., PO-2024-001"
            />
          </div>

          <div>
            <label htmlFor="SupplierId" style={labelStyle}>
              Supplier ID *
            </label>
            <input
              type="number"
              id="SupplierId"
              name="SupplierId"
              value={formData.SupplierId}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., 1"
            />
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
              <option value="DRAFT">DRAFT</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="IN PROGRESS">IN PROGRESS</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="REJECTED">REJECTED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div>
            <label htmlFor="TotalAmount" style={labelStyle}>
              Total Amount *
            </label>
            <input
              type="number"
              id="TotalAmount"
              name="TotalAmount"
              value={formData.TotalAmount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              style={inputStyle}
              placeholder="e.g., 5000.00"
            />
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