import React from 'react';
import { NavLink } from 'react-router';
import { FiHome, FiMusic, FiUsers, FiDisc, FiSettings, FiHeadphones } from 'react-icons/fi';

const AdminNavbar: React.FC = () => {
  return (
    <nav className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <div className="mb-8 p-4">
        <h1 className="text-xl font-bold">Music Admin</h1>
      </div>
      
      <ul className="space-y-2">
        <li>
          <NavLink 
            to="/admin" 
            className={({ isActive }) => 
              `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
            end
          >
            <FiHome className="mr-3" />
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/genres" 
            className={({ isActive }) => 
              `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <FiMusic className="mr-3" />
            Genres
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/artists" 
            className={({ isActive }) => 
              `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <FiUsers className="mr-3" />
            Artists
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/albums" 
            className={({ isActive }) => 
              `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <FiDisc className="mr-3" />
            Albums
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/songs" 
            className={({ isActive }) => 
              `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <FiHeadphones className="mr-3" />
            Songs
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/settings" 
            className={({ isActive }) => 
              `flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <FiSettings className="mr-3" />
            Settings
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
