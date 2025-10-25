const express = require("express");
const router = express.Router();
const Users = require("../models/User");
const { hashPassword } = require("../functions/passwordHasing");
const {
  registerSchema,
  loginSchema,
} = require("../schema/schemaLoginRegister");

router.post("/register", async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const findExistingUser = Users.findOne({
      username: req.body.username,
    });
    if (findExistingUser) {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }

    const findExistingEmail = Users.findOne({
      email: req.body.email,
    });

    if (findExistingEmail) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    const hashedPassword = await hashPassword(req.body.password);
    const newUser = new Users({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      alamat: req.body.alamat,
      no_telp: req.body.no_telp,
      password: hashedPassword,
      role: req.body.role,
    });

    await Users.create(newUser);
    return res.status(201).json({
      message: "User berhasil didaftarkan",
      data: {
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        alamat: newUser.alamat,
        no_telp: newUser.no_telp,
        role: newUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
