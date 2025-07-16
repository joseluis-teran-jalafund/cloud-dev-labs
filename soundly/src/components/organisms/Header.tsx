import React from 'react';
import { useNavigate } from 'react-router';
import { logout } from '../../services/auth';

type HeaderProps = {
  showSearch?: boolean;
  showProfile?: boolean;
};

const Header: React.FC<HeaderProps> = ({ 
  showSearch = true, 
  showProfile = true 
}) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-600 mr-4">Soundly</h1>

        {showSearch && (
          <div className="flex-1 flex max-w-md">
            <div className="relative flex items-center w-full">
              <div className="absolute left-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                onClick={() => navigate('/search')}
              />
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          {showProfile && (
            <button 
              onClick={() => navigate('/profile')}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-green-50 transition-colors"
              aria-label="Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
            aria-label="Logout"
            title="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
