const express = require("express");
const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  deskripsi: String,
});

module.exports = mongoose.model("Products", ProductsSchema);
