// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { comparePassword, hashPassword } = require("../functions/passwordHasing");
const { authenticateToken } = require("../middleware/authenticate");

/**
 * @route   PUT /api/users/update-profile/:userId
 * @desc    Memperbarui profil dan password pengguna yang sedang login
 * @access  Private (Hanya untuk pengguna yang bersangkutan)
 */
router.put(
  "/update-profile/:userId",
  authenticateToken,
  async (req, res) => {
    // Keamanan #1: Pastikan pengguna hanya bisa mengedit profil mereka sendiri.
    // req.user.id berasal dari token JWT, req.params.userId berasal dari URL.
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak: Anda tidak diizinkan untuk mengedit profil ini.",
      });
    }

    try {
      const { profileData, currentPassword, newPassword } = req.body;

      // Cari pengguna di database
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
      }

      // Keamanan #2: Verifikasi password saat ini
      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Password saat ini salah." });
      }

      // Update data profil
      user.name = profileData.name;
      user.username = profileData.username;
      user.email = profileData.email;
      user.no_telp = profileData.no_telp;
      user.alamat = profileData.alamat;

      // Jika ada password baru, hash dan update
      if (newPassword) {
        // Validasi panjang password (jika diperlukan) bisa ditambahkan di sini
        user.password = await hashPassword(newPassword);
      }

      // Simpan perubahan ke database
      const updatedUser = await user.save();

      // Kirim kembali data pengguna yang sudah diperbarui (tanpa password)
      const userResponse = updatedUser.toObject();
      delete userResponse.password;

      res.status(200).json({
        success: true,
        message: "Profil berhasil diperbarui!",
        user: userResponse,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
            success: false,
            message: `Gagal memperbarui: ${Object.keys(error.keyValue)[0]} sudah digunakan.`,
        });
      }
      console.error("Error updating profile:", error);
      res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
    }
  }
);

module.exports = router;