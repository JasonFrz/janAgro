
const express = require("express");
const router = express.Router();
const Checkout = require("../models/Checkout");
const Cart = require("../models/Carts");
const Voucher = require("../models/Voucher");
const { authenticateToken } = require("../middleware/authenticate");

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

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Tidak ada item untuk di-checkout." });
    }

      if (kodeVoucher) {
      console.log(`Processing checkout with voucher code: ${kodeVoucher}`); // <-- Tambahkan log ini untuk debug

      const voucherToUpdate = await Voucher.findOne({ code: kodeVoucher });

      if (voucherToUpdate && voucherToUpdate.isActive && voucherToUpdate.currentUses < voucherToUpdate.maxUses) {
        console.log(`Voucher found: ${voucherToUpdate.code}. Incrementing usage.`); // <-- Tambahkan log ini
        voucherToUpdate.currentUses += 1;
        await voucherToUpdate.save();
      } else {
        console.log(`Voucher "${kodeVoucher}" is invalid or expired.`); // <-- Tambahkan log ini
        return res.status(400).json({ success: false, message: "Voucher yang digunakan sudah tidak valid atau telah habis." });
      }
    }

    const newCheckout = new Checkout({
      userId,
      nama,
      alamat,
      noTelpPenerima,
      items: items.map(item => ({ 
        product: item._id,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      diskon,
      kodeVoucher, 
      kurir,
      totalHarga,
      metodePembayaran,
    });

    await newCheckout.save();

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