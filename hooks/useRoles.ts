// Custom hook for fetching roles with state management
import { useState, useEffect } from 'react';
import { roleService } from '@/services/roleService';
import { Role } from '@/types/role.types';

export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await roleService.getAllRoles();
      setRoles(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch roles');
      console.error('Error fetching roles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Function to refetch roles (useful after create/update/delete)
  const refetch = () => {
    fetchRoles();
  };

  return { roles, loading, error, refetch };
};