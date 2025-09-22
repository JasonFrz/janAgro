const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());


if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in the .env file');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'janAgro',
  })
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });


const ProdukSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  harga: {
    type: Number,
    required: true
  },
  stok: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
}, {
  timestamps: true
});

const Produk = mongoose.model("Produk", ProdukSchema);


app.get("/api/Produk", async (req, res) => {
  try {
    const produk = await Produk.find().sort({
      createdAt: -1
    });
    res.json(produk);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

app.post("/api/Produk", async (req, res) => {
  try {
    const newProduk = new Produk(req.body);
    const savedProduk = await newProduk.save();
    res.status(201).json(savedProduk);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});

app.put("/api/Produk/:id", async (req, res) => {
  try {
    const updated = await Produk.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) {
      return res.status(404).json({
        message: "Produk not found"
      });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({
      message: err.message
    });
  }
});

app.delete("/api/Produk/:id", async (req, res) => {
  try {
    const deleted = await Produk.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        message: "Produk not found"
      });
    }
    res.json({
      message: "Produk successfully deleted"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});


app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log("📋 Available endpoints:");
  console.log("   GET    /api/Produk");
  console.log("   POST   /api/Produk");
  console.log("   PUT    /api/Produk/:id");
  console.log("   DELETE /api/Produk/:id");
});