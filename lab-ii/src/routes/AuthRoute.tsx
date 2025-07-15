import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export const AuthRoute = () => {
  const { currentUser, authChecked } = useAuth();

  if (!authChecked) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (currentUser) {
    return <Navigate to="/edit-profile" replace />;
  }

  return <Outlet />;
};
