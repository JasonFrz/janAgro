const express = require("express");
const router = express.Router();
const Checkout = require("../models/Checkout");
const Cart = require("../models/Carts");
const Voucher = require("../models/Voucher");
const Product = require("../models/Product");
const { logStockMovement } = require("../functions/stockMovementLogger");
const { authenticateToken } = require("../middleware/authenticate");
const snap = require('../config/midtrans');
const Cancellation = require("../models/Cancellation");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY;
let genAI;
let model;


if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
} else {
  console.warn("PERINGATAN: GEMINI_API_KEY belum disetting di .env");
}

const handleSuccessfulTransaction = async (checkout) => {
  if (checkout.status === 'diproses') return;
  console.log(`[LOG] Processing Success Logic for Order: ${checkout._id}`);

  checkout.status = 'diproses';
  await checkout.save();

  
  if (checkout.items && checkout.items.length > 0) {
    for (const item of checkout.items) {
      const productId = item.product || item.productId;
      if (productId) {
        const product = await Product.findById(productId);
        if (!product) continue;

        const previousStock = product.stock || 0;
        const newStock = previousStock - (item.quantity || 0);

        await Product.updateOne({ _id: productId }, { $set: { stock: newStock } });

        try {
          await logStockMovement(
            productId,
            product.name || productId.toString(),
            "out",
            item.quantity || 0,
            "penjualan",
            checkout._id,
            previousStock,
            newStock,
            `Sale - order ${checkout._id}`
          );
        } catch (logErr) {
          console.error("Failed to log stock movement for purchase:", logErr);
        }
      }
    }
  }

  if (checkout.kodeVoucher) {
    await Voucher.updateOne(
      { code: checkout.kodeVoucher },
      { $inc: { currentUses: 1 } }
    );
  }

  await Cart.findOneAndUpdate(
    { userId: checkout.userId },
    { $set: { items: [] } }
  );
};

router.post("/analyze-sales", authenticateToken, async (req, res) => {
  try {
    if (!model) {
      return res.status(500).json({ success: false, message: "Server AI belum dikonfigurasi (API Key hilang)." });
    }

    const { filterType, year, monthStart, monthEnd, specificDate } = req.body;
    let query = {};
    let periodText = "";

    if (!filterType) {
      return res.status(400).json({ success: false, message: "Tipe filter (filterType) wajib diisi." });
    }

    if (filterType === 'daily') {
      if (!specificDate) return res.status(400).json({ success: false, message: "Tanggal spesifik wajib diisi untuk filter harian." });
      
      const date = new Date(specificDate);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
      periodText = `Harian (Tanggal ${specificDate})`;
    } else {
      const y = parseInt(year) || new Date().getFullYear();
      const mStart = parseInt(monthStart) || 1;
      const mEnd = parseInt(monthEnd) || 12;
      
      const startDate = new Date(y, mStart - 1, 1); 
      const endDate = new Date(y, mEnd, 0, 23, 59, 59, 999); 
      
      query.createdAt = { $gte: startDate, $lte: endDate };
      periodText = `Bulan ${mStart} sampai ${mEnd} Tahun ${y}`;
    }

    const orders = await Checkout.find(query)
      .select('totalHarga status items paymentType createdAt')
      .lean(); 

    console.log(`[AI ANALYZE] Periode: ${periodText}, Ditemukan: ${orders.length} data.`);

    if (orders.length === 0) {
      return res.status(200).json({ 
        success: true, 
        analysis: "Belum ada data penjualan pada periode ini, sehingga analisa tidak dapat dilakukan. Silakan pilih periode lain." 
      });
    }

    const totalRevenue = orders.reduce((acc, curr) => acc + (curr.totalHarga || 0), 0);
    
    const successCount = orders.filter(o => ['selesai', 'sampai', 'dikirim', 'diproses'].includes(o.status)).length;
    const cancelCount = orders.filter(o => !o.status || o.status.includes('batal') || o.status.includes('tolak') || o.status.includes('kembali')).length;
    const pendingCount = orders.length - successCount - cancelCount;

    const productMap = {};
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const name = item.name || "Produk Tanpa Nama";
          if (productMap[name]) productMap[name] += (item.quantity || 1);
          else productMap[name] = (item.quantity || 1);
        });
      }
    });

    const topProducts = Object.entries(productMap)
      .sort((a, b) => b[1] - a[1]) 
      .slice(0, 5) 
      .map(p => `- ${p[0]} (${p[1]} pcs)`)
      .join("\n");

    const prompt = `
       Anda adalah Konsultan Bisnis Senior untuk "PT. Jan Agro Nusantara" (Perusahaan Agrikultur).
      Tolong analisa data penjualan berikut untuk periode: ${periodText}.

      DATA STATISTIK:
      1. Total Omzet: Rp ${totalRevenue.toLocaleString('id-ID')}
      2. Total Transaksi: ${orders.length} (Sukses: ${successCount}, Batal/Gagal: ${cancelCount}, Pending: ${pendingCount})
      3. Produk Terlaris (Top 5):
      ${topProducts || "Tidak ada data item terjual"}

      INSTRUKSI:
      Berikan laporan analisa singkat, padat, dan profesional dalam Bahasa Indonesia.
      
      PENTING: 
      - JANGAN gunakan format Markdown seperti tanda bintang (**bold**) atau pagar (#). 
      - Gunakan teks biasa saja agar mudah dibaca di aplikasi.
      - Gunakan format poin-poin angka atau strip (-).

      Gunakan emoji yang relevan agar laporan tidak membosankan.
      
      Struktur Laporan:
      1. Evaluasi Kinerja
      2. Tren Produk
      3. Rekomendasi Strategis
    `;

    // F. Kirim ke Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // G. Kirim Balik ke Frontend
    res.status(200).json({ success: true, analysis: text });

  } catch (error) {
    console.error("[AI ERROR FULL LOG]:", error);
    // Return status 500 dengan pesan yang jelas
    res.status(500).json({ 
      success: false, 
      message: "Gagal memproses AI. Detail: " + (error.message || "Unknown Error") 
    });
  }
});

