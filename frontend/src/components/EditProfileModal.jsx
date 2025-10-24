import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  AtSign,
  Lock,
  Phone,
  MapPin,
  AlertCircle,
} from "lucide-react";

const EditProfileModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    noTelp: user.noTelp || "",
    alamat: user.alamat || "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [initialData, setInitialData] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    setInitialData({
      username: user.username,
      email: user.email,
      noTelp: user.noTelp || "",
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setError("");

    if (name === "noTelp") {
      const numericValue = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const isCriticalChange =
    formData.username !== initialData.username ||
    formData.email !== initialData.email ||
    formData.noTelp !== initialData.noTelp;

  const handleSave = () => {
    setError("");
    if (isCriticalChange) {
      if (!confirmPassword) {
        setError("Password confirmation is required to save these changes.");
        return;
      }
      if (confirmPassword !== user.password) {
        setError("The password you entered is incorrect.");
        return;
      }
    }

    if (
      formData.noTelp &&
      (formData.noTelp.length < 8 || formData.noTelp.length > 15)
    ) {
      setError("Nomor Telepon must be between 8 and 15 digits.");
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-8 transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            {" "}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {" "}
              Full Name{" "}
            </label>{" "}
            <div className="relative">
              {" "}
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />{" "}
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-black"
              />{" "}
            </div>{" "}
          </div>
          <div>
            {" "}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {" "}
              Username{" "}
            </label>{" "}
            <div className="relative">
              {" "}
              <AtSign
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />{" "}
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-black"
              />{" "}
            </div>{" "}
          </div>
          <div>
            {" "}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {" "}
              Email{" "}
            </label>{" "}
            <div className="relative">
              {" "}
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />{" "}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-black"
              />{" "}
            </div>{" "}
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
                className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="tel"
                name="noTelp"
                value={formData.noTelp}
                onChange={handleInputChange}
                className="w-full pl-16 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            <div className="relative">
              <MapPin
                className="absolute left-3 top-4 text-gray-400"
                size={16}
              />
              <textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-black"
                rows="3"
              ></textarea>
            </div>
          </div>

          {isCriticalChange && (
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
              <p className="font-semibold text-yellow-800">Confirm Changes</p>
              <p className="text-sm text-yellow-700 mb-2">
                To change your username, email, or phone number, please enter
                your current password.
              </p>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setError("");
                    setConfirmPassword(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-black"
                  placeholder="Enter current password"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <button
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50"
            >
              {" "}
              Cancel{" "}
            </button>
            <button
              onClick={handleSave}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800"
            >
              {" "}
              Save Changes{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
