// Custom hook for fetching units with state management
import { useState, useEffect } from 'react';
import { unitService } from '@/services/unitService';
import { Unit } from '@/types/unit.types';

export const useUnits = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const data = await unitService.getAllUnits();
      setUnits(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch units');
      console.error('Error fetching units:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const refetch = () => {
    fetchUnits();
  };

  return { units, loading, error, refetch };
};

// Hook for single unit
export const useUnit = (unitId: number | null) => {
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!unitId) {
      setLoading(false);
      return;
    }

    const fetchUnit = async () => {
      try {
        setLoading(true);
        const data = await unitService.getUnitById(unitId);
        setUnit(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch unit');
        console.error('Error fetching unit:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [unitId]);

  return { unit, loading, error };
};