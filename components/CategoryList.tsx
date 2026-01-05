// Component to display list of categories
'use client';

import React from 'react';
import { useCategories } from '@/hooks/useCategories';
import { categoryService } from '@/services/categoryService';
import { Category } from '@/types/category.types';

interface CategoryListProps {
  onEdit?: (category: Category) => void;
}

export default function CategoryList({ onEdit }: CategoryListProps) {
  const { categories, loading, error, refetch } = useCategories();

  const handleDelete = async (id: number) => {
    console.log('Deleting category with ID:', id);
    
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoryService.deleteCategory(id);
      alert('Category deleted successfully!');
      refetch();
    } catch (err: any) {
      console.error('Error deleting category:', err);
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to delete category';
      alert(errorMsg);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserName = (userId: number) => {
    if (!userId) return '-';
    return `User #${userId}`;
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading categories...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        color: '#d32f2f',
        backgroundColor: '#ffebee',
        borderRadius: '4px',
        margin: '20px'
      }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>All Categories ({categories.length})</h2>
      
      {categories.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No categories found. Create your first category!
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }} className='scroll-bar'>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            marginTop: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            minWidth: '1100px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                <th style={tableHeaderStyle}>Category ID</th>
                <th style={tableHeaderStyle}>Category Name</th>
                <th style={tableHeaderStyle}>Description</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Created At</th>
                <th style={tableHeaderStyle}>Created By</th>
                <th style={tableHeaderStyle}>Modified By</th>
                <th style={tableHeaderStyle}>Modified At</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.CategoryId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tableCellStyle}>{category.CategoryId}</td>
                  <td style={tableCellStyle}>
                    <strong style={{ color: '#1976d2' }}>{category.CategoryName}</strong>
                  </td>
                  <td style={tableCellStyle}>
                    {category.Description ? (
                      <span style={{ color: '#666', fontSize: '13px' }}>
                        {category.Description.length > 60 
                          ? `${category.Description.substring(0, 60)}...` 
                          : category.Description}
                      </span>
                    ) : (
                      <span style={{ color: '#999', fontStyle: 'italic' }}>No description</span>
                    )}
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: category.IsActive ? '#4caf50' : '#f44336',
                      color: 'white',
                    }}>
                      {category.IsActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(category.CreatedAt)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#e3f2fd', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(category.CreatedBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ 
                      backgroundColor: '#fff3e0', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(category.ModifiyBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(category.ModifiyAt)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {onEdit && (
                        <button
                          onClick={() => {
                            console.log('Editing category:', category);
                            onEdit(category);
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(category.CategoryId)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#d32f2f',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  padding: '12px',
  textAlign: 'left',
  fontWeight: 'bold',
};

const tableCellStyle: React.CSSProperties = {
  padding: '12px',
};