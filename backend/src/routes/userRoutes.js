const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { comparePassword, hashPassword } = require("../functions/passwordHasing");
const { authenticateToken } = require("../middleware/authenticate");

router.put(
  "/update-profile/:userId",
  authenticateToken,
  async (req, res) => {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak: Anda tidak diizinkan untuk mengedit profil ini.",
      });
    }

    try {
      const { profileData, currentPassword, newPassword } = req.body;

      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
      }

      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Password saat ini salah." });
      }

      user.name = profileData.name;
      user.username = profileData.username;
      user.email = profileData.email;
      user.no_telp = profileData.no_telp;
      user.alamat = profileData.alamat;

      if (newPassword) {
        user.password = await hashPassword(newPassword);
      }
      const updatedUser = await user.save();
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

router.get("/get-all-users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;