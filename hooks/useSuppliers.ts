// Custom hook for fetching suppliers with state management
import { useState, useEffect } from 'react';
import { supplierService } from '@/services/supplierService';
import { Supplier } from '@/types/supplier.types';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await supplierService.getAllSuppliers();
      setSuppliers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch suppliers');
      console.error('Error fetching suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const refetch = () => {
    fetchSuppliers();
  };

  return { suppliers, loading, error, refetch };
};

// Hook for single supplier
export const useSupplier = (supplierId: number | null) => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supplierId) {
      setLoading(false);
      return;
    }

    const fetchSupplier = async () => {
      try {
        setLoading(true);
        const data = await supplierService.getSupplierById(supplierId);
        setSupplier(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch supplier');
        console.error('Error fetching supplier:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [supplierId]);

  return { supplier, loading, error };
};