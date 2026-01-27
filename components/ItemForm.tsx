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

  // Field-specific errors
  const [fieldErrors, setFieldErrors] = useState({
    ItemName: '',
    CategoryId: '',
    UnitId: '',
    SKU: '',
    Barcode: '',
    UnitPrice: '',
    ReorderLevel: '',
  });

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
    // Clear errors when switching modes
    setFieldErrors({
      ItemName: '',
      CategoryId: '',
      UnitId: '',
      SKU: '',
      Barcode: '',
      UnitPrice: '',
      ReorderLevel: '',
    });
    setError('');
  }, [itemToEdit, user]);

  // Validation functions
  const validateItemName = (name: string): string => {
    if (!name || name.trim() === '') return 'Item name is required';
    if (name.length < 2) return 'Item name must be at least 2 characters';
    return '';
  };

  const validateCategoryId = (categoryId: number): string => {
    if (!categoryId || categoryId === 0) return 'Category ID is required';
    if (categoryId < 1) return 'Category ID must be a positive number';
    return '';
  };

  const validateUnitId = (unitId: number): string => {
    if (!unitId || unitId === 0) return 'Unit ID is required';
    if (unitId < 1) return 'Unit ID must be a positive number';
    return '';
  };

  const validateSKU = (sku: string): string => {
    if (!sku || sku.trim() === '') return 'SKU is required';
    if (sku.length < 2) return 'SKU must be at least 2 characters';
    return '';
  };

  const validateBarcode = (barcode: string): string => {
    if (!barcode || barcode.trim() === '') return 'Barcode is required';
    return '';
  };

  const validateUnitPrice = (price: number): string => {
    if (price < 0) return 'Unit price cannot be negative';
    if (price === 0) return 'Unit price is required';
    return '';
  };

  const validateReorderLevel = (level: number): string => {
    if (level < 0) return 'Reorder level cannot be negative';
    return '';
  };

  const handleBlur = (field: string) => {
    let errorMsg = '';
    
    switch (field) {
      case 'ItemName':
        errorMsg = validateItemName(formData.ItemName);
        break;
      case 'CategoryId':
        errorMsg = validateCategoryId(formData.CategoryId);
        break;
      case 'UnitId':
        errorMsg = validateUnitId(formData.UnitId);
        break;
      case 'SKU':
        errorMsg = validateSKU(formData.SKU);
        break;
      case 'Barcode':
        errorMsg = validateBarcode(formData.Barcode);
        break;
      case 'UnitPrice':
        errorMsg = validateUnitPrice(formData.UnitPrice);
        break;
      case 'ReorderLevel':
        errorMsg = validateReorderLevel(formData.ReorderLevel);
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
      ItemName: validateItemName(formData.ItemName),
      CategoryId: validateCategoryId(formData.CategoryId),
      UnitId: validateUnitId(formData.UnitId),
      SKU: validateSKU(formData.SKU),
      Barcode: validateBarcode(formData.Barcode),
      UnitPrice: validateUnitPrice(formData.UnitPrice),
      ReorderLevel: validateReorderLevel(formData.ReorderLevel),
    };

    setFieldErrors(errors);

    // Check if there are any validation errors
    const hasErrors = Object.values(errors).some(err => err !== '');
    if (hasErrors) {
      setError('Please fix all validation errors before submitting');
      return;
    }

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
          ModifiyAt: undefined,
        });
        alert('Item created successfully!');
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting item:', err);
      console.error('Error response:', err?.response?.data);
      
      // Handle different types of errors with user-friendly messages
      let errorMessage = '';
      
      if (err?.response?.status === 404) {
        errorMessage = 'Category ID or Unit ID not found in the database. Please verify the IDs and try again.';
      } else if (err?.response?.status === 409) {
        errorMessage = 'An item with this SKU or Barcode already exists. Please use a unique SKU and Barcode.';
      } else if (err?.response?.status === 500) {
        errorMessage = 'Unable to save the item. Please verify that Category ID and Unit ID exist in the system.';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked :
        ['ItemId', 'CategoryId', 'UnitId', 'ReorderLevel'].includes(name) ? Number(value) || 0 :
          name === 'UnitPrice' ? parseFloat(value) || 0 :
            value,
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
          {itemToEdit && (
            <div>
              <label htmlFor="ItemId" style={labelStyle}>Item ID</label>
              <input
                type="number"
                id="ItemId"
                name="ItemId"
                value={formData.ItemId}
                disabled
                style={{ ...inputStyle, backgroundColor: '#e0e0e0' }}
              />
              <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                ID cannot be changed
              </small>
            </div>
          )}

          <div style={{ gridColumn: itemToEdit ? 'span 2' : 'span 3' }}>
            <label htmlFor="ItemName" style={labelStyle}>Item Name *</label>
            <input
              type="text"
              id="ItemName"
              name="ItemName"
              value={formData.ItemName}
              onChange={handleChange}
              onBlur={() => handleBlur('ItemName')}
              required
              style={{
                ...inputStyle,
                borderColor: fieldErrors.ItemName ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., Product Name"
            />
            {fieldErrors.ItemName && (
              <small style={errorTextStyle}>{fieldErrors.ItemName}</small>
            )}
          </div>

          <div>
            <label htmlFor="SKU" style={labelStyle}>SKU *</label>
            <input
              type="text"
              id="SKU"
              name="SKU"
              value={formData.SKU}
              onChange={handleChange}
              onBlur={() => handleBlur('SKU')}
              required
              style={{
                ...inputStyle,
                borderColor: fieldErrors.SKU ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., SKU-001"
            />
            {fieldErrors.SKU && (
              <small style={errorTextStyle}>{fieldErrors.SKU}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Unique product identifier
            </small>
          </div>

          <div>
            <label htmlFor="Barcode" style={labelStyle}>Barcode *</label>
            <input
              type="text"
              id="Barcode"
              name="Barcode"
              value={formData.Barcode}
              onChange={handleChange}
              onBlur={() => handleBlur('Barcode')}
              required
              style={{
                ...inputStyle,
                borderColor: fieldErrors.Barcode ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., 123456789"
            />
            {fieldErrors.Barcode && (
              <small style={errorTextStyle}>{fieldErrors.Barcode}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Unique barcode number
            </small>
          </div>

          <div>
            <label htmlFor="CategoryId" style={labelStyle}>Category ID *</label>
            <input
              type="number"
              id="CategoryId"
              name="CategoryId"
              value={formData.CategoryId || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('CategoryId')}
              required
              min="1"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.CategoryId ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., 1"
            />
            {fieldErrors.CategoryId && (
              <small style={errorTextStyle}>{fieldErrors.CategoryId}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Select item category
            </small>
          </div>

          <div>
            <label htmlFor="UnitId" style={labelStyle}>Unit ID *</label>
            <input
              type="number"
              id="UnitId"
              name="UnitId"
              value={formData.UnitId || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('UnitId')}
              required
              min="1"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.UnitId ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., 1"
            />
            {fieldErrors.UnitId && (
              <small style={errorTextStyle}>{fieldErrors.UnitId}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Select measurement unit
            </small>
          </div>

          <div>
            <label htmlFor="UnitPrice" style={labelStyle}>Unit Price *</label>
            <input
              type="number"
              id="UnitPrice"
              name="UnitPrice"
              value={formData.UnitPrice || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('UnitPrice')}
              required
              step="0.01"
              min="0"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.UnitPrice ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., 19.99"
            />
            {fieldErrors.UnitPrice && (
              <small style={errorTextStyle}>{fieldErrors.UnitPrice}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Price per unit
            </small>
          </div>

          <div>
            <label htmlFor="ReorderLevel" style={labelStyle}>Reorder Level *</label>
            <input
              type="number"
              id="ReorderLevel"
              name="ReorderLevel"
              value={formData.ReorderLevel || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('ReorderLevel')}
              required
              min="0"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.ReorderLevel ? '#c62828' : '#ccc'
              }}
              placeholder="e.g., 10"
            />
            {fieldErrors.ReorderLevel && (
              <small style={errorTextStyle}>{fieldErrors.ReorderLevel}</small>
            )}
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
              Minimum stock before reorder
            </small>
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
            placeholder="Item description (optional)..."
          />
          <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
            Optional detailed description
          </small>
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
          <small style={{ color: '#666', fontSize: '12px', marginLeft: '30px', display: 'block', marginTop: '4px' }}>
            Active items are available for transactions
          </small>
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

const errorTextStyle: React.CSSProperties = {
  color: '#c62828',
  fontSize: '12px',
  display: 'block',
  marginTop: '4px',
  fontWeight: '500'
};