router.get("/all", authenticateToken, async (req, res) => {
  try {
    const checkouts = await Checkout.find({}).select("+paymentType").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: checkouts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching all orders" });
  }
});

router.get("/ceo-report", authenticateToken, async (req, res) => {
  console.log("--- CEO REPORT HIT ---"); 
  console.log("Params:", req.query); 

  try {
    const { year, month } = req.query;
    let query = {};

    if (year) {
      const y = parseInt(year);
      const startYear = new Date(y, 0, 1);
      const endYear = new Date(y, 11, 31, 23, 59, 59);

      if (month) {
        const m = parseInt(month);
        const startMonth = new Date(y, m - 1, 1);
        const endMonth = new Date(y, m, 0, 23, 59, 59);
        
        query.createdAt = { $gte: startMonth, $lte: endMonth };
      } else {
        query.createdAt = { $gte: startYear, $lte: endYear };
      }
    }

    const reportData = await Checkout.find(query)
      .select("nama totalHarga status createdAt items alamat noTelpPenerima subtotal diskon kurir metodePembayaran paymentType kodeVoucher userId")
      .sort({ createdAt: -1 });

    console.log(`Found ${reportData.length} records for report.`);

    const formattedData = reportData.map(doc => {
      const obj = doc.toObject();
      return {
        id: obj._id,
        tanggal: obj.createdAt,
        ...obj
      };
    });

    res.status(200).json({ 
      success: true, 
      count: formattedData.length, 
      data: formattedData 
    });

  } catch (error) {
    console.error("Error fetching CEO report:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil data laporan CEO" });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const checkouts = await Checkout.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: checkouts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching history" });
  }
});

