const express = require("express");
const router = express.Router();
const Users = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  hashPassword,
  comparePassword,
} = require("../functions/passwordHasing");
const {
  registerSchema,
  loginSchema,
} = require("../schema/schemaLoginRegister");

// --- Token Verification Middleware ---
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (token == null) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(
    process.env.JWT_SECRET || "your-fallback-secret-key",
    (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid" });
      }
      req.user = user;
      next();
    }
  );
};

// --- GET Profile Route (Protected) ---
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// --- POST Register Route ---
router.post("/register", async (req, res) => {
  try {
    // 1. Validate against schema
    // We only pass fields the schema expects
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

    // 2. Check for existing user/email
    const findExistingUser = await Users.findOne({
      username: req.body.username,
    });
    if (findExistingUser) {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }

    const findExistingEmail = await Users.findOne({
      email: req.body.email,
    });
    if (findExistingEmail) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    // 3. Hash password and create user
    const hashedPassword = await hashPassword(req.body.password);
    const newUser = new Users({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      no_telp: req.body.no_telp,
      password: hashedPassword,
      // 'role' will be set by the schema's default ("user")
    });

    // 4. Save user and send response
    await Users.create(newUser);
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
    console.error(error); // Log the error to your terminal
    return res.status(500).json({ message: "Server error" });
  }
});

// --- POST Login Route (Corrected) ---
router.post("/login", async (req, res) => {
  try {
    // 1. Validate the request body
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // 2. Destructure 'identifier' and 'password'
    const { identifier, password } = req.body;

    // 3. Find user by email OR username
    const user = await Users.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4. Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 5. Check if banned
    if (user.isBanned) {
      return res.status(403).json({ message: "Akun ini telah ditangguhkan." });
    }

    // 6. Create JWT
    const payload = {
      id: user._id,
      username: user.username,
      role: user.role,
    };
    const secret = process.env.JWT_SECRET || "your-fallback-secret-key";
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    // 7. Send successful response
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
    console.error(error); // This will show the crash error in your terminal
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;