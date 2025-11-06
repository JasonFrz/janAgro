// File: routes/checkoutRoutes.js

const express = require("express");
const router = express.Router();
const Checkout = require("../models/Checkout"); // Pastikan path ke model Checkout benar
const Cart = require("../models/Carts"); // Kita butuh ini untuk mengosongkan keranjang
const { authenticateToken } = require("../middleware/authenticate");

/**
 * @route   POST /api/checkouts/create
 * @desc    Membuat pesanan baru dari keranjang
 * @access  Private
 */
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      nama,
      alamat,
      noTelpPenerima,
      items,
      subtotal,
      diskon,
      kodeVoucher,
      kurir,
      totalHarga,
      metodePembayaran,
    } = req.body;

    // Validasi sederhana
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Tidak ada item untuk di-checkout." });
    }

    // Buat pesanan baru
    const newCheckout = new Checkout({
      userId,
      nama,
      alamat,
      noTelpPenerima,
      items: items.map(item => ({ // Pastikan struktur item sesuai dengan skema
        product: item._id, // Ambil _id dari item
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      diskon,
      kodeVoucher, // Ini seharusnya ID voucher, bukan kode. Perlu disesuaikan jika ingin menyimpan referensi.
      kurir,
      totalHarga,
      metodePembayaran,
    });

    await newCheckout.save();

    // Kosongkan keranjang user setelah checkout berhasil
    await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });

    res.status(201).json({
      success: true,
      message: "Pesanan berhasil dibuat!",
      data: newCheckout,
    });

  } catch (error) {
    console.error("Error creating checkout:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
});

/**
 * @route   GET /api/checkouts
 * @desc    Mendapatkan riwayat pesanan untuk pengguna yang login
 * @access  Private
 */
router.get("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const checkouts = await Checkout.find({ userId: userId }).sort({ createdAt: -1 }); // Urutkan dari yang terbaru

        res.status(200).json({
            success: true,
            message: "Riwayat pesanan berhasil diambil.",
            data: checkouts,
        });

    } catch (error) {
        console.error("Error fetching checkouts:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
    }
});


module.exports = router;