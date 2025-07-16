import { useAuth } from './useAuth';
import { useUserRole } from './useUserRole';

export const useAdmin = () => {
  const { user, loading: loadingAuth } = useAuth();
  const { role, loading: loadingRole } = useUserRole(user);

  return {
    user,
    isAdmin: role === 'admin',
    loading: loadingAuth || loadingRole
  };
};
