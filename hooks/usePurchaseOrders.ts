import { useState, useEffect } from 'react';
import { purchaseOrdersService } from '@/services/purchaseOrdersService';
import { PurchaseOrder } from '@/types/purchaseOrders.types';

export const usePurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const data = await purchaseOrdersService.getAllPurchaseOrders();
      setPurchaseOrders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch purchase orders');
      console.error('Error fetching purchase orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const refetch = () => {
    fetchPurchaseOrders();
  };

  return { purchaseOrders, loading, error, refetch };
};

export const usePurchaseOrder = (poId: number | null) => {
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!poId) {
      setLoading(false);
      return;
    }

    const fetchPurchaseOrder = async () => {
      try {
        setLoading(true);
        const data = await purchaseOrdersService.getPurchaseOrderById(poId);
        setPurchaseOrder(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch purchase order');
        console.error('Error fetching purchase order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseOrder();
  }, [poId]);

  return { purchaseOrder, loading, error };
};