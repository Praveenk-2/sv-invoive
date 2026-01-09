// hooks/useUserPrivilege.ts
// Custom hook for fetching user privileges with state management
import { useState, useEffect } from 'react';
import { userPrivilegeService } from '@/services/userPrivilegeService';
import { UserPrivilege } from '@/types/userprivilege.types';

export const useUserPrivileges = () => {
  const [userPrivileges, setUserPrivileges] = useState<UserPrivilege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPrivileges = async () => {
    try {
      setLoading(true);
      const data = await userPrivilegeService.getAllUserPrivileges();
      setUserPrivileges(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user privileges');
      console.error('Error fetching user privileges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPrivileges();
  }, []);

  const refetch = () => {
    fetchUserPrivileges();
  };

  return { userPrivileges, loading, error, refetch };
};

// Hook for single user privilege
export const useUserPrivilege = (id: number | null) => {
  const [userPrivilege, setUserPrivilege] = useState<UserPrivilege | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchUserPrivilege = async () => {
      try {
        setLoading(true);
        const data = await userPrivilegeService.getUserPrivilegeById(id);
        setUserPrivilege(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user privilege');
        console.error('Error fetching user privilege:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPrivilege();
  }, [id]);

  return { userPrivilege, loading, error };
};