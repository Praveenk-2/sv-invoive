import { useState, useEffect } from 'react';
import { stockExtendedService } from '@/services/stockExtendedService';
import { StockExtended } from '@/types/stockExtended.types';

export const useStocksExtended = () => {
  const [stocks, setStocks] = useState<StockExtended[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const data = await stockExtendedService.getAllStocks();
      setStocks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stock records');
      console.error('Error fetching stock records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const refetch = () => {
    fetchStocks();
  };

  return { stocks, loading, error, refetch };
};

export const useStockExtended = (stockId: number | null) => {
  const [stock, setStock] = useState<StockExtended | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stockId) {
      setLoading(false);
      return;
    }

    const fetchStock = async () => {
      try {
        setLoading(true);
        const data = await stockExtendedService.getStockById(stockId);
        setStock(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stock record');
        console.error('Error fetching stock record:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [stockId]);

  return { stock, loading, error };
};