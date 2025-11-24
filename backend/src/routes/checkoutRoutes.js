const express = require("express");
const router = express.Router();
const Checkout = require("../models/Checkout");
const Cart = require("../models/Carts");
const Voucher = require("../models/Voucher");
const Product = require("../models/Product");
const { authenticateToken } = require("../middleware/authenticate");
const snap = require('../config/midtrans');

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
        console.log(`   -> Stock reduced for product ${productId}`);
      }
    }
  }

  if (checkout.kodeVoucher) {
    await Voucher.updateOne(
      { code: checkout.kodeVoucher },
      { $inc: { currentUses: 1 } }
    );
    console.log(`   -> Voucher usage increased for ${checkout.kodeVoucher}`);
  }

  await Cart.findOneAndUpdate(
    { userId: checkout.userId },
    { $set: { items: [] } }
  );
  console.log(`   -> Cart cleared for user ${checkout.userId}`);
};

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
    const errorMessage = error.ApiResponse ? JSON.stringify(error.ApiResponse) : error.message;
    res.status(500).json({ success: false, message: "Server error: " + errorMessage });
  }
});

router.get("/all", authenticateToken, async (req, res) => {
  try {
    // optionally check if the user is admin
    // if (!req.user.isAdmin) return res.status(403).json({ message: "Forbidden" });

    const checkouts = await Checkout.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: checkouts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching all orders" });
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

        console.log(`[VERIFY] Order ${orderId} status: ${transactionStatus}`);

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

router.get("/", authenticateToken, async (req, res) => {
  try {
    const checkouts = await Checkout.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: checkouts });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching history" });
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

module.exports = router;