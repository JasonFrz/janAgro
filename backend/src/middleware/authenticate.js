const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// ... (authenticateToken dan authenticateRefreshToken tetap sama) ...
const authenticateToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    const verified = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(400).json({ error: "Invalid Token" });
  }
};

const authenticateRefreshToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;
  try {
    const verified = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(400).json({ error: "Invalid Token" });
  }
};

// --- PERUBAHAN DI SINI ---

const isAdmin = async (req, res, next) => {
  // Gunakan optional chaining (?.) untuk keamanan jika role tidak ada
  const role = req.user?.role?.toLowerCase(); 
  
  if (role === "admin") {
    next();
  } else {
    return res.status(403).json({ error: "Forbidden" });
  }
};

const isPemilik = async (req, res, next) => {
  // 1. Ambil role dan ubah ke huruf kecil semua (lowercase)
  // Ini akan mengubah "Pemilik" -> "pemilik", "OWNER" -> "owner", dll.
  const role = req.user?.role?.toLowerCase();

  // 2. Cek apakah role adalah "pemilik" ATAU "owner"
  if (role === "pemilik" || role === "owner") {
    next();
  } else {
    return res.status(403).json({ error: "Forbidden" });
  }
};

module.exports = {
  authenticateToken,
  authenticateRefreshToken,
  isAdmin,
  isPemilik,
};