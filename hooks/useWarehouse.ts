// hooks/useWarehouse.ts
// Custom hook for fetching warehouses with state management
import { useState, useEffect } from 'react';
import { warehouseService } from '@/services/warehouseService';
import { Warehouse } from '@/types/warehouse.types';

export const useWarehouses = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const data = await warehouseService.getAllWarehouses();
      setWarehouses(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch warehouses');
      console.error('Error fetching warehouses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const refetch = () => {
    fetchWarehouses();
  };

  return { warehouses, loading, error, refetch };
};

// Hook for single warehouse
export const useWarehouse = (warehouseId: number | null) => {
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!warehouseId) {
      setLoading(false);
      return;
    }

    const fetchWarehouse = async () => {
      try {
        setLoading(true);
        const data = await warehouseService.getWarehouseById(warehouseId);
        setWarehouse(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch warehouse');
        console.error('Error fetching warehouse:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouse();
  }, [warehouseId]);

  return { warehouse, loading, error };
};