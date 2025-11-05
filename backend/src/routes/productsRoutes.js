const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// CREATE - Menambah produk baru
router.post("/add-product", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json({
      success: true,
      data: savedProduct,
      message: "Produk berhasil ditambahkan",
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// READ - Mendapatkan semua produk
router.get("/get-all-products", async (req, res) => {
  try {
    const getAllProducts = await Product.find();
    res.json({
      success: true,
      data: getAllProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// UPDATE - Memperbarui produk berdasarkan ID
router.put("/update-product/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true } // Opsi ini mengembalikan dokumen yang sudah diperbarui
    );
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
    }
    res.json({
      success: true,
      data: updatedProduct,
      message: "Produk berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE - Menghapus produk berdasarkan ID
router.delete("/delete-product/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
    }
    res.json({ success: true, message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;