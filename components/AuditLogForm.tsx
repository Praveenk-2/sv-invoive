'use client';

import React, { useState, useEffect } from 'react';
import { auditLogService } from '@/services/auditLogService';
import { AuditLog } from '@/types/auditlog.types';
import { useAuth } from '@/context/AuthContext';

interface AuditLogFormProps {
  logToEdit?: AuditLog | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AuditLogForm({ logToEdit, onSuccess, onCancel }: AuditLogFormProps) {
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    LogId: 0,
    TableName: '',
    RecordId: 0,
    Action: '',
    OldValue: '',
    NewValue: '',
    ChangedBy: currentUser?.id || 0,
    ChangedAt: new Date().toISOString(),
    CreatedBy: currentUser?.id || 0,
    CreatedAt: new Date().toISOString(),
    ModifiyBy: 0,
    ModifiyAt: null as string | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (logToEdit) {
      console.log('Editing audit log:', logToEdit);
      setFormData({
        LogId: logToEdit.LogId,
        TableName: logToEdit.TableName,
        RecordId: logToEdit.RecordId,
        Action: logToEdit.Action,
        OldValue: logToEdit.OldValue || '',
        NewValue: logToEdit.NewValue || '',
        ChangedBy: logToEdit.ChangedBy,
        ChangedAt: logToEdit.ChangedAt,
        CreatedBy: logToEdit.CreatedBy,
        CreatedAt: logToEdit.CreatedAt,
        ModifiyBy: currentUser?.id || 0,
        ModifiyAt: new Date().toISOString(),
      });
    } else {
      setFormData({
        LogId: 0,
        TableName: '',
        RecordId: 0,
        Action: '',
        OldValue: '',
        NewValue: '',
        ChangedBy: currentUser?.id || 0,
        ChangedAt: new Date().toISOString(),
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });
    }
  }, [logToEdit, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    console.log('Form data before sending:', formData);

    try {
      if (logToEdit) {
        console.log('Updating audit log with ID:', logToEdit.LogId);
        await auditLogService.updateAuditLog(logToEdit.LogId, {
          ...formData,
          ModifiyAt: new Date().toISOString()
        });
        alert('Audit log updated successfully!');
      } else {
        console.log('Creating new audit log');
        await auditLogService.createAuditLog({
          ...formData,
          ModifiyAt: new Date().toISOString()
        });
        alert('Audit log created successfully!');
      }

      setFormData({
        LogId: 0,
        TableName: '',
        RecordId: 0,
        Action: '',
        OldValue: '',
        NewValue: '',
        ChangedBy: currentUser?.id || 0,
        ChangedAt: new Date().toISOString(),
        CreatedBy: currentUser?.id || 0,
        CreatedAt: new Date().toISOString(),
        ModifiyBy: 0,
        ModifiyAt: null,
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error submitting audit log:', err);
      console.error('Error response:', err?.response?.data);
      const errorMessage = err?.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(', ')
        : err?.response?.data?.message || err.message || 'Operation failed';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'LogId' || name === 'RecordId' || name === 'ChangedBy' ? Number(value) : value,
    });
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '800px'
    }}>
      <h2>{logToEdit ? 'Edit Audit Log' : 'Create New Audit Log'}</h2>

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
            <label htmlFor="LogId" style={labelStyle}>
              Log ID *
            </label>
            <input
              type="number"
              id="LogId"
              name="LogId"
              value={formData.LogId}
              onChange={handleChange}
              required
              disabled={!!logToEdit}
              style={{
                ...inputStyle,
                backgroundColor: logToEdit ? '#e0e0e0' : 'white',
              }}
              placeholder="e.g., 1"
            />
            {logToEdit && (
              <small style={{ color: '#666', fontSize: '12px' }}>
                ID cannot be changed
              </small>
            )}
          </div>

          <div>
            <label htmlFor="TableName" style={labelStyle}>
              Table Name *
            </label>
            <input
              type="text"
              id="TableName"
              name="TableName"
              value={formData.TableName}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., Users"
            />
          </div>

          <div>
            <label htmlFor="RecordId" style={labelStyle}>
              Record ID *
            </label>
            <input
              type="number"
              id="RecordId"
              name="RecordId"
              value={formData.RecordId}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., 123"
            />
          </div>

          <div>
            <label htmlFor="Action" style={labelStyle}>
              Action *
            </label>
            <select
              id="Action"
              name="Action"
              value={formData.Action}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">Select Action</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
              <option value="INSERT">INSERT</option>
              <option value="MODIFY">MODIFY</option>
            </select>
          </div>

          <div>
            <label htmlFor="ChangedBy" style={labelStyle}>
              Changed By (User ID) *
            </label>
            <input
              type="number"
              id="ChangedBy"
              name="ChangedBy"
              value={formData.ChangedBy}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g., 1"
            />
          </div>

          <div>
            <label htmlFor="ChangedAt" style={labelStyle}>
              Changed At
            </label>
            <input
              type="datetime-local"
              id="ChangedAt"
              name="ChangedAt"
              value={formData.ChangedAt.slice(0, 16)}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  ChangedAt: new Date(e.target.value).toISOString()
                });
              }}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginTop: '15px' }}>
          <label htmlFor="OldValue" style={labelStyle}>
            Old Value
          </label>
          <textarea
            id="OldValue"
            name="OldValue"
            value={formData.OldValue}
            onChange={handleChange}
            style={{
              ...inputStyle,
              minHeight: '80px',
              fontFamily: 'monospace',
              fontSize: '14px'
            }}
            placeholder="Previous value (JSON format recommended)"
          />
        </div>

        <div style={{ marginTop: '15px' }}>
          <label htmlFor="NewValue" style={labelStyle}>
            New Value
          </label>
          <textarea
            id="NewValue"
            name="NewValue"
            value={formData.NewValue}
            onChange={handleChange}
            style={{
              ...inputStyle,
              minHeight: '80px',
              fontFamily: 'monospace',
              fontSize: '14px'
            }}
            placeholder="New value (JSON format recommended)"
          />
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
            {submitting ? 'Saving...' : (logToEdit ? 'Update Audit Log' : 'Create Audit Log')}
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