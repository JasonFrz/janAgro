const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authenticateToken } = require("../middleware/authenticate");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// 1. DEBUGGING: Cek apakah env terbaca di terminal saat server jalan
console.log("--- Cek Cloudinary Config ---");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME ? "Terbaca" : "MISSING");
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "Terbaca" : "MISSING");
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "Terbaca" : "MISSING");

// 2. Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 3. Konfigurasi Storage (Perbaikan pada params)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'user', // Nama folder di Cloudinary
      format: file.mimetype.split('/')[1], // paksa format sesuai file asli (jpg/png)
      public_id: `avatar-${req.user.id}-${Date.now()}`, // Custom nama file agar rapi
    };
  },
});

// 4. Middleware Upload dengan Error Handling
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
      cb(null, true);
    } else {
      cb(new Error("Format file tidak didukung! Hanya JPG/PNG."), false);
    }
  },
});

// --- ROUTE UPDATE AVATAR ---
router.put(
  "/update-avatar/:userId",
  authenticateToken, 
  // Wrapper middleware untuk menangkap error Multer/Cloudinary
  (req, res, next) => {
    upload.single('avatar')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Error spesifik Multer (misal file terlalu besar)
        return res.status(400).json({ success: false, message: `Multer Error: ${err.message}` });
      } else if (err) {
        // Error dari Cloudinary atau file filter
        console.error("Upload Error:", err);
        return res.status(500).json({ success: false, message: `Upload Gagal: ${err.message}` });
      }
      // Jika sukses, lanjut ke controller
      next();
    });
  },
  async (req, res) => {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ success: false, message: "Akses ditolak." });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "Tidak ada file gambar yang dikirim." });
      }

      console.log("File berhasil upload ke Cloudinary:", req.file.path); // Debug URL

      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
      }

      // Simpan URL Cloudinary
      user.avatar = req.file.path;
      await user.save();
      
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(200).json({
        success: true,
        message: "Avatar berhasil diperbarui!",
        user: userResponse,
      });
    } catch (error) {
      console.error("Database Error:", error);
      res.status(500).json({ success: false, message: "Terjadi kesalahan pada server database." });
    }
  }
);


router.put(
  "/update-address/:userId",
  authenticateToken,
  async (req, res) => {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak: Anda tidak diizinkan untuk mengedit alamat ini.",
      });
    }

    try {
      const { address } = req.body;
      if (!address) {
        return res.status(400).json({ success: false, message: "Alamat tidak boleh kosong." });
      }

      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
      }

      user.address = address;
      await user.save();

      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(200).json({
        success: true,
        message: "Alamat berhasil diperbarui!",
        user: userResponse,
      });
    } catch (error) {
      console.error("Error updating address:", error);
      res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
    }
  }
);

// --- UPDATE PROFILE (DATA TEXT) ---
// Note: Anda punya duplikat route ini di kode asli, saya hapus salah satunya.
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
      
      // Validasi Password Lama
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

// --- GET ALL USERS ---
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