const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { hashPassword } = require("../functions/passwordHasing");

router.get("/get-all-users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/update-user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedUser)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/delete-user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/toggle-ban/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    user.isBanned = !user.isBanned;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isBanned ? "banned" : "unbanned"} successfully`,
      data: user,
    });
  } catch (error) {
    console.error("Error toggling ban:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.post("/create-admin", async (req, res) => {
  try {
    const { name, username, email, password, phone } = req.body;

    if (!name || !username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Nama, username, email, dan password harus diisi" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username atau email sudah digunakan.",
      });
    }

    // Pastikan hashPassword adalah sebuah fungsi sebelum memanggilnya
    if (typeof hashPassword !== 'function') {
        console.error("hashPassword is not a function!", hashPassword);
        return res.status(500).json({ success: false, message: "Server configuration error." });
    }

    const hashedPassword = await hashPassword(password);

    const newAdmin = new User({
      name,
      username,
      email,
      phone,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();

    const adminResponse = newAdmin.toObject();
    delete adminResponse.password;

    res.status(201).json({
      success: true,
      message: "Admin baru berhasil dibuat!",
      data: adminResponse,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
});


module.exports = router;
