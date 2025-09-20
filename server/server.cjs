const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load .env

const app = express();

// ===== Middleware =====
app.use(cors({
  origin: "http://localhost:5173", // ganti sesuai port React-mu
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "janAgro",
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== Schema & Model =====
const produkSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  type: { type: String, required: true },   // string bebas
  harga: { type: Number, required: true },
  stok: { type: Number, required: true },
  image: { type: String, default: "" },
  description: { type: String, default: "" },
}, { timestamps: true });

const Produk = mongoose.model("Produk", produkSchema);

// ====== API CRUD ======

// GET semua produk
app.get("/api/Produk", async (req, res, next) => {
  try {
    const produk = await Produk.find().sort({ createdAt: -1 });
    res.json(produk);
  } catch (error) {
    next(error);
  }
});

// POST tambah produk
app.post("/api/Produk", async (req, res, next) => {
  try {
    console.log("📥 POST data:", req.body);
    const newProduk = new Produk(req.body);
    await newProduk.save();
    res.status(201).json(newProduk);
  } catch (error) {
    next(error);
  }
});

// PUT update produk
app.put("/api/Produk/:id", async (req, res, next) => {
  try {
    console.log("✏️ UPDATE id:", req.params.id, "body:", req.body);
    const updated = await Produk.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: "Produk tidak ditemukan" });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// DELETE hapus produk
app.delete("/api/Produk/:id", async (req, res, next) => {
  try {
    console.log("🗑️ DELETE id:", req.params.id);
    const deleted = await Produk.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Produk tidak ditemukan" });
    res.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    next(error);
  }
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
