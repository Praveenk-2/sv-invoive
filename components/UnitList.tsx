// Component to display list of units
'use client';

import React from 'react';
import { useUnits } from '@/hooks/useUnits';
import { unitService } from '@/services/unitService';
import { Unit } from '@/types/unit.types';

interface UnitListProps {
  onEdit?: (unit: Unit) => void;
}

export default function UnitList({ onEdit }: UnitListProps) {
  const { units, loading, error, refetch } = useUnits();

  const handleDelete = async (id: number) => {
    console.log('Deleting unit with ID:', id);
    
    if (!confirm('Are you sure you want to delete this unit?')) return;

    try {
      await unitService.deleteUnit(id);
      alert('Unit deleted successfully!');
      refetch();
    } catch (err: any) {
      console.error('Error deleting unit:', err);
      const errorMsg = err?.response?.data?.message || err.message || 'Failed to delete unit';
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
        Loading units...
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
    <div >
      <h2>All Units of Measurement ({units.length})</h2>
      
      {units.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>
          No units found. Create your first unit of measurement!
        </p>
      ) : (
        <div className='scroll-bar' style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            marginTop: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                <th style={tableHeaderStyle}>Unit ID</th>
                <th style={tableHeaderStyle}>Unit Name</th>
                <th style={tableHeaderStyle}>Abbreviation</th>
                <th style={tableHeaderStyle}>Created By</th>
                <th style={tableHeaderStyle}>Created At</th>
                <th style={tableHeaderStyle}>Modified By</th>
                <th style={tableHeaderStyle}>Modified At</th>

                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit.UnitId} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tableCellStyle}>{unit.UnitId}</td>
                  <td style={tableCellStyle}>
                    <strong style={{color: '#524f4f'}}>{unit.UnitName}</strong>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{
                      padding: '6px 12px',
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}>
                      {unit.Abbreviation}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ backgroundColor: '#e3f2fd', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {getUserName(unit.CreatedBy)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>
                      {formatDate(unit.CreatedAt)}
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>{getUserName(unit.ModifiyBy)}</span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{ fontSize: '13px', color: '#666' }}>{formatDate(unit.ModifiyAt)}</span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {onEdit && (
                        <button
                          onClick={() => {
                            console.log('Editing unit:', unit);
                            onEdit(unit);
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
                        onClick={() => handleDelete(unit.UnitId)}
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