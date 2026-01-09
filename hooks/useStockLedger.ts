// hooks/useStockLedger.ts
// Custom hook for fetching stock ledgers with state management
import { useState, useEffect } from 'react';
import { stockLedgerService } from '@/services/stockLedgerService';
import { StockLedger } from '@/types/Stockledger.types';

export const useStockLedgers = () => {
  const [stockLedgers, setStockLedgers] = useState<StockLedger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStockLedgers = async () => {
    try {
      setLoading(true);
      const data = await stockLedgerService.getAllStockLedgers();
      setStockLedgers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stock ledgers');
      console.error('Error fetching stock ledgers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockLedgers();
  }, []);

  const refetch = () => {
    fetchStockLedgers();
  };

  return { stockLedgers, loading, error, refetch };
};

// Hook for single stock ledger
export const useStockLedger = (ledgerId: number | null) => {
  const [stockLedger, setStockLedger] = useState<StockLedger | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ledgerId) {
      setLoading(false);
      return;
    }

    const fetchStockLedger = async () => {
      try {
        setLoading(true);
        const data = await stockLedgerService.getStockLedgerById(ledgerId);
        setStockLedger(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stock ledger');
        console.error('Error fetching stock ledger:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStockLedger();
  }, [ledgerId]);

  return { stockLedger, loading, error };
};