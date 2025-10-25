const express = require("express");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    alamat: { type: String, required: true },
    no_telp: { type: String, required: true },
    role: { type: String, required: true },
    cart: [
      {
        products: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
        },
        quantitas: {
          type: Number,
          required: true,
          min: [1, "Quantity tidak boleh kurang dari 1"],
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
