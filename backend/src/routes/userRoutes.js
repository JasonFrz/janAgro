const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { comparePassword, hashPassword } = require("../functions/passwordHasing");
const { authenticateToken } = require("../middleware/authenticate");


const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/profile/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Hanya file .jpeg atau .png yang diizinkan!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter
});

router.get("/test", (req, res) => {
  res.send("File userRoutes.js berhasil dimuat!");
});

router.put(
  "/update-avatar/:userId",
  [authenticateToken, upload.single('avatar')], 
  async (req, res) => {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ success: false, message: "Akses ditolak." });
    }
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "Tidak ada file yang diupload." });
      }

      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
      }

      const avatarPath = path.join('profile', req.file.filename);
      user.avatar = avatarPath.replace(/\\/g, "/"); 
      
      await user.save();
      
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(200).json({
        success: true,
        message: "Avatar berhasil diperbarui!",
        user: userResponse,
      });
    } catch (error) {
      console.error("Error updating avatar:", error);
      res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
    }
  }
);


// Rute update-profile Anda tetap sama
router.put(
  "/update-profile/:userId",
  authenticateToken,
  async (req, res) => {
    // ... (kode ini tidak diubah)
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
      user.phone = profileData.phone;
      user.address = profileData.address;
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
      user.phone = profileData.phone;
      user.address = profileData.address;

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