import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { getUserRole } from '../services/auth';

export const useUserRole = (user: User | null) => {
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      const userRole = await getUserRole(user.uid);
      setRole(userRole);
      setLoading(false);
    };

    fetchRole();
  }, [user]);

  return { role, loading };
};
