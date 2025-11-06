import React, { useState, useEffect } from "react";
import Joi from "joi";
import {
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Settings,
  LogOut,
  AlertCircle,
  AtSign,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileSlide = ({
  isOpen,
  onClose,
  user,
  setUser, 
  setShowProfile,
  API_URL,
}) => {
  const [currentView, setCurrentView] = useState("main");
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    name: "",
    username: "",
    email: "",
    noTelp: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const changeView = (view) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setCurrentView(view);
  };

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      setCurrentView(user ? "profile" : "main");
    }
  }, [isOpen, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrorMessage(null);
    if (name === "noTelp") {
      const numericValue = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const loginSchema = Joi.object({
    identifier: Joi.string()
      .required()
      .messages({ "string.empty": "Email atau username wajib diisi" }),
    password: Joi.string()
      .required()
      .messages({ "string.empty": "Password wajib diisi" }),
  });

  const registerSchema = Joi.object({
    username: Joi.string()
      .required()
      .messages({ "string.empty": "Username wajib diisi" }),
    name: Joi.string()
      .required()
      .messages({ "string.empty": "Nama lengkap wajib diisi" }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email wajib diisi",
        "string.email": "Format email tidak valid",
      }),
    noTelp: Joi.string()
      .pattern(/^[0-9]{8,15}$/)
      .required()
      .messages({
        "string.empty": "Nomor telepon wajib diisi",
        "string.pattern.base": "Nomor telepon harus antara 8 hingga 15 digit",
      }),
    password: Joi.string().min(6).required().messages({
      "string.empty": "Password wajib diisi",
      "string.min": "Password minimal 6 karakter",
    }),
    confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
      "any.only": "Konfirmasi password tidak cocok",
      "any.required": "Konfirmasi password wajib diisi",
    }),
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const { error } = loginSchema.validate({
      identifier: formData.identifier,
      password: formData.password,
    });
    if (error) {
      setErrorMessage(error.details[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.identifier,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      setUser(data.user); 

      if (data.user.role === "Pemilik") {
        navigate("/ceo");
      } else if (data.user.role === "Admin") {
        navigate("/admin");
      }

      setShowProfile(false);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const { error } = registerSchema.validate(formData, {
      abortEarly: true,
      allowUnknown: true,
    });
    if (error) {
      setErrorMessage(error.details[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          no_telp: formData.noTelp,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccessMessage(data.message + " Silakan login.");
      changeView("login");
      setFormData({
        ...formData,
        identifier: formData.email,
        password: "",
        name: "",
        username: "",
        confirmPassword: "",
        noTelp: "",
      });
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null); 
    navigate("/");
    changeView("main");
  };

  const resetView = () => {
    setCurrentView(user ? "profile" : "main");
    setFormData({
      identifier: "",
      password: "",
      name: "",
      username: "",
      email: "",
      noTelp: "",
      confirmPassword: "",
    });
  };

  const handleClose = () => {
    resetView();
    onClose();
  };

  const handleAccountSettingsClick = () => {
    navigate("/profile");
    onClose();
  };

  const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return (
      <div className="flex items-center space-x-2 bg-red-50 text-red-700 p-3 rounded-md border border-red-200">
        <AlertCircle size={20} /> <span className="text-sm">{message}</span>
      </div>
    );
  };

  const SuccessMessage = ({ message }) => {
    if (!message) return null;
    return (
      <div className="bg-green-50 text-green-700 p-3 rounded-md border border-green-200 text-sm">
        {message}
      </div>
    );
  };

  const renderRegisterView = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">Daftar</h3>
        <p className="text-gray-600 mt-2">Buat akun baru</p>
      </div>
      <form onSubmit={handleRegister} className="space-y-4">
        <ErrorMessage message={errorMessage} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <div className="relative">
            <AtSign
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
              placeholder="Pilih username unik"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lengkap
          </label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
              placeholder="Masukkan email"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nomor Telepon
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              +62
            </span>
            <Phone
              className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="tel"
              name="noTelp"
              value={formData.noTelp}
              onChange={handleInputChange}
              className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
              placeholder="81234567890"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
              placeholder="Minimal 6 karakter"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Konfirmasi Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
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
          className="w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Mendaftar..." : "Daftar"}
        </button>
      </form>
      <div className="text-center">
        <button
          onClick={() => changeView("login")}
          className="text-sm text-gray-600 hover:text-black"
        >
          Sudah punya akun? <span className="font-medium">Login</span>
        </button>
      </div>
      <div className="text-center">
        <button
          onClick={() => changeView("main")}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Kembali
        </button>
      </div>
    </div>
  );

  // Di dalam ProfileSlide.jsx

  const renderMainView = () => (
    <div className="space-y-6">
      {/* Bagian atas (info, keuntungan, tombol) tetap sama */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User size={40} className="text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Selamat datang di Jan Agro
        </h3>
        <p className="text-gray-600 mt-2">
          Silakan mendaftar dan manfaatkan keuntungannya:
        </p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-black rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-700">
            Optimisasi tanaman Anda dengan kami.
          </p>
        </div>
      </div>
      <div className="space-y-3">
        <button
          onClick={() => changeView("login")}
          className="w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          Login
        </button>
        <button
          onClick={() => changeView("register")}
          className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors"
        >
          Daftar
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <div className="flex justify-center items-end h-32">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <path d="M 0 95 H 100" stroke="#4a3b2d" strokeWidth="4" />

            <path
              className="plant-stem"
              d="M 50 95 V 20 C 50 10, 60 10, 60 20"
              fill="none"
              stroke="#34D399"
              strokeWidth="4"
              strokeLinecap="round"
            />

            <g className="plant-leaf leaf-1">
              <circle cx="42" cy="55" r="10" fill="#34D399" />
            </g>
            <g className="plant-leaf leaf-2">
              <circle cx="58" cy="45" r="12" fill="#34D399" />
            </g>
            <g className="plant-leaf leaf-3">
              <circle cx="40" cy="35" r="10" fill="#34D399" />
            </g>
            <g className="plant-leaf leaf-4">
              <path d="M 60 20 C 65 10, 75 10, 80 20 Z" fill="#34D399" />
            </g>
          </svg>
        </div>
        <p className="text-gray-600 text-sm mt-2">
          Inovasi untuk pertanian berkelanjutan.
        </p>
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
        <ErrorMessage message={errorMessage} />
        <SuccessMessage message={successMessage} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email or Username
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
              placeholder="Enter your email or username"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
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
          className="w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="text-center">
        <button
          onClick={() => changeView("register")}
          className="text-sm text-gray-600 hover:text-black"
        >
          Belum punya akun? <span className="font-medium">Daftar sekarang</span>
        </button>
      </div>
      <div className="text-center">
        <button
          onClick={() => changeView("main")}
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
        <div className="w-20 h-20 bg-gray-900 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden border-2 border-gray-200">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={40} className="text-white" />
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
        <p className="text-gray-600">{user?.email}</p>
        <p className="text-sm text-gray-500">Member since {user?.joinDate}</p>
      </div>
      <div className="space-y-3">
        <button
          onClick={handleAccountSettingsClick}
          className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-200 transition-colors"
        >
          <Settings size={16} /> <span>Account Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-3 px-4 rounded-md font-medium hover:bg-red-100 transition-colors"
        >
          <LogOut size={16} /> <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Jan Agro Nusantara
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          {currentView === "main" && renderMainView()}
          {currentView === "login" && renderLoginView()}
          {currentView === "register" && renderRegisterView()}
          {currentView === "profile" && renderProfileView()}
        </div>
      </div>
    </div>
  );
};

export default ProfileSlide;
