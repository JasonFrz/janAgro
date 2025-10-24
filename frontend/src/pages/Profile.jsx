import React, { useState, useRef } from "react";
import {
  Camera,
  User,
  Mail,
  Calendar,
  Edit,
  Shield,
  AtSign,
  Phone,
  MapPin,
} from "lucide-react";
import EditProfileModal from "../components/EditProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";

// Fungsi helper untuk memformat nomor telepon
const formatPhoneNumber = (phone) => {
  if (!phone) return "-";
  const digits = phone.replace(/\D/g, "");
  let formatted = "+62 ";
  if (digits.length > 4) {
    formatted += digits.substring(0, 4) + "-";
    if (digits.length > 8) {
      formatted += digits.substring(4, 8) + "-";
      formatted += digits.substring(8);
    } else {
      formatted += digits.substring(4);
    }
  } else {
    formatted += digits;
  }
  return formatted;
};

const Profile = ({
  user,
  onAvatarChange,
  onProfileUpdate,
  onPasswordChange,
}) => {
  const [preview, setPreview] = useState(user?.avatar || null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatarUrl = reader.result;
        setPreview(newAvatarUrl);
        onAvatarChange(newAvatarUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  if (!user) {
    return (
      <div className="pt-24 text-center">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <>
      {isEditModalOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updatedData) => {
            onProfileUpdate(updatedData);
            setIsEditModalOpen(false);
          }}
        />
      )}
      {isPasswordModalOpen && (
        <ChangePasswordModal
          onClose={() => setIsPasswordModalOpen(false)}
          onSave={onPasswordChange}
        />
      )}

      <div className="bg-white min-h-screen pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 md:p-12 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-black">
                {" "}
                Account Settings{" "}
              </h1>
              <p className="text-gray-500 mt-2">
                {" "}
                Manage your profile and account details.{" "}
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 mb-12">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200 overflow-hidden">
                  {preview ? (
                    <img
                      src={preview}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={64} className="text-gray-400" />
                  )}
                </div>
                <button
                  onClick={handleCameraClick}
                  className="absolute bottom-1 right-1 w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors border-2 border-white"
                  aria-label="Change avatar"
                >
                  <Camera size={20} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/png, image/jpeg"
                />
              </div>
              <h2 className="text-2xl font-semibold text-black">{user.name}</h2>
            </div>
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-semibold text-black mb-6">
                {" "}
                Profile Information{" "}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  {" "}
                  <User
                    className="text-gray-400 mr-4 flex-shrink-0"
                    size={20}
                  />{" "}
                  <div className="flex-grow">
                    {" "}
                    <p className="text-sm text-gray-500">Full Name</p>{" "}
                    <p className="text-black font-medium">{user.name}</p>{" "}
                  </div>{" "}
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  {" "}
                  <AtSign
                    className="text-gray-400 mr-4 flex-shrink-0"
                    size={20}
                  />{" "}
                  <div className="flex-grow">
                    {" "}
                    <p className="text-sm text-gray-500">Username</p>{" "}
                    <p className="text-black font-medium">{user.username}</p>{" "}
                  </div>{" "}
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  {" "}
                  <Mail
                    className="text-gray-400 mr-4 flex-shrink-0"
                    size={20}
                  />{" "}
                  <div className="flex-grow">
                    {" "}
                    <p className="text-sm text-gray-500">Email Address</p>{" "}
                    <p className="text-black font-medium">{user.email}</p>{" "}
                  </div>{" "}
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Phone
                    className="text-gray-400 mr-4 flex-shrink-0"
                    size={20}
                  />
                  <div className="flex-grow">
                    {" "}
                    <p className="text-sm text-gray-500">Nomor Telepon</p>{" "}
                    <p className="text-black font-medium">
                      {formatPhoneNumber(user.noTelp)}
                    </p>{" "}
                  </div>
                </div>
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <MapPin
                    className="text-gray-400 mr-4 flex-shrink-0 mt-1"
                    size={20}
                  />
                  <div className="flex-grow">
                    <p className="text-sm text-gray-500">Alamat</p>
                    <p className="text-black font-medium whitespace-pre-line">
                      {user.alamat || "Alamat belum diatur"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  {" "}
                  <Calendar
                    className="text-gray-400 mr-4 flex-shrink-0"
                    size={20}
                  />{" "}
                  <div className="flex-grow">
                    {" "}
                    <p className="text-sm text-gray-500">Member Since</p>{" "}
                    <p className="text-black font-medium">{user.joinDate}</p>{" "}
                  </div>{" "}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="w-full flex items-center justify-center space-x-2 bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                {" "}
                <Edit size={16} /> <span>Edit Profile</span>{" "}
              </button>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors"
              >
                {" "}
                <Shield size={16} /> <span>Change Password</span>{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
