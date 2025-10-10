import React from "react";

function SettingAdmin() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <p className="text-gray-500 mb-6">Pengaturan sistem dan konfigurasi</p>
      
      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-2">General Settings</h3>
          <p className="text-gray-400">Pengaturan umum aplikasi akan ditambahkan di sini</p>
          <ul className="text-sm text-gray-400 mt-2">
            <li>• Site configuration</li>
            <li>• Email settings</li>
            <li>• Notification preferences</li>
          </ul>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-2">Security Settings</h3>
          <p className="text-gray-400">Pengaturan keamanan akan ditambahkan di sini</p>
          <ul className="text-sm text-gray-400 mt-2">
            <li>• Password policies</li>
            <li>• Two-factor authentication</li>
            <li>• Session management</li>
          </ul>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-2">System Settings</h3>
          <p className="text-gray-400">Pengaturan sistem akan ditambahkan di sini</p>
          <ul className="text-sm text-gray-400 mt-2">
            <li>• Database configuration</li>
            <li>• API settings</li>
            <li>• Backup settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SettingAdmin;