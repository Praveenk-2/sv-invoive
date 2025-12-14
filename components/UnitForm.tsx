// Component to create or update units
'use client';

import React, { useState, useEffect } from 'react';
import { unitService } from '@/services/unitService';
import { CreateUnitRequest, Unit } from '@/types/unit.types';

interface UnitFormProps {
  unitToEdit?: Unit | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function UnitForm({ unitToEdit, onSuccess, onCancel }: UnitFormProps) {
  const [formData, setFormData] = useState<CreateUnitRequest>({
    UnitId: 0,
    UnitName: '',
    Abbreviation: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (unitToEdit) {
      console.log('Editing unit:', unitToEdit);
      setFormData({
        UnitId: unitToEdit.UnitId,
        UnitName: unitToEdit.UnitName,
        Abbreviation: unitToEdit.Abbreviation,
      });
    } else {
      setFormData({
        UnitId: 0,
        UnitName: '',
        Abbreviation: '',
      });
    }
  }, [unitToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    console.log('Submitting form data:', formData);

    try {
      if (unitToEdit) {
        console.log('Updating unit with ID:', unitToEdit.UnitId);
        await unitService.updateUnit(unitToEdit.UnitId, formData);
        alert('Unit updated successfully!');
      } else {
        console.log('Creating new unit');
        await unitService.createUnit(formData);
        alert('Unit created successfully!');
      }

      setFormData({
        UnitId: 0,
        UnitName: '',
        Abbreviation: '',
      });
      
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting unit:', err);
      const errorMessage = err?.response?.data?.message || err.message || 'Operation failed';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'UnitId' ? Number(value) : value,
    });
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      // maxWidth: '600px'
    }}>
      <h2>{unitToEdit ? 'Edit Unit' : 'Create New Unit of Measurement'}</h2>

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
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="UnitId" style={labelStyle}>
            Unit ID *
          </label>
          <input
            type="number"
            id="UnitId"
            name="UnitId"
            value={formData.UnitId}
            onChange={handleChange}
            required
            disabled={!!unitToEdit}
            style={{
              ...inputStyle,
              backgroundColor: unitToEdit ? '#e0e0e0' : 'white',
            }}
            placeholder="e.g., 1"
          />
          {unitToEdit && (
            <small style={{ color: '#666', fontSize: '12px' }}>
              ID cannot be changed when editing
            </small>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="UnitName" style={labelStyle}>
            Unit Name *
          </label>
          <input
            type="text"
            id="UnitName"
            name="UnitName"
            value={formData.UnitName}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="e.g., Kilogram, Liter, Piece"
          />
          <small style={{ color: '#666', fontSize: '12px' }}>
            Full name of the unit of measurement
          </small>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="Abbreviation" style={labelStyle}>
            Abbreviation *
          </label>
          <input
            type="text"
            id="Abbreviation"
            name="Abbreviation"
            value={formData.Abbreviation}
            onChange={handleChange}
            required
            maxLength={10}
            style={inputStyle}
            placeholder="e.g., kg, L, pcs"
          />
          <small style={{ color: '#666', fontSize: '12px' }}>
            Short form (max 10 characters): kg, g, L, mL, pcs, etc.
          </small>
        </div>

        {/* Preview */}
        {(formData.UnitName || formData.Abbreviation) && (
          <div style={{
            padding: '15px',
            backgroundColor: '#e3f2fd',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #1976d2'
          }}>
            <strong style={{ color: '#1976d2' }}>Preview:</strong>
            <div style={{ marginTop: '10px', fontSize: '16px' }}>
              {formData.UnitName && (
                <span>
                  <strong>{formData.UnitName}</strong>
                </span>
              )}
              {formData.UnitName && formData.Abbreviation && ' - '}
              {formData.Abbreviation && (
                <code style={{
                  backgroundColor: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  color: '#1976d2'
                }}>
                  {formData.Abbreviation}
                </code>
              )}
            </div>
          </div>
        )}

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
            }}
          >
            {submitting ? 'Saving...' : (unitToEdit ? 'Update Unit' : 'Create Unit')}
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