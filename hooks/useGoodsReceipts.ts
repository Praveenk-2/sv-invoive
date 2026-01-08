import { useState, useEffect } from 'react';
import { goodsReceiptService } from '@/services/goodsReceiptService';
import { GoodsReceipt } from '@/types/goodsReceipt.types';

export const useGoodsReceipts = () => {
  const [goodsReceipts, setGoodsReceipts] = useState<GoodsReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoodsReceipts = async () => {
    try {
      setLoading(true);
      const data = await goodsReceiptService.getAllGoodsReceipts();
      setGoodsReceipts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch goods receipts');
      console.error('Error fetching goods receipts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoodsReceipts();
  }, []);

  const refetch = () => {
    fetchGoodsReceipts();
  };

  return { goodsReceipts, loading, error, refetch };
};

export const useGoodsReceipt = (grnId: number | null) => {
  const [goodsReceipt, setGoodsReceipt] = useState<GoodsReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!grnId) {
      setLoading(false);
      return;
    }

    const fetchGoodsReceipt = async () => {
      try {
        setLoading(true);
        const data = await goodsReceiptService.getGoodsReceiptById(grnId);
        setGoodsReceipt(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch goods receipt');
        console.error('Error fetching goods receipt:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoodsReceipt();
  }, [grnId]);

  return { goodsReceipt, loading, error };
};