const mongoose = require("mongoose");

const CheckoutSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    nama: { type: String, ref: "User", required: true },
    alamat: { type: String, ref: "User", required: true },
    noTelpPenerima: { type: String, required: true },
    items: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        image: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    diskon: { type: Number, default: 0 },
    kodeVoucher: { type: String, default: null },
    kurir: {
      nama: { type: String, default: "jne" },
      biaya: { type: Number, required: true },
    },
    totalHarga: { type: Number, required: true },
    metodePembayaran: {
      type: String,
      enum: ["Transfer Bank", "COD", "Kartu Kredit"],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "diproses",
        "dikirim",
        "sampai",
        "selesai",
        "dibatalkan",
        "pengembalian diajukan",
        "pengembalian ditolak",
      ],
      default: "diproses",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Checkout", CheckoutSchema);