router.post("/create", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { totalHarga, items, nama, alamat, noTelpPenerima, diskon, kurir } = req.body;

    const checkoutItems = items.map(item => ({ 
      product: item._id, 
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      price: item.price,
    }));

    const newCheckout = new Checkout({
      ...req.body,
      userId,
      status: 'pending',
      items: checkoutItems,
    });
    
    const savedCheckout = await newCheckout.save();

    const itemDetails = items.map(item => ({
      id: item._id.toString(),
      price: Math.round(item.price),
      quantity: item.quantity,
      name: item.name.substring(0, 50),
    }));
    
    if (kurir && kurir.biaya > 0) {
      itemDetails.push({ 
          id: 'SHIPPING_FEE', 
          price: Math.round(kurir.biaya), 
          quantity: 1, 
          name: 'Courier Fee' 
      });
    }

    if (diskon && diskon > 0) {
      itemDetails.push({
          id: 'VOUCHER_DISCOUNT',
          price: -Math.round(diskon),
          quantity: 1,
          name: 'Discount Voucher'
      });
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
    
    res.status(200).json({ 
        success: true, 
        token: transaction.token,
        orderId: savedCheckout._id 
    });

  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/:id/status", authenticateToken, async (req, res) => {
  try {
    const checkout = await Checkout.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.status(200).json({ success: true, data: checkout });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.put("/cancel/decision/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { decision } = req.body; 

    const order = await Checkout.findById(id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (decision === "approve") {
      await Checkout.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: "Cancellation approved", deleted: true });
    } else {
      order.status = "diproses"; 
      await order.save();
      return res.status(200).json({ success: true, message: "Cancellation rejected", deleted: false, order });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/cancel/:orderId", authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body || {};

    console.log(`[INFO] Cancellation request for orderId=${orderId} by user=${req.user?.id}`);
    console.log(`[INFO] Payload reason=${reason}`);

    const order = await Checkout.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    let cancellation = await Cancellation.findOne({ orderId });
    if (cancellation) {
      cancellation.reason = reason || cancellation.reason;
      cancellation.status = "pembatalan diajukan";
      cancellation.processedAt = null;
      await cancellation.save();
    } else {
      cancellation = await Cancellation.create({
        orderId: order._id,
        reason: reason || "User requested cancellation",
        status: "pembatalan diajukan",
        processedAt: null,
      });
    }

    order.status = "pembatalan diajukan";
    await order.save();

    return res.status(200).json({ success: true, data: cancellation });
  } catch (err) {
    console.error("Error requesting cancellation:", err);
    const message = err?.message || "Server error while requesting cancellation";
    res.status(500).json({ success: false, message });
  }
});

router.post("/verify-payment/:orderId", authenticateToken, async (req, res) => {
    try {
        const { orderId } = req.params;
        const checkout = await Checkout.findById(orderId);
        
        if (!checkout) return res.status(404).json({message: "Order not found"});
        if (checkout.status === 'diproses') {
            return res.status(200).json({ success: true, message: "Already processed" });
        }

        const midtransStatus = await snap.transaction.status(orderId);
        const transactionStatus = midtransStatus.transaction_status;
        const fraudStatus = midtransStatus.fraud_status;
        const paymentType = midtransStatus.payment_type; 

        if (paymentType) {
          checkout.paymentType = paymentType;
          await checkout.save();
        }

        if ((transactionStatus === 'capture' || transactionStatus === 'settlement') && fraudStatus === 'accept') {
            await handleSuccessfulTransaction(checkout);
            return res.status(200).json({ success: true, message: "Payment verified & processed." });
        } else if (transactionStatus === 'pending') {
            return res.status(200).json({ success: true, message: "Payment pending." });
        } else {
            return res.status(400).json({ success: false, message: "Payment failed/incomplete." });
        }

    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({message: "Verification failed"});
    }
});

router.post("/midtrans-notification", async (req, res) => {
  try {
    const statusResponse = await snap.transaction.notification(req.body);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const paymentType = statusResponse.payment_type; 

    console.log(`[Midtrans Notification] Order: ${orderId}, Status: ${transactionStatus}, Payment Type: ${paymentType}`);

    const checkout = await Checkout.findById(orderId);
    if (!checkout) return res.status(404).send('Not Found');

    if (paymentType) {
      checkout.paymentType = paymentType;
      console.log(`[Midtrans Notification] Updated paymentType to: ${paymentType}`);
    }

    if ((transactionStatus === 'capture' || transactionStatus === 'settlement') && fraudStatus === 'accept') {
      await handleSuccessfulTransaction(checkout);
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      checkout.status = 'dibatalkan';
      await checkout.save();
    } else {
      await checkout.save();
    }
    res.status(200).send('OK');
  } catch (error) {
    console.error('[Midtrans Notification Error]', error);
    res.status(500).send('Error');
  }
});

router.get("/loyal-users-report", authenticateToken, async (req, res) => {
  try {
    const loyalUsers = await Checkout.aggregate([
      { $match: { status: { $in: ["selesai", "sampai", "diproses", "dikirim"] } } },
      
      {
        $group: {
          _id: "$userId",
          totalSpent: { $sum: "$totalHarga" },
          orderCount: { $sum: 1 },
          lastOrderDate: { $max: "$createdAt" },
          purchasedItems: { $push: "$items" }
        }
      },
      {
        $lookup: {
          from: "users", 
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 1,
          name: "$userInfo.name",
          username: "$userInfo.username",
          avatar: "$userInfo.avatar",
          email: "$userInfo.email",
          phone: "$userInfo.phone",
          totalSpent: 1,
          orderCount: 1,
          lastOrderDate: 1,
          allItems: {
            $reduce: {
              input: "$purchasedItems",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] }
            }
          }
        }
      },
      
      { $sort: { totalSpent: -1 } }
    ]);

    res.status(200).json({ success: true, data: loyalUsers });
  } catch (error) {
    console.error("Error loyal users report:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil laporan user setia" });
  }
});

router.get("/best-selling-report", authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let matchStage = { 
      status: { $in: ["selesai", "sampai", "dikirim", "diproses"] } 
    };

    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate), 
        $lte: new Date(endDate)    
      };
    }

    const bestSelling = await Checkout.aggregate([
      { $match: matchStage }, 
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          productName: { $first: "$items.name" },
          productImage: { $first: "$items.image" },
          productPrice: { $first: "$items.price" },
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 50 }
    ]);

    res.status(200).json({ success: true, data: bestSelling });
  } catch (error) {
    console.error("Error fetching best selling report:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil laporan barang terlaku" });
  }
});

router.get("/detail/:id", authenticateToken, async (req, res) => {
  try {
    const order = await Checkout.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order detail:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;