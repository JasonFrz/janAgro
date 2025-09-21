// src/admin/UserAdmin.jsx
import React from "react";

function UserAdmin() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Users Management</h2>
      <p className="text-gray-500">Belum ada data user</p>
      
      <div className="mt-6 space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-400">User management features akan ditambahkan di sini</p>
          <ul className="text-sm text-gray-400 mt-2">
            <li>• View all users</li>
            <li>• Add new users</li>
            <li>• Edit user information</li>
            <li>• Delete users</li>
            <li>• User roles & permissions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserAdmin;