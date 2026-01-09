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
  }, [ledgerToEdit, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting stock ledger:', err);
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
      [name]: ['LedgerId', 'ItemId', 'WarehouseId', 'Quantity', 'ReferenceId'].includes(name) 
        ? Number(value) 
        : value,
    });
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
          <div>
            <label htmlFor="LedgerId" style={labelStyle}>
              Ledger ID *
            </label>
            <input
              type="number"
              id="LedgerId"
              name="LedgerId"
              value={formData.LedgerId}
              onChange={handleChange}
              required
              disabled={!!ledgerToEdit}
              style={{
                ...inputStyle,
                backgroundColor: ledgerToEdit ? '#e0e0e0' : 'white',
              }}
              placeholder="e.g., 1"
            />
            {ledgerToEdit && (
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
            <label htmlFor="ChangeType" style={labelStyle}>
              Change Type *
            </label>
            <select
              id="ChangeType"
              name="ChangeType"
              value={formData.ChangeType}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="IN">IN - Stock Incoming</option>
              <option value="OUT">OUT - Stock Outgoing</option>
              <option value="ADJUSTMENT">ADJUSTMENT - Inventory Adjustment</option>
              <option value="RETURN">RETURN - Stock Return</option>
              <option value="TRANSFER">TRANSFER - Warehouse Transfer</option>
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
              style={inputStyle}
              placeholder="e.g., 100 or -50"
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
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
              required
              style={inputStyle}
              placeholder="e.g., PURCHASE_ORDER, SALE, etc."
            />
          </div>

          <div>
            <label htmlFor="ReferenceId" style={labelStyle}>
              Reference ID *
            </label>
            <input
              type="number"
              id="ReferenceId"
              name="ReferenceId"
              value={formData.ReferenceId}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., 5001"
            />
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
          </div>
        </div>

        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '4px',
          fontSize: '13px'
        }}>
          <strong>Note:</strong> This transaction will affect the inventory levels for Item #{formData.ItemId} 
          in Warehouse #{formData.WarehouseId}. Please verify the details before submitting.
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