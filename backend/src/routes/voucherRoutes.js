const express = require("express");
const router = express.Router();
const Voucher = require("../models/Voucher");

// CREATE - Menambah voucher baru
router.post("/add-voucher", async (req, res) => {
  try {
    const newVoucher = new Voucher(req.body);
    const savedVoucher = await newVoucher.save();
    res.status(201).json({
      success: true,
      data: savedVoucher,
      message: "Voucher berhasil ditambahkan",
    });
  } catch (error) {
    // Tangani error jika kode voucher duplikat
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Kode voucher sudah ada." });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// READ - Mendapatkan semua voucher
router.get("/get-all-vouchers", async (req, res) => {
  try {
    const allVouchers = await Voucher.find().sort({ createdAt: -1 }); // Urutkan dari yang terbaru
    res.json({
      success: true,
      data: allVouchers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// UPDATE - Memperbarui voucher berdasarkan ID
router.put("/update-voucher/:id", async (req, res) => {
  try {
    const updatedVoucher = await Voucher.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedVoucher) {
      return res.status(404).json({ success: false, message: "Voucher tidak ditemukan" });
    }
    res.json({
      success: true,
      data: updatedVoucher,
      message: "Voucher berhasil diperbarui",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Kode voucher sudah ada." });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// DELETE - Menghapus voucher berdasarkan ID
router.delete("/delete-voucher/:id", async (req, res) => {
  try {
    const deletedVoucher = await Voucher.findByIdAndDelete(req.params.id);
    if (!deletedVoucher) {
      return res.status(404).json({ success: false, message: "Voucher tidak ditemukan" });
    }
    res.json({ success: true, message: "Voucher berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;