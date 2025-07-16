import React from 'react';
import AdminNavbar from '../components/admin/AdminNavbar';
import { Outlet } from 'react-router';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white">
        <AdminNavbar />
      </div>

      <div className="flex-1 ml-64 overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
