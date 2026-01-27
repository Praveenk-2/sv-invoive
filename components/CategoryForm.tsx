// components/CategoryForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { categoryService } from '@/services/categoryService';
import { Category } from '@/types/category.types';
import { useAuth } from '@/context/AuthContext';

interface CategoryFormProps {
  categoryToEdit?: Category | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CategoryForm({ categoryToEdit, onSuccess, onCancel }: CategoryFormProps) {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    CategoryId: 0,
    CategoryName: '',
    Description: '',
    IsActive: true,
    CreatedAt: new Date().toISOString(),
    CreatedBy: user?.id || 0,
    ModifiyBy: 0,
    ModifiyAt: new Date().toISOString(),
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (categoryToEdit) {
      console.log('Editing category:', categoryToEdit);
      setFormData({
        CategoryId: categoryToEdit.CategoryId,
        CategoryName: categoryToEdit.CategoryName,
        Description: categoryToEdit.Description,
        IsActive: categoryToEdit.IsActive,
        CreatedAt: categoryToEdit.CreatedAt,
        CreatedBy: categoryToEdit.CreatedBy,
        ModifiyBy: user?.id || 0,
        ModifiyAt: new Date().toISOString(),
      });
    } else {
      setFormData({
        CategoryId: 0,
        CategoryName: '',
        Description: '',
        IsActive: true,
        CreatedAt: new Date().toISOString(),
        CreatedBy: user?.id || 0,
        ModifiyBy: 0,
        ModifiyAt: new Date().toISOString(),
      });
    }
  }, [categoryToEdit, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    console.log('Submitting category data:', formData);

    try {
      if (categoryToEdit) {
        console.log('Updating category with ID:', categoryToEdit.CategoryId);
        await categoryService.updateCategory(categoryToEdit.CategoryId, {
          ...formData,
          ModifiyAt: new Date().toISOString()
        });
        alert('Category updated successfully!');
      } else {
        console.log('Creating new category');
        await categoryService.createCategory({
          ...formData,
          ModifiyAt: new Date().toISOString()
        });
        alert('Category created successfully!');
      }

      setFormData({
        CategoryId: 0,
        CategoryName: '',
        Description: '',
        IsActive: true,
        CreatedAt: new Date().toISOString(),
        CreatedBy: user?.id || 0,
        ModifiyBy: 0,
        ModifiyAt: new Date().toISOString(),
      });
      
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting category:', err);
      console.error('Error response:', err?.response?.data);
      const errorMessage = err?.response?.data?.errors 
        ? Object.values(err.response.data.errors).flat().join(', ')
        : err?.response?.data?.message || err.message || 'Operation failed';
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
              name === 'CategoryId' ? Number(value) : 
              value,
    });
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '700px'
    }}>
      <h2>{categoryToEdit ? 'Edit Category' : 'Create New Category'}</h2>

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
        <div style={{ }}>
          {/* <div>
            <label htmlFor="CategoryId" style={labelStyle}>
              Category ID *
            </label>
            <input
              type="number"
              id="CategoryId"
              name="CategoryId"
              value={formData.CategoryId}
              onChange={handleChange}
              required
              disabled={!!categoryToEdit}
              style={{
                ...inputStyle,
                backgroundColor: categoryToEdit ? '#e0e0e0' : 'white',
              }}
              placeholder="e.g., 1"
            />
            {categoryToEdit && (
              <small style={{ color: '#666', fontSize: '12px' }}>
                ID cannot be changed
              </small>
            )}
          </div> */}

          <div>
            <label htmlFor="CategoryName" style={labelStyle}>
              Category Name *
            </label>
            <input
              type="text"
              id="CategoryName"
              name="CategoryName"
              value={formData.CategoryName}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., Electronics, Clothing, Food"
            />
          </div>
        </div>

        <div style={{ marginTop: '15px' }}>
          <label htmlFor="Description" style={labelStyle}>
            Description
          </label>
          <textarea
            id="Description"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            rows={3}
            style={{
              ...inputStyle,
              resize: 'vertical',
            }}
            placeholder="Describe this category..."
          />
        </div>

        <div style={{ marginTop: '15px', marginBottom: '15px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            <input
              type="checkbox"
              name="IsActive"
              checked={formData.IsActive}
              onChange={handleChange}
              style={{
                marginRight: '10px',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
              }}
            />
            Is Active
          </label>
          <small style={{ color: '#666', fontSize: '12px', marginLeft: '30px' }}>
            Active categories are visible to users
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
            {submitting ? 'Saving...' : (categoryToEdit ? 'Update Category' : 'Create Category')}
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