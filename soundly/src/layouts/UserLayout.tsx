import React from 'react';
import { Outlet } from 'react-router';
import Header from '../components/organisms/Header';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/atoms/Button';

const UserLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header>
        {user && (
          <div className="flex items-center gap-4">
            <span className="font-medium">{user.email}</span>
            <Button 
              onClick={() => logout()} 
              variant="danger" 
              size="sm"
            >
              Logout
            </Button>
          </div>
        )}
      </Header>

      <main className="container mx-auto py-8 px-4">
        <Outlet />
      </main>

    </div>
  );
};

export default UserLayout;
