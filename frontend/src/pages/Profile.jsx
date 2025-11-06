import React, { useState, useRef } from "react";
import {
  Camera,
  User,
  Mail,
  Calendar,
  Edit,
  AtSign,
  Phone,
  MapPin,
} from "lucide-react";
import EditProfileModal from "../components/EditProfileModal";
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
  onProfileSave, 
}) => {
  const [preview, setPreview] = useState(user?.avatar || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        Silakan masuk untuk melihat profil Anda.
      </div>
    );
  }

  const handleSaveFromModal = async (userId, payload) => {
    const result = await onProfileSave(userId, payload);
    return result;
  };

  return (
    <>
      {isModalOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveFromModal}
        />
      )}

      <div className="bg-white min-h-screen pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 md:p-12 rounded-lg border border-gray-200 shadow-sm">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-black">
                Pengaturan Akun
              </h1>
              <p className="text-gray-500 mt-2">
                Kelola detail profil dan akun Anda.
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
                Informasi Profil
              </h3>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <User className="text-gray-400 mr-4 flex-shrink-0" size={20} />
                  <div className="flex-grow">
                    <p className="text-sm text-gray-500">Nama Lengkap</p>
                    <p className="text-black font-medium">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <AtSign className="text-gray-400 mr-4 flex-shrink-0" size={20} />
                  <div className="flex-grow">
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="text-black font-medium">{user.username}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Mail className="text-gray-400 mr-4 flex-shrink-0" size={20} />
                  <div className="flex-grow">
                    <p className="text-sm text-gray-500">Alamat Email</p>
                    <p className="text-black font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Phone className="text-gray-400 mr-4 flex-shrink-0" size={20} />
                  <div className="flex-grow">
                    <p className="text-sm text-gray-500">Nomor Telepon</p>
                    <p className="text-black font-medium">
                      {formatPhoneNumber(user.no_telp || user.noTelp)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <MapPin className="text-gray-400 mr-4 flex-shrink-0 mt-1" size={20} />
                  <div className="flex-grow">
                    <p className="text-sm text-gray-500">Alamat</p>
                    <p className="text-black font-medium whitespace-pre-line">
                      {user.alamat || "Alamat belum diatur"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="text-gray-400 mr-4 flex-shrink-0" size={20} />
                  <div className="flex-grow">
                    <p className="text-sm text-gray-500">Bergabung Sejak</p>
                    <p className="text-black font-medium">{user.joinDate || new Date(user.createdAt).toLocaleDateString("id-ID")}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-8 pt-8">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center justify-center space-x-2 bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors"
              >
                <Edit size={16} /> <span>Edit Profil & Keamanan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;