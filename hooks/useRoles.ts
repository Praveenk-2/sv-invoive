// hooks/useRole.ts
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

  const refetch = () => {
    fetchRoles();
  };

  return { roles, loading, error, refetch };
};

// Hook for single role
export const useRole = (roleId: number | null) => {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roleId) {
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        setLoading(true);
        const data = await roleService.getRoleById(roleId);
        setRole(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch role');
        console.error('Error fetching role:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [roleId]);

  return { role, loading, error };
};