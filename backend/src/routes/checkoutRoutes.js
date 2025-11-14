// File: src/routes/checkoutRoutes.js

const express = require("express");
const router = express.Router();
const Checkout = require("../models/Checkout");
const Cart = require("../models/Carts");
const Voucher = require("../models/Voucher");
const { authenticateToken } = require("../middleware/authenticate");
const snap = require('../config/midtrans'); // Impor konfigurasi Midtrans

router.post("/create", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    // Ambil semua detail yang relevan dari body
    const { totalHarga, items, nama, alamat, noTelpPenerima, diskon, kurir } = req.body;

    // 1. Buat dan simpan pesanan di DB dengan status "pending"
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

    // --- PERBAIKAN UTAMA DI SINI ---
    // 2. Siapkan item_details untuk Midtrans
    const itemDetails = items.map(item => ({
      id: item._id.toString(),
      price: Math.round(item.price),
      quantity: item.quantity,
      name: item.name.substring(0, 50),
    }));

    // Tambahkan biaya kurir sebagai item terpisah
    if (kurir && kurir.biaya > 0) {
      itemDetails.push({
        id: 'SHIPPING_FEE',
        price: Math.round(kurir.biaya),
        quantity: 1,
        name: 'Courier Fee',
      });
    }

    // Tambahkan diskon sebagai item dengan harga negatif
    if (diskon && diskon > 0) {
      itemDetails.push({
        id: 'DISCOUNT',
        price: -Math.round(diskon), // Harga negatif untuk diskon
        quantity: 1,
        name: 'Discount',
      });
    }

    // 3. Siapkan parameter lengkap untuk Midtrans
    const parameter = {
      transaction_details: {
        order_id: savedCheckout._id.toString(),
        gross_amount: Math.round(totalHarga), // Total akhir harus cocok
      },
      item_details: itemDetails, // Gunakan item_details yang sudah dimodifikasi
      customer_details: {
        first_name: nama,
        email: req.user.email,
        phone: noTelpPenerima,
        shipping_address: {
          address: alamat,
        }
      },
    };

    // 4. Buat transaksi di Midtrans
    const transaction = await snap.createTransaction(parameter);
    const transactionToken = transaction.token;

    // 5. Kirim token kembali ke frontend
    res.status(200).json({
      success: true,
      message: "Transaksi Midtrans berhasil dibuat.",
      token: transactionToken,
    });

  } catch (error) {
    console.error("Error creating Midtrans transaction:", error);
    // Cek apakah ini error dari Midtrans
    if (error.ApiResponse) {
        console.error('Midtrans API Error:', error.ApiResponse);
        return res.status(400).json({ success: false, message: error.ApiResponse.error_messages.join(', ') });
    }
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
});


// RUTE UNTUK MENERIMA NOTIFIKASI DARI MIDTRANS
router.post("/midtrans-notification", async (req, res) => {
  try {
    const notificationJson = req.body;
    
    const statusResponse = await snap.transaction.notification(notificationJson);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Notifikasi diterima untuk order ${orderId} dengan status: ${transactionStatus}`);

    const checkout = await Checkout.findById(orderId);
    if (!checkout) {
      return res.status(404).send('Checkout not found');
    }

    // Hanya proses jika status pesanan masih 'pending'
    if (checkout.status !== 'pending') {
      return res.status(200).send('OK (Order status already updated)');
    }

    if (transactionStatus == 'capture' || transactionStatus == 'settlement') {
        if (fraudStatus == 'accept') {
            // Pembayaran berhasil
            checkout.status = 'diproses';
            await checkout.save();
            await Cart.findOneAndUpdate({ userId: checkout.userId }, { $set: { items: [] } });

            if (checkout.kodeVoucher) {
                const voucher = await Voucher.findOne({ code: checkout.kodeVoucher });
                if (voucher) {
                    voucher.currentUses += 1;
                    await voucher.save();
                }
            }
        }
    } else if (transactionStatus == 'deny' || transactionStatus == 'expire' || transactionStatus == 'cancel') {
        // Pembayaran gagal
        checkout.status = 'dibatalkan';
        await checkout.save();
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