import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export const AuthRoute = () => {
  const { currentUser, authChecked } = useAuth();
  const location = useLocation();

  if (!authChecked) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (currentUser) {
    const redirectTo = location.state?.redirectTo || '/edit-profile';
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};
