// Component to create or update items
'use client';

import React, { useState, useEffect } from 'react';
import { itemService } from '@/services/itemService';
import { Item } from '@/types/item.types';
import { useAuth } from '@/context/AuthContext';

interface ItemFormProps {
  itemToEdit?: Item | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ItemForm({ itemToEdit, onSuccess, onCancel }: ItemFormProps) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    ItemId: 0,
    ItemName: '',
    CategoryId: 0,
    UnitId: 0,
    SKU: '',
    Barcode: '',
    Description: '',
    UnitPrice: 0,
    ReorderLevel: 0,
    IsActive: true,
    CreatedAt: new Date().toISOString(),
    CreatedBy: user?.id || 0,
    ModifiyBy: 0,
    ModifiyAt: undefined as string | undefined,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        ItemId: itemToEdit.ItemId,
        ItemName: itemToEdit.ItemName,
        CategoryId: itemToEdit.CategoryId,
        UnitId: itemToEdit.UnitId,
        SKU: itemToEdit.SKU,
        Barcode: itemToEdit.Barcode,
        Description: itemToEdit.Description,
        UnitPrice: itemToEdit.UnitPrice,
        ReorderLevel: itemToEdit.ReorderLevel,
        IsActive: itemToEdit.IsActive,
        CreatedAt: itemToEdit.CreatedAt,
        CreatedBy: itemToEdit.CreatedBy,
        ModifiyBy: user?.id || 0,
        ModifiyAt: new Date().toISOString(),
      });
    } else {
      setFormData(prev => ({
        ...prev,
        ItemId: 0,
        ItemName: '',
        SKU: '',
        Barcode: '',
        Description: '',
        UnitPrice: 0,
        ReorderLevel: 0,
        IsActive: true,
        CreatedAt: new Date().toISOString(),
        CreatedBy: user?.id || 0,
        ModifiyBy: 0,
        ModifiyAt: undefined,
      }));
    }
  }, [itemToEdit, user]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (itemToEdit) {
        await itemService.updateItem(itemToEdit.ItemId, {
          ...formData,
          ModifiyAt: new Date().toISOString(),
        });
        alert('Item updated successfully!');
      } else {
        await itemService.createItem({
          ...formData,
          ModifiyAt: undefined, // ✅ do not send empty string
        });
        alert('Item created successfully!');
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data ||
        err.message ||
        'Operation failed';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked :
        ['ItemId', 'CategoryId', 'UnitId', 'ReorderLevel'].includes(name) ? Number(value) :
          name === 'UnitPrice' ? parseFloat(value) || 0 :
            value,
    });
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '900px'
    }}>
      <h2>{itemToEdit ? 'Edit Item' : 'Create New Item'}</h2>

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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          <div>
            <label htmlFor="ItemId" style={labelStyle}>Item ID *</label>
            <input
              type="number"
              id="ItemId"
              name="ItemId"
              value={formData.ItemId}
              onChange={handleChange}
              required
              disabled={!!itemToEdit}
              style={{ ...inputStyle, backgroundColor: itemToEdit ? '#e0e0e0' : 'white' }}
              placeholder="e.g., 1"
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label htmlFor="ItemName" style={labelStyle}>Item Name *</label>
            <input
              type="text"
              id="ItemName"
              name="ItemName"
              value={formData.ItemName}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., Product Name"
            />
          </div>

          <div>
            <label htmlFor="SKU" style={labelStyle}>SKU *</label>
            <input
              type="text"
              id="SKU"
              name="SKU"
              value={formData.SKU}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., SKU-001"
            />
          </div>

          <div>
            <label htmlFor="Barcode" style={labelStyle}>Barcode *</label>
            <input
              type="text"
              id="Barcode"
              name="Barcode"
              value={formData.Barcode}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., 123456789"
            />
          </div>

          <div>
            <label htmlFor="CategoryId" style={labelStyle}>Category ID *</label>
            <input
              type="number"
              id="CategoryId"
              name="CategoryId"
              value={formData.CategoryId}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., 1"
            />
          </div>

          <div>
            <label htmlFor="UnitId" style={labelStyle}>Unit ID *</label>
            <input
              type="number"
              id="UnitId"
              name="UnitId"
              value={formData.UnitId}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., 1"
            />
          </div>

          <div>
            <label htmlFor="UnitPrice" style={labelStyle}>Unit Price *</label>
            <input
              type="number"
              id="UnitPrice"
              name="UnitPrice"
              value={formData.UnitPrice}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              style={inputStyle}
              placeholder="e.g., 19.99"
            />
          </div>

          <div>
            <label htmlFor="ReorderLevel" style={labelStyle}>Reorder Level *</label>
            <input
              type="number"
              id="ReorderLevel"
              name="ReorderLevel"
              value={formData.ReorderLevel}
              onChange={handleChange}
              required
              min="0"
              style={inputStyle}
              placeholder="e.g., 10"
            />
          </div>
        </div>

        <div style={{ marginTop: '15px' }}>
          <label htmlFor="Description" style={labelStyle}>Description</label>
          <textarea
            id="Description"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
            placeholder="Item description..."
          />
        </div>

        <div style={{ marginTop: '15px', marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold' }}>
            <input
              type="checkbox"
              name="IsActive"
              checked={formData.IsActive}
              onChange={handleChange}
              style={{ marginRight: '10px', width: '20px', height: '20px', cursor: 'pointer' }}
            />
            Is Active
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
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
