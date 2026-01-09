// hooks/useUserRole.ts
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

// Hook for single user role
export const useUserRole = (userRoleId: number | null) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userRoleId) {
      setLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        setLoading(true);
        const data = await userRoleService.getUserRoleById(userRoleId);
        setUserRole(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user role');
        console.error('Error fetching user role:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [userRoleId]);

  return { userRole, loading, error };
};