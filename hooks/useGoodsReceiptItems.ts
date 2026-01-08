import { useState, useEffect } from 'react';
import { goodsReceiptItemsService } from '@/services/goodsReceiptItemsService';
import { GoodsReceiptItem } from '@/types/goodsReceiptItems.types';

export const useGoodsReceiptItems = () => {
  const [goodsReceiptItems, setGoodsReceiptItems] = useState<GoodsReceiptItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoodsReceiptItems = async () => {
    try {
      setLoading(true);
      const data = await goodsReceiptItemsService.getAllGoodsReceiptItems();
      setGoodsReceiptItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch goods receipt items');
      console.error('Error fetching goods receipt items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoodsReceiptItems();
  }, []);

  const refetch = () => {
    fetchGoodsReceiptItems();
  };

  return { goodsReceiptItems, loading, error, refetch };
};

export const useGoodsReceiptItem = (grnItemId: number | null) => {
  const [goodsReceiptItem, setGoodsReceiptItem] = useState<GoodsReceiptItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!grnItemId) {
      setLoading(false);
      return;
    }

    const fetchGoodsReceiptItem = async () => {
      try {
        setLoading(true);
        const data = await goodsReceiptItemsService.getGoodsReceiptItemById(grnItemId);
        setGoodsReceiptItem(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch goods receipt item');
        console.error('Error fetching goods receipt item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoodsReceiptItem();
  }, [grnItemId]);

  return { goodsReceiptItem, loading, error };
};