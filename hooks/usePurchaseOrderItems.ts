import { useState, useEffect } from 'react';
import { purchaseOrderItemsService } from '@/services/purchaseOrderItemsService';
import { PurchaseOrderItem } from '@/types/purchaseOrderItems.types';

export const usePurchaseOrderItems = () => {
  const [purchaseOrderItems, setPurchaseOrderItems] = useState<PurchaseOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchaseOrderItems = async () => {
    try {
      setLoading(true);
      const data = await purchaseOrderItemsService.getAllPurchaseOrderItems();
      setPurchaseOrderItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch purchase order items');
      console.error('Error fetching purchase order items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrderItems();
  }, []);

  const refetch = () => {
    fetchPurchaseOrderItems();
  };

  return { purchaseOrderItems, loading, error, refetch };
};

export const usePurchaseOrderItem = (poItemId: number | null) => {
  const [purchaseOrderItem, setPurchaseOrderItem] = useState<PurchaseOrderItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!poItemId) {
      setLoading(false);
      return;
    }

    const fetchPurchaseOrderItem = async () => {
      try {
        setLoading(true);
        const data = await purchaseOrderItemsService.getPurchaseOrderItemById(poItemId);
        setPurchaseOrderItem(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch purchase order item');
        console.error('Error fetching purchase order item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseOrderItem();
  }, [poItemId]);

  return { purchaseOrderItem, loading, error };
};