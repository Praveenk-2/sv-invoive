'use client';

import React from 'react';
import { usePurchaseOrders } from '@/hooks/usePurchaseOrders';
import { purchaseOrdersService } from '@/services/purchaseOrdersService';
import { PurchaseOrder } from '@/types/purchaseOrders.types';

interface PurchaseOrdersListProps {
    onEdit?: (po: PurchaseOrder) => void;
}

export default function PurchaseOrdersList({ onEdit }: PurchaseOrdersListProps) {
    const { purchaseOrders, loading, error, refetch } = usePurchaseOrders();

    const handleDelete = async (id: number) => {
        console.log('Deleting purchase order with ID:', id);

        if (!confirm('Are you sure you want to delete this purchase order?')) return;

        try {
            await purchaseOrdersService.deletePurchaseOrder(id);
            alert('Purchase order deleted successfully!');
            refetch();
        } catch (err: any) {
            console.error('Error deleting purchase order:', err);
            const errorMsg = err?.response?.data?.message || err.message || 'Failed to delete purchase order';
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

    const formatPODate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getUserName = (userId: number) => {
        if (!userId) return '-';
        return `User #${userId}`;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getStatusBadgeStyle = (status: string) => {
        const baseStyle = {
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'white',
        };

        switch (status.toUpperCase()) {
            case 'APPROVED':
            case 'COMPLETED':
                return { ...baseStyle, backgroundColor: '#4caf50' };
            case 'PENDING':
            case 'DRAFT':
                return { ...baseStyle, backgroundColor: '#ff9800' };
            case 'REJECTED':
            case 'CANCELLED':
                return { ...baseStyle, backgroundColor: '#f44336' };
            case 'IN PROGRESS':
            case 'PROCESSING':
                return { ...baseStyle, backgroundColor: '#2196f3' };
            default:
                return { ...baseStyle, backgroundColor: '#9e9e9e' };
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                Loading purchase orders...
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

    const grandTotal = purchaseOrders.reduce((sum, po) => sum + po.TotalAmount, 0);

    return (
        <div >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <h2>All Purchase Orders ({purchaseOrders.length})</h2>
                <div style={{
                    padding: '15px 25px',
                    backgroundColor: '#1976d2',
                    borderRadius: '8px',
                    color: 'white'
                }}>
                    <div style={{ fontSize: '12px', marginBottom: '5px' }}>Total Value</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        {formatCurrency(grandTotal)}
                    </div>
                </div>
            </div>

            {purchaseOrders.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic' }}>
                    No purchase orders found. Create your first purchase order!
                </p>
            ) : (
                <div style={{ overflowX: 'auto' }} className='scroll-bar'>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        marginTop: '20px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        minWidth: '1500px'
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                                <th style={tableHeaderStyle}>PO ID</th>
                                <th style={tableHeaderStyle}>PO Number</th>
                                <th style={tableHeaderStyle}>Supplier ID</th>
                                <th style={tableHeaderStyle}>PO Date</th>
                                <th style={tableHeaderStyle}>Status</th>
                                <th style={tableHeaderStyle}>Total Amount</th>
                                <th style={tableHeaderStyle}>Created By</th>
                                <th style={tableHeaderStyle}>Created At</th>
                                <th style={tableHeaderStyle}>Modified By</th>
                                <th style={tableHeaderStyle}>Modified At</th>
                                <th style={tableHeaderStyle}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchaseOrders.map((po) => (
                                <tr key={po.POId} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={tableCellStyle}>
                                        <strong style={{ color: '#1976d2' }}>{po.POId}</strong>
                                    </td>
                                    <td style={tableCellStyle}>
                                        <strong style={{
                                            color: '#1565c0',
                                            fontSize: '14px'
                                        }}>
                                            {po.PONumber}
                                        </strong>
                                    </td>
                                    <td style={tableCellStyle}>
                                        <span style={{
                                            backgroundColor: '#f3e5f5',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px'
                                        }}>
                                            Supplier #{po.SupplierId}
                                        </span>
                                    </td>
                                    <td style={tableCellStyle}>
                                        <span style={{ fontSize: '13px', color: '#666' }}>
                                            {formatPODate(po.PODate)}
                                        </span>
                                    </td>
                                    <td style={tableCellStyle}>
                                        <span style={getStatusBadgeStyle(po.Status)}>
                                            {po.Status}
                                        </span>
                                    </td>
                                    <td style={tableCellStyle}>
                                        <span style={{
                                            color: '#1565c0',
                                            fontWeight: 'bold',
                                            fontSize: '16px'
                                        }}>
                                            {formatCurrency(po.TotalAmount)}
                                        </span>
                                    </td>
                                    <td style={tableCellStyle}>
                                        <span style={{
                                            backgroundColor: '#e8f5e9',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px'
                                        }}>
                                            {getUserName(po.CreatedBy)}
                                        </span>
                                    </td>
                                    <td style={tableCellStyle}>
                                        <span style={{ fontSize: '13px', color: '#666' }}>
                                            {formatDate(po.CreatedAt)}
                                        </span>
                                    </td>
                                    <td style={tableCellStyle}>
                                        <span style={{
                                            backgroundColor: '#fff3e0',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px'
                                        }}>
                                            {getUserName(po.ModifiyBy)}
                                        </span>
                                    </td>
                                    <td style={tableCellStyle}>
                                        <span style={{ fontSize: '13px', color: '#666' }}>
                                            {formatDate(po.ModifiyAt)}
                                        </span>
                                    </td>
                                    <td style={tableCellStyle}>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {onEdit && (
                                                <button
                                                    onClick={() => {
                                                        console.log('Editing purchase order:', po);
                                                        onEdit(po);
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
                                                onClick={() => handleDelete(po.POId)}
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
                        <tfoot>
                            <tr style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                <td colSpan={5} style={{ ...tableCellStyle, textAlign: 'right', fontSize: '16px' }}>
                                    Grand Total:
                                </td>
                                <td style={{ ...tableCellStyle, fontSize: '18px', color: '#1565c0' }}>
                                    {formatCurrency(grandTotal)}
                                </td>
                                <td colSpan={5}></td>
                            </tr>
                        </tfoot>
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
