import { useState, useEffect } from 'react';
import { itemBatchesService } from '@/services/itemBatchesService';
import { ItemBatch } from '@/types/itemBatches.types';

export const useItemBatches = () => {
  const [itemBatches, setItemBatches] = useState<ItemBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItemBatches = async () => {
    try {
      setLoading(true);
      const data = await itemBatchesService.getAllItemBatches();
      setItemBatches(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch item batches');
      console.error('Error fetching item batches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemBatches();
  }, []);

  const refetch = () => {
    fetchItemBatches();
  };

  return { itemBatches, loading, error, refetch };
};

export const useItemBatch = (batchId: number | null) => {
  const [itemBatch, setItemBatch] = useState<ItemBatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!batchId) {
      setLoading(false);
      return;
    }

    const fetchItemBatch = async () => {
      try {
        setLoading(true);
        const data = await itemBatchesService.getItemBatchById(batchId);
        setItemBatch(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch item batch');
        console.error('Error fetching item batch:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemBatch();
  }, [batchId]);

  return { itemBatch, loading, error };
};