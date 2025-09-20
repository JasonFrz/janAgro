import React, { useState } from 'react';
import { 
  Users, 
  Car, 
  BarChart3, 
  Settings, 
  Shield, 
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  Download,
  Eye
} from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const dashboardStats = {
    totalUsers: 12547,
    totalVehicles: 45,
    totalSales: 892,
    revenue: '$12.5M'
  };

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', joinDate: '2025-01-15', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', joinDate: '2025-01-14', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', joinDate: '2025-01-13', status: 'Pending' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', joinDate: '2025-01-12', status: 'Active' },
    { id: 5, name: 'David Brown', email: 'david@example.com', joinDate: '2025-01-11', status: 'Inactive' }
  ];

  const vehicles = [
    { id: 1, model: 'BMW iX3', type: 'Electric SUV', price: '$55,400', stock: 15, status: 'Available' },
    { id: 2, model: 'BMW i4', type: 'Electric Sedan', price: '$51,400', stock: 8, status: 'Low Stock' },
    { id: 3, model: 'BMW X5', type: 'Luxury SUV', price: '$59,400', stock: 22, status: 'Available' },
    { id: 4, model: 'BMW 3 Series', type: 'Sport Sedan', price: '$34,900', stock: 0, status: 'Out of Stock' },
    { id: 5, model: 'BMW M4', type: 'Performance Coupe', price: '$71,800', stock: 5, status: 'Low Stock' }
  ];

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'vehicles', name: 'Vehicles', icon: Car },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Users</p>
              <p className="text-3xl font-bold text-black mt-2">{dashboardStats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-black rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4">↗ +12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Vehicles</p>
              <p className="text-3xl font-bold text-black mt-2">{dashboardStats.totalVehicles}</p>
            </div>
            <div className="p-3 bg-black rounded-full">
              <Car className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4">↗ +3 new models</p>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Sales</p>
              <p className="text-3xl font-bold text-black mt-2">{dashboardStats.totalSales}</p>
            </div>
            <div className="p-3 bg-black rounded-full">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4">↗ +8% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Revenue</p>
              <p className="text-3xl font-bold text-black mt-2">{dashboardStats.revenue}</p>
            </div>
            <div className="p-3 bg-black rounded-full">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4">↗ +15% from last month</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-sm shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-black">Recent Users</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' :
                    user.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-black">Vehicle Inventory</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {vehicles.slice(0, 5).map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black">{vehicle.model}</p>
                    <p className="text-xs text-gray-500">{vehicle.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-black">Stock: {vehicle.stock}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      vehicle.status === 'Available' ? 'bg-green-100 text-green-800' :
                      vehicle.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-black">User Management</h2>
        <button className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-sm hover:bg-gray-800 transition-colors">
          <Plus size={16} />
          <span>Add User</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-sm focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
        <button className="flex items-center space-x-2 border border-gray-200 px-4 py-2 rounded-sm hover:bg-gray-50">
          <Filter size={16} />
          <span>Filter</span>
        </button>
        <button className="flex items-center space-x-2 border border-gray-200 px-4 py-2 rounded-sm hover:bg-gray-50">
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-black">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' :
                      user.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="text-gray-600 hover:text-black">
                        <Eye size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-black">
                        <Edit3 size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderVehicles = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-black">Vehicle Management</h2>
        <button className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-sm hover:bg-gray-800 transition-colors">
          <Plus size={16} />
          <span>Add Vehicle</span>
        </button>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-black">{vehicle.model}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-medium">
                    {vehicle.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      vehicle.status === 'Available' ? 'bg-green-100 text-green-800' :
                      vehicle.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="text-gray-600 hover:text-black">
                        <Eye size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-black">
                        <Edit3 size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-black">System Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-black mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                value="BMW Official"
                className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                value="admin@bmw.com"
                className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:ring-2 focus:ring-black focus:border-transparent">
                <option>UTC+7 (Jakarta)</option>
                <option>UTC+0 (GMT)</option>
                <option>UTC-5 (EST)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-black mb-4">Security Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
              <button className="bg-black text-white px-3 py-1 rounded-sm text-xs">
                Enable
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Session Timeout</span>
              <select className="px-2 py-1 border border-gray-200 rounded-sm text-sm">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>2 hours</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Login Attempts Limit</span>
              <input
                type="number"
                value="5"
                className="w-16 px-2 py-1 border border-gray-200 rounded-sm text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button className="px-6 py-2 border border-gray-200 text-gray-700 rounded-sm hover:bg-gray-50">
          Cancel
        </button>
        <button className="px-6 py-2 bg-black text-white rounded-sm hover:bg-gray-800">
          Save Changes
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="w-8 h-8 text-black" />
            <h1 className="text-3xl font-light text-black">Admin <span className="font-bold">Panel</span></h1>
          </div>
          <p className="text-gray-600">Manage your BMW website and users</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-sm shadow-sm border border-gray-100 p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <li key={tab.id}>
                      <button
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-3 w-full px-3 py-2 rounded-sm text-left transition-all ${
                          activeTab === tab.id
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon size={18} />
                        <span className="font-medium">{tab.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'vehicles' && renderVehicles()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;