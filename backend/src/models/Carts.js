const mongoose = require("mongoose");
const { Schema } = mongoose;

// Skema untuk setiap item di dalam keranjang
const CartItemSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Mereferensikan ke model Product Anda
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Kuantitas tidak boleh kurang dari 1"],
      default: 1,
    },
    // Sebaiknya simpan juga detail produk saat itu untuk menghindari
    // masalah jika produk aslinya diubah (harga, nama, dll)
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String, // Atau sesuaikan dengan tipe data gambar Anda
    },
  },
  { _id: false } // Tidak perlu _id terpisah untuk sub-dokumen item
);

// Skema utama untuk keranjang belanja
const CartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Mereferensikan ke model User Anda
      required: true,
      unique: true, // Setiap pengguna hanya punya satu keranjang
    },
    items: [CartItemSchema],
    // Anda bisa menambahkan field lain jika perlu, misalnya total harga
    // yang di-cache, tapi lebih aman menghitungnya secara dinamis.
  },
  {
    timestamps: true, // Otomatis menambahkan createdAt dan updatedAt
  }
);

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;