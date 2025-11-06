import React, { useState } from "react";
import {
  X,
  User,
  Mail,
  AtSign,
  Lock,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const EditProfileModal = ({ user, onClose, onSave }) => {
  // State untuk data profil
  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    email: user.email || "",
    no_telp: user.no_telp || "", // Sesuaikan dengan nama field di backend
    alamat: user.alamat || "",
  });

  // State untuk perubahan password
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // State untuk pesan error dan sukses
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handler untuk perubahan input data profil
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name === "no_telp") {
      // Hanya izinkan angka untuk nomor telepon
      const numericValue = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handler untuk perubahan input password
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSaveChanges = async () => {
    setError("");
    setSuccess("");

    // Validasi #1: Password saat ini wajib diisi untuk menyimpan perubahan apa pun.
    if (!passwordData.currentPassword) {
      setError("Password Anda saat ini diperlukan untuk menyimpan perubahan.");
      return;
    }

    const payload = {
      profileData: formData,
      currentPassword: passwordData.currentPassword,
    };

    // Validasi #2: Jika pengguna mencoba mengubah password
    if (passwordData.newPassword) {
      if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        setError("Konfirmasi password baru tidak cocok.");
        return;
      }

      // Validasi #3: Aturan panjang password berdasarkan peran (role)
      if (
        user.role.toLowerCase() === "pengguna" &&
        passwordData.newPassword.length < 6
      ) {
        setError("Password baru harus memiliki minimal 6 karakter.");
        return;
      }
      // Untuk 'Admin' dan 'Pemilik', pemeriksaan panjang karakter dilewati.

      payload.newPassword = passwordData.newPassword;
    }

    // Panggil fungsi onSave dari parent dengan membawa payload
    // Fungsi ini yang akan melakukan panggilan API ke backend
    const result = await onSave(user._id, payload);

    if (result && result.success) {
      setSuccess(result.message);
      setTimeout(() => {
        onClose(); // Tutup modal setelah berhasil
      }, 2000);
    } else {
      setError(result.message || "Gagal menyimpan perubahan. Coba lagi.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-8 transform transition-all max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">Edit Profil</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Kolom Kiri: Informasi Profil */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" name="name" value={formData.name} onChange={handleProfileChange} className="w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-black" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" name="username" value={formData.username} onChange={handleProfileChange} className="w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-black" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="email" name="email" value={formData.email} onChange={handleProfileChange} className="w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-black" />
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Kontak & Alamat */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="tel" name="no_telp" value={formData.no_telp} onChange={handleProfileChange} className="w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-black" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-4 text-gray-400" size={16} />
                <textarea name="alamat" value={formData.alamat} onChange={handleProfileChange} className="w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-black" rows="5"></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Bagian Ganti Password & Konfirmasi */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-bold text-black mb-4">Ganti Password (Opsional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-black" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="password" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} className="w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-black" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
          <label className="block text-sm font-bold text-gray-800 mb-1">
            Konfirmasi Perubahan
          </label>
          <p className="text-xs text-gray-600 mb-2">
            Masukkan password Anda saat ini untuk menyimpan perubahan apa pun.
          </p>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-black" placeholder="Password saat ini" />
          </div>
        </div>

        {/* Pesan Error & Sukses */}
        {error && (
          <div className="mt-4 flex items-center space-x-2 text-red-700 p-3 bg-red-50 rounded-lg">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
        {success && (
          <div className="mt-4 flex items-center space-x-2 text-green-700 p-3 bg-green-50 rounded-lg">
            <CheckCircle size={20} />
            <span className="text-sm font-medium">{success}</span>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex space-x-4 pt-6 mt-6 border-t">
          <button
            onClick={onClose}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50 font-bold"
          >
            Batal
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={!!success} // Nonaktifkan tombol setelah sukses
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 font-bold disabled:bg-gray-400"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;