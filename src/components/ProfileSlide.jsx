import React, { useState } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff, Settings, LogOut } from 'lucide-react';

const ProfileSlide = ({ isOpen, onClose, user, setUser, setIsAdmin }) => {
  const [currentView, setCurrentView] = useState('main');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      const mockUser = {
        id: 1,
        name: formData.email === 'admin@janAgro.com' ? 'Admin' : 'John Doe',
        email: formData.email,
        joinDate: '2024'
      };
      setUser(mockUser);
      if (formData.email === 'admin@janAgro.com') {
        setIsAdmin(true);
      }
      setCurrentView('profile');
      setFormData({ email: '', password: '', name: '', confirmPassword: '' });
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.password && formData.confirmPassword) {
      if (formData.password === formData.confirmPassword) {
        const mockUser = {
          id: 2,
          name: formData.name,
          email: formData.email,
          joinDate: '2025'
        };
        setUser(mockUser);
        setCurrentView('profile');
        setFormData({ email: '', password: '', name: '', confirmPassword: '' });
      } else {
        alert('Passwords do not match!');
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    setCurrentView('main');
    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
  };

  const resetView = () => {
    setCurrentView(user ? 'profile' : 'main');
    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
  };

  const handleClose = () => {
    resetView();
    onClose();
  };

  const renderMainView = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User size={40} className="text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Selamat datang di Jan Agro</h3>
        <p className="text-gray-600 mt-2">Silakan mendaftar dan manfaatkan keuntungannya:</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-black rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-gray-700">Optimisasi tanaman Anda dengan kami.</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <button 
          onClick={() => setCurrentView('login')}
          className="w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          Login
        </button>
        <button 
          onClick={() => setCurrentView('register')}
          className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors"
        >
          Daftar
        </button>
      </div>
      
      <div className="pt-6 border-t">
        <h4 className="font-semibold mb-3">Keuntungan Member:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <span>Akses layanan digital eksklusif</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <span>Notifikasi service dan perawatan</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <span>Penawaran khusus dan promosi</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <span>Riwayat kendaraan dan service</span>
          </li>
        </ul>
      </div>
    </div>
  );

  const renderLoginView = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">Login</h3>
        <p className="text-gray-600 mt-2">Masuk ke akun Anda</p>
      </div>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          Login
        </button>
      </form>
      
      <div className="text-center">
        <button
          onClick={() => setCurrentView('register')}
          className="text-sm text-gray-600 hover:text-black"
        >
          Belum punya akun? <span className="font-medium">Daftar sekarang</span>
        </button>
      </div>
      
      <div className="text-center">
        <button
          onClick={() => setCurrentView('main')}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Kembali
        </button>
      </div>
    </div>
  );

  const renderRegisterView = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">Daftar</h3>
        <p className="text-gray-600 mt-2">Buat akun baru</p>
      </div>
      
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Masukkan email"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Buat password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Ulangi password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          Daftar
        </button>
      </form>
      
      <div className="text-center">
        <button
          onClick={() => setCurrentView('login')}
          className="text-sm text-gray-600 hover:text-black"
        >
          Sudah punya akun? <span className="font-medium">Login</span>
        </button>
      </div>
      
      <div className="text-center">
        <button
          onClick={() => setCurrentView('main')}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Kembali
        </button>
      </div>
    </div>
  );

  const renderProfileView = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gray-900 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User size={40} className="text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
        <p className="text-gray-600">{user?.email}</p>
        <p className="text-sm text-gray-500">Member since {user?.joinDate}</p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold mb-4 text-gray-900">Account Information</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status</span>
            <span className="text-green-600 font-medium">Active</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Membership Type</span>
            <span className="font-medium">Premium</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Points</span>
            <span className="font-medium">1,250</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <button className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-200 transition-colors">
          <Settings size={16} />
          <span>Account Settings</span>
        </button>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-3 px-4 rounded-md font-medium hover:bg-red-100 transition-colors"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
      
      <div className="pt-6 border-t">
        <h4 className="font-semibold mb-3">Your Benefits:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Priority customer support</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Exclusive offers and discounts</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Service history tracking</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Early access to new models</span>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />
      
      <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Jan Agro Nusantara</h2>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          {currentView === 'main' && renderMainView()}
          {currentView === 'login' && renderLoginView()}
          {currentView === 'register' && renderRegisterView()}
          {currentView === 'profile' && renderProfileView()}
        </div>
      </div>
    </div>
  );
};

export default ProfileSlide;