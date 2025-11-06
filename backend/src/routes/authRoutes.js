const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Menggunakan 'User' sesuai konvensi
const Product = require("../models/Product"); // Asumsi Anda memiliki model ini
const jwt = require("jsonwebtoken");
const {
  hashPassword,
  comparePassword,
} = require("../functions/passwordHasing");
const {
  registerSchema,
  loginSchema,
} = require("../schema/schemaLoginRegister");

// Impor middleware yang akan kita gunakan
const { authenticateToken, isPemilik } = require("../middleware/authenticate");

// =================================================================
// ==                  RUTE PUBLIK (Login & Register)             ==
// =================================================================

/**
 * @route   POST /api/auth/register
 * @desc    Mendaftarkan pengguna baru
 * @access  Public
 */
router.post("/register", async (req, res) => {
  try {
    const { error } = registerSchema.validate({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      no_telp: req.body.no_telp,
      password: req.body.password,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const findExistingUser = await User.findOne({ username: req.body.username });
    if (findExistingUser) {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }

    const findExistingEmail = await User.findOne({ email: req.body.email });
    if (findExistingEmail) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    const hashedPassword = await hashPassword(req.body.password);
    const newUser = new User({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      no_telp: req.body.no_telp,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({
      message: "User berhasil didaftarkan",
      data: {
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        no_telp: newUser.no_telp,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login pengguna
 * @access  Public
 */
router.post("/login", async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { identifier, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: "Akun ini telah ditangguhkan." });
    }

    const payload = { id: user._id, username: user.username, role: user.role };
    
    // PENTING: Gunakan secret yang sama dengan yang diverifikasi oleh middleware
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
        console.error("FATAL ERROR: JWT_ACCESS_SECRET is not defined in .env file.");
        return res.status(500).json({ message: "Server configuration error." });
    }

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});


// =================================================================
// ==        RUTE TERPROTEKSI UMUM (Untuk Semua User Login)       ==
// =================================================================

/**
 * @route   GET /api/auth/profile
 * @desc    Mendapatkan profil pengguna yang sedang login
 * @access  Private (Semua peran: User, Admin, Pemilik)
 */
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    // req.user didapat dari middleware authenticateToken
    const user = await User.findById(req.user.id).select("-password").lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
     const userForFrontend = {
      ...userFromDb,
      noTelp: userFromDb.no_telp, // Buat properti baru 'noTelp' dari 'no_telp'
    };
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});


// =================================================================
// ==         RUTE TERPROTEKSI KHUSUS (Hanya Untuk Pemilik)       ==
// =================================================================

/**
 * @route   GET /api/auth/pemilik/dashboard-stats
 * @desc    Mendapatkan statistik ringkasan untuk dashboard Pemilik
 * @access  Private (Hanya Pemilik)
 */
router.get("/pemilik/dashboard-stats", [authenticateToken, isPemilik], async (req, res) => {
    try {
      const [totalUsers, totalProducts, totalOrders, revenueData] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
          { $match: { status: { $in: ["selesai", "sampai"] } } },
          { $group: { _id: null, totalRevenue: { $sum: "$totalHarga" } } },
        ]),
      ]);
      const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
      res.status(200).json({
        message: "Data statistik berhasil diambil",
        data: { totalUsers, totalProducts, totalOrders, totalRevenue },
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
});

/**
 * @route   GET /api/auth/pemilik/users
 * @desc    Mendapatkan semua data pengguna
 * @access  Private (Hanya Pemilik)
 */
router.get("/pemilik/users", [authenticateToken, isPemilik], async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.status(200).json({
        message: "Data semua pengguna berhasil diambil",
        data: users,
      });
    } catch (error) {
      console.error("Error fetching all users:", error);
      res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
});

/**
 * @route   PUT /api/auth/pemilik/users/:id/ban
 * @desc    Melakukan ban atau unban pada seorang pengguna
 * @access  Private (Hanya Pemilik)
 */
router.put("/pemilik/users/:id/ban", [authenticateToken, isPemilik], async (req, res) => {
    try {
      const userToUpdate = await User.findById(req.params.id);
      if (!userToUpdate) {
        return res.status(404).json({ message: "Pengguna tidak ditemukan" });
      }
      if (req.user.id === userToUpdate._id.toString()) {
          return res.status(403).json({ message: "Anda tidak dapat menangguhkan akun Anda sendiri." });
      }
      userToUpdate.isBanned = !userToUpdate.isBanned;
      await userToUpdate.save();
      const userResponse = userToUpdate.toObject();
      delete userResponse.password;
      res.status(200).json({
        message: `Pengguna '${userToUpdate.username}' telah berhasil ${userToUpdate.isBanned ? "ditangguhkan" : "diaktifkan kembali"}`,
        data: userResponse,
      });
    } catch (error) {
      console.error("Error toggling user ban status:", error);
      res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
});

module.exports = router;