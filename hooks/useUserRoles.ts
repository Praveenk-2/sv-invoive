// Custom hook for fetching user roles with state management
import { useState, useEffect } from 'react';
import { userRoleService } from '@/services/userRoleService';
import { UserRole } from '@/types/userRole.types';

export const useUserRoles = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRoles = async () => {
    try {
      setLoading(true);
      const data = await userRoleService.getAllUserRoles();
      setUserRoles(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user roles');
      console.error('Error fetching user roles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const refetch = () => {
    fetchUserRoles();
  };

  return { userRoles, loading, error, refetch };
};
