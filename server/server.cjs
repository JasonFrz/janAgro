const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load .env
console.log("🔍 Loaded ENV:", process.env);


const app = express();

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI tidak ditemukan di file .env");
  console.log("💡 Pastikan file .env ada dan berisi:");
  console.log("   MONGO_URI=mongodb://localhost:27017/janAgro");
  process.exit(1);
}

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

console.log("🔗 Connecting to MongoDB...");
console.log("📍 URI:", process.env.MONGO_URI.replace(/\/\/.*@/, "//<credentials>@")); 

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "janAgro",
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
  console.log("💡 Troubleshooting:");
  console.log("   1. Pastikan MongoDB service berjalan");
  console.log("   2. Periksa MONGO_URI di file .env");
  console.log("   3. Periksa network connection (jika menggunakan Atlas)");
  process.exit(1);
});

const produkSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  type: { type: String, required: true },   
  harga: { type: Number, required: true },
  stok: { type: Number, required: true },
  image: { type: String, default: "" },
  description: { type: String, default: "" },
}, { timestamps: true });

const Produk = mongoose.model("Produk", produkSchema);


// ===== API Endpoints =====


app.get("/api/Produk", async (req, res, next) => {
  try {
    const produk = await Produk.find().sort({ createdAt: -1 });
    res.json(produk);
  } catch (error) {
    next(error);
  }
});

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

app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("📋 Available endpoints:");
  console.log("   GET    /api/Produk");
  console.log("   POST   /api/Produk");
  console.log("   PUT    /api/Produk/:id");
  console.log("   DELETE /api/Produk/:id");
});