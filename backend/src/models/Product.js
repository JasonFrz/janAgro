const express = require("express");
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    kategori: { type: String, required: true },
    harga: { type: Number, required: true },
    deskripsi: { type: String, default: "" },
    stok: { type: Number, default: 0 },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Product", ProductSchema);
