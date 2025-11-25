const express = require("express");
const router = express.Router();
const Checkout = require("../models/Checkout");
const Cart = require("../models/Carts");
const Voucher = require("../models/Voucher");
const Product = require("../models/Product");
const { authenticateToken } = require("../middleware/authenticate");
const snap = require('../config/midtrans');
const Cancellation = require("../models/Cancellation");

const handleSuccessfulTransaction = async (checkout) => {
  if (checkout.status === 'diproses') return;
  console.log(`[LOG] Processing Success Logic for Order: ${checkout._id}`);

  checkout.status = 'diproses';
  await checkout.save();

  if (checkout.items && checkout.items.length > 0) {
    for (const item of checkout.items) {
      const productId = item.product || item.productId;
      if (productId) {
        await Product.updateOne(
          { _id: productId },
          { $inc: { stock: -item.quantity } }
        );
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

router.get("/all", authenticateToken, async (req, res) => {
  try {
    const checkouts = await Checkout.find({}).sort({ createdAt: -1 });
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
      .select("nama totalHarga status createdAt items alamat noTelpPenerima subtotal diskon kurir metodePembayaran kodeVoucher userId")
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

// 7. MIDTRANS NOTIFICATION & VERIFY
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

    const checkout = await Checkout.findById(orderId);
    if (!checkout) return res.status(404).send('Not Found');

    if ((transactionStatus === 'capture' || transactionStatus === 'settlement') && fraudStatus === 'accept') {
      await handleSuccessfulTransaction(checkout);
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      checkout.status = 'dibatalkan';
      await checkout.save();
    }
    res.status(200).send('OK');
  } catch (error) {
    res.status(500).send('Error');
  }
});


router.get("/loyal-users-report", authenticateToken, async (req, res) => {
  try {
    // Aggregasi data menggunakan MongoDB Pipeline
    const loyalUsers = await Checkout.aggregate([
      // 1. Filter hanya pesanan yang sukses
      { $match: { status: { $in: ["selesai", "sampai", "diproses", "dikirim"] } } },
      
      // 2. Grouping berdasarkan User ID
      {
        $group: {
          _id: "$userId",
          totalSpent: { $sum: "$totalHarga" },
          orderCount: { $sum: 1 },
          lastOrderDate: { $max: "$createdAt" },
          purchasedItems: { $push: "$items" } // Kumpulkan semua array items
        }
      },
      
      // 3. Lookup data User untuk ambil nama & avatar
      {
        $lookup: {
          from: "users", // Pastikan nama collection di DB adalah 'users'
          localField: "_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      
      // 4. Unwind array userInfo (karena lookup menghasilkan array)
      { $unwind: "$userInfo" },
      
      // 5. Proyeksi data yang dibutuhkan
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
          // Flatten items array agar lebih mudah dibaca
          allItems: {
            $reduce: {
              input: "$purchasedItems",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] }
            }
          }
        }
      },
      
      // 6. Urutkan berdasarkan Total Belanja (Terbanyak)
      { $sort: { totalSpent: -1 } }
    ]);

    res.status(200).json({ success: true, data: loyalUsers });
  } catch (error) {
    console.error("Error loyal users report:", error);
    res.status(500).json({ success: false, message: "Gagal mengambil laporan user setia" });
  }
});
module.exports = router;