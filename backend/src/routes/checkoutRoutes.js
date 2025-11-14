// File: src/routes/checkoutRoutes.js

const express = require("express");
const router = express.Router();
const Checkout = require("../models/Checkout");
const Cart = require("../models/Carts");
const Voucher = require("../models/Voucher");
const Product = require("../models/Product"); // <-- 1. Impor model Product
const { authenticateToken } = require("../middleware/authenticate");
const snap = require('../config/midtrans');

// Rute untuk membuat transaksi (tidak ada perubahan di sini)
router.post("/create", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { totalHarga, items, nama, alamat, noTelpPenerima } = req.body;

    const newCheckout = new Checkout({
      ...req.body,
      userId,
      status: 'pending',
      items: items.map(item => ({ 
        product: item._id,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
      })),
    });
    
    const savedCheckout = await newCheckout.save();

    const itemDetails = items.map(item => ({
      id: item._id.toString(),
      price: Math.round(item.price),
      quantity: item.quantity,
      name: item.name.substring(0, 50),
    }));
    
    if (req.body.kurir && req.body.kurir.biaya > 0) {
        itemDetails.push({ id: 'SHIPPING_FEE', price: Math.round(req.body.kurir.biaya), quantity: 1, name: 'Courier Fee' });
    }
    if (req.body.diskon && req.body.diskon > 0) {
        itemDetails.push({ id: 'DISCOUNT', price: -Math.round(req.body.diskon), quantity: 1, name: 'Discount' });
    }

    const parameter = {
      transaction_details: {
        order_id: savedCheckout._id.toString(),
        gross_amount: Math.round(totalHarga),
      },
      item_details: itemDetails,
      customer_details: {
        first_name: nama,
        email: req.user.email,
        phone: noTelpPenerima,
        shipping_address: { address: alamat }
      },
    };

    const transaction = await snap.createTransaction(parameter);
    res.status(200).json({ success: true, message: "Transaksi Midtrans berhasil dibuat.", token: transaction.token });

  } catch (error) {
    console.error("Error creating Midtrans transaction:", error);
    if (error.ApiResponse) {
        return res.status(400).json({ success: false, message: error.ApiResponse.error_messages.join(', ') });
    }
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
});

// RUTE NOTIFIKASI MIDTRANS (DENGAN PERBAIKAN)
router.post("/midtrans-notification", async (req, res) => {
  try {
    const statusResponse = await snap.transaction.notification(req.body);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Notifikasi diterima untuk order ${orderId} dengan status: ${transactionStatus}`);

    const checkout = await Checkout.findById(orderId);
    if (!checkout) return res.status(404).send('Checkout not found');
    if (checkout.status !== 'pending') return res.status(200).send('OK (Order status already updated)');

    if ((transactionStatus === 'capture' || transactionStatus === 'settlement') && fraudStatus === 'accept') {
      // --- PERBAIKAN UTAMA DI SINI ---
      // 1. Update status pesanan
      checkout.status = 'diproses';
      await checkout.save();

      // 2. Kurangi stok produk
      for (const item of checkout.items) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: -item.quantity } }
        );
      }

      // 3. Tambah penggunaan voucher jika ada
      if (checkout.kodeVoucher) {
        await Voucher.updateOne(
          { code: checkout.kodeVoucher },
          { $inc: { currentUses: 1 } }
        );
      }

      // 4. Kosongkan keranjang pengguna
      await Cart.findOneAndUpdate({ userId: checkout.userId }, { $set: { items: [] } });
      
      console.log(`Order ${orderId} successfully processed.`);

    } else if (transactionStatus === 'deny' || transactionStatus === 'expire' || transactionStatus === 'cancel') {
      checkout.status = 'dibatalkan';
      await checkout.save();
      console.log(`Order ${orderId} was cancelled or failed.`);
    }

    res.status(200).send('OK');

  } catch (error) {
    console.error('Error handling Midtrans notification:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Rute GET riwayat pesanan (tidak berubah)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const checkouts = await Checkout.find({ userId: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: "Riwayat pesanan berhasil diambil.", data: checkouts });
  } catch (error) {
    console.error("Error fetching checkouts:", error);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
});

// Tambahkan ini di checkoutRoutes.js untuk sementara
router.get("/trigger-success/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;
        const checkout = await Checkout.findById(orderId);
        if (!checkout) return res.status(404).send('Not Found');

        // Jalankan logika yang sama seperti di notifikasi
        checkout.status = 'diproses';
        await checkout.save();
        await Product.updateMany({ _id: { $in: checkout.items.map(i => i.product) } }, { /* logika $inc Anda */ });
        await Cart.findOneAndUpdate({ userId: checkout.userId }, { $set: { items: [] } });
        if (checkout.kodeVoucher) {
            await Voucher.updateOne({ code: checkout.kodeVoucher }, { $inc: { currentUses: 1 } });
        }

        res.send(`Order ${orderId} has been manually set to 'diproses'.`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;