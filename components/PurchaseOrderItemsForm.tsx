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
  }, [itemToEdit, currentUser]);

  // Auto-calculate total when quantity or unit price changes
  useEffect(() => {
    const calculatedTotal = formData.Quantity * formData.UnitPrice;
    if (calculatedTotal !== formData.Total) {
      setFormData(prev => ({ ...prev, Total: calculatedTotal }));
    }
  }, [formData.Quantity, formData.UnitPrice]);

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

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting purchase order item:', err);
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
      [name]: name === 'POItemId' || name === 'POId' || name === 'ItemId' || name === 'Quantity'
        ? Number(value)
        : name === 'UnitPrice' || name === 'Total'
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
          <div>
            <label htmlFor="POItemId" style={labelStyle}>
              PO Item ID *
            </label>
            <input
              type="number"
              id="POItemId"
              name="POItemId"
              value={formData.POItemId}
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
            <small style={{ color: '#666', fontSize: '12px' }}>
              Automatically calculated
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