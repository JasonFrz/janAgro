const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); 
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "public/produk";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const productName = req.body.name;
    const sanitizedName = productName
      .toLowerCase()
      .replace(/\s+/g, '-') 
      .replace(/[^a-z0-9-]/g, ''); 

  const fileExtension = path.extname(file.originalname);
  const finalFilename = `${sanitizedName}-${Date.now()}${fileExtension}`;

    cb(null, finalFilename);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Hanya file JPG dan PNG yang diizinkan!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});
router.post("/add-product", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "File gambar produk wajib diunggah." });
    }
    const { name, category, price, stock, description, detail, rating } = req.body;
    const imagePath = req.file.path.replace(/\\/g, "/").replace("public/", "");
    const productToSave = {
      name, category, price, stock, description, detail,
      rating: rating || 0,
      image: imagePath,
    };
    const newProduct = new Product(productToSave);
    const savedProduct = await newProduct.save();
    res.status(201).json({
      success: true,
      data: savedProduct,
      message: "Produk berhasil ditambahkan",
    });
  } catch (error) {
    console.error("Error saat menambahkan produk:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
});
router.put("/update-product/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      const imagePath = req.file.path.replace(/\\/g, "/").replace("public/", "");
      updateData.image = imagePath;
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan." });
    }
    res.json({
      success: true,
      data: updatedProduct,
      message: "Produk berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error saat memperbarui produk:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
});

router.get("/get-all-products", async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.json({
      success: true,
      data: allProducts,
    });
  } catch (error) {
    console.error("Error saat mengambil produk:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
});

router.delete("/delete-product/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan." });
    }
    if (deletedProduct.image) {
      const imagePath = path.join(__dirname, `../../public/${deletedProduct.image}`);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    res.json({ success: true, message: "Produk berhasil dihapus." });
  } catch (error) {
    console.error("Error saat menghapus produk:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
});

module.exports = router;