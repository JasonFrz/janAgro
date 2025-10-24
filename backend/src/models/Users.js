const express = require("express");
const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String,
  alamat: String,
  no_telp: String,
  role: String,
  cart: [
    {
      products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity tidak boleh kurang dari 1"],
        default: 1,
      },
    },
  ],
});

module.exports = mongoose.model("Users", UsersSchema);
