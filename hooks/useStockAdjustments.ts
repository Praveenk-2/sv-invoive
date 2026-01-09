import { useState, useEffect } from 'react';
import { stockAdjustmentsService } from '@/services/stockAdjustmentsService';
import { StockAdjustment } from '@/types/stockAdjustments.types';

export const useStockAdjustments = () => {
  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStockAdjustments = async () => {
    try {
      setLoading(true);
      const data = await stockAdjustmentsService.getAllStockAdjustments();
      setStockAdjustments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stock adjustments');
      console.error('Error fetching stock adjustments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockAdjustments();
  }, []);

  const refetch = () => {
    fetchStockAdjustments();
  };

  return { stockAdjustments, loading, error, refetch };
};

export const useStockAdjustment = (adjustmentId: number | null) => {
  const [stockAdjustment, setStockAdjustment] = useState<StockAdjustment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!adjustmentId) {
      setLoading(false);
      return;
    }

    const fetchStockAdjustment = async () => {
      try {
        setLoading(true);
        const data = await stockAdjustmentsService.getStockAdjustmentById(adjustmentId);
        setStockAdjustment(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stock adjustment');
        console.error('Error fetching stock adjustment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStockAdjustment();
  }, [adjustmentId]);

  return { stockAdjustment, loading, error };
